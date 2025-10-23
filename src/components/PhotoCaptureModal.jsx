import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ReactDOM from 'react-dom'; // Necesario para el Portal

const PhotoCaptureModal = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  
  // Opciones de configuración para forzar la cámara trasera en móviles
  const videoConstraints = {
    facingMode: { ideal: 'environment' }
  };

  const capture = () => {
    // Obtiene la imagen en Base64
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      onCapture(imageSrc); // Envía el Base64 al formulario padre
      onClose();
    } else {
      toast({
        title: "⚠️ Error de Cámara",
        description: "No se pudo tomar la fotografía. Asegúrate de dar permisos.",
        variant: "destructive"
      });
    }
  };

  // Usamos el portal para asegurar que el modal cubra toda la pantalla
  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-xl p-4 max-w-lg w-full"
        >
          <div className="relative mb-4 rounded-lg overflow-hidden border-4 border-white/20">
            {/* El componente de la cámara */}
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-auto"
            />
            {/* Overlay para el viewfinder */}
            <div className="absolute inset-0 border-8 border-dashed border-red-500/50 pointer-events-none"></div>
          </div>

          <div className="flex justify-between items-center">
             <Button onClick={onClose} variant="ghost" className="text-white">
                <X className="w-5 h-5 mr-2" />
                Cancelar
             </Button>
             <Button onClick={capture} className="bg-green-600 hover:bg-green-700">
                <Camera className="w-5 h-5 mr-2" />
                Capturar
             </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.getElementById('modal-root') // Asumiendo que usas 'modal-root' de la solución anterior
  );
};

export default PhotoCaptureModal;