
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/library';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState(null);
  const [videoDevice, setVideoDevice] = useState(null);
  const [openCamera, setOpenCamera] = useState(false);
  // NUEVO: Referencia para mantener la instancia del lector
  const readerRef = useRef(null);

  useEffect(() => {

    let readerInstance = null;

    if (videoDevice) {

      // const reader = new BrowserMultiFormatReader();
      readerInstance = new BrowserMultiFormatReader();

      // Guarda la instancia en la referencia para poder limpiarla después
      readerRef.current = readerInstance;

      readerInstance.decodeFromVideoDevice(videoDevice.deviceId, 'video', (result) => {
        if (result) {
          setResult(result.text);
          onScanSuccess(result.text.trim());
          setOpenCamera(false);
          setVideoDevice(null);
          readerInstance.reset();
        }
      });
    }

    // FUNCIÓN DE LIMPIEZA: Se ejecuta cuando el componente se desmonta (cierra el modal)
    return () => {
      if (readerRef.current) {
        // Detiene el stream y limpia los recursos del lector
        readerRef.current.reset(); 
        readerRef.current = null;
        console.log("Cámara detenida y recursos liberados.");
      }
    };

  },[videoDevice]);

  const handleCameraClick = () => {
    setOpenCamera(true);
    const reader = new BrowserMultiFormatReader();
    async function init() {
      const videoDevice = await reader.listVideoInputDevices();
      if (videoDevice.length > 0) {
        for (let index = 0; index < videoDevice.length; index++) {
          alert(videoDevice[index].label);
          
        }
        setVideoDevice(videoDevice[0]);
      }
    }
    init();
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      toast({
        title: "✅ Código capturado",
        description: `Código: ${manualCode}`,
      });
    }
  };

  const handleClose = () => {
    // Si la cámara está abierta y el usuario cancela, resetea el lector
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    onClose();
  };

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-effect rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold gradient-text">Escanear Código</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {openCamera ? (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <video id='video' style={{ width: '100%', height: 'auto', display: 'block' }} />
              {result ? (
              <p>Scanned coce: {result}</p>
            ):(
              <p>Scanning...</p>
            )}
            </div>
          ): (
            <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-500/50">
              <Button
                onClick={handleCameraClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Camera className="w-5 h-5 mr-2" />
                Activar Cámara
              </Button>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-950 px-2 text-gray-400">O ingresa manualmente</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Código del animal"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              onClick={handleManualSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              OK
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  // ----------------------------------------------------
  // USANDO EL PORTAL PARA SALIR DEL PADRE
  // ----------------------------------------------------
  
  // 1. Obtener el nodo donde quieres renderizar (el nuevo div en index.html)
  const portalRoot = document.getElementById('modal-root');

  // 2. Si el nodo no existe (nunca debería pasar), retorna null o un fallback
  if (!portalRoot) return null; 

  // 3. Renderiza el contenido del modal dentro del nodo 'modal-root'
  return ReactDOM.createPortal(
    modalContent,
    portalRoot
  );

};

export default BarcodeScanner;
  