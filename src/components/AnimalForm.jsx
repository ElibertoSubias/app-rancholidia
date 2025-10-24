
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import PhotoCaptureModal from '@/components/PhotoCaptureModal';

const AnimalForm = ({ animal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    codigo: '',
    propietario: '',
    edad: '',
    peso: '',
    fotografia: '',
    imageBarCode: '',
    partos: '',
    produccionLeche: '',
    fechaNacimiento: ''
  });
  const [showCameraModal, setShowCameraModal] = useState(false); // NUEVO ESTADO
  const [imageActive, setImageActive] = useState(null);

  useEffect(() => {
    if (animal) {
      setFormData({
        codigo: animal.codigo || '',
        propietario: animal.propietario || '',
        edad: animal.edad || '',
        peso: animal.peso || '',
        fotografia: animal.fotografia || '',
        imageBarCode: animal.imageBarCode || '',
        partos: animal.partos || '',
        produccionLeche: animal.produccionLeche || '',
        fechaNacimiento: animal.fechaNacimiento || ''
      });
    }
  }, [animal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    let value = "";

    if (e.target.id == "file-upload-barcode") {
      value = "file-upload-barcode";
    } else {
      value = "file-upload";
    }

    if (file) {
      // 1. Verificar el tipo de archivo (opcional pero recomendado)
      if (!file.type.startsWith('image/')) {
        toast({
          title: "⚠️ Tipo de archivo no válido",
          description: "Por favor, sube solo archivos de imagen (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // 2. Crear un FileReader
      const reader = new FileReader();

      // 3. Definir qué hacer cuando la lectura del archivo termine
      reader.onloadend = () => {
        // El resultado es la cadena Base64
        if (value === "file-upload") {
          setFormData(prev => ({ ...prev, fotografia: reader.result }));
        } else {
          setFormData(prev => ({ ...prev, imageBarCode: reader.result }));
        }
        
        toast({
          title: "🖼️ Imagen cargada",
          description: "La imagen está lista para ser guardada como Base64.",
        });
      };

      // 4. Iniciar la lectura del archivo como URL de datos (Base64)
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoCapture = (imageActiveFlag) => {
    setImageActive(imageActiveFlag);
    setShowCameraModal(true);
  };

  const handleCaptureSuccess = (base64Image) => {
    if (imageActive === "file-upload") {
      setFormData(prev => ({ ...prev, fotografia: base64Image }));
    } else {
      setFormData(prev => ({ ...prev, imageBarCode: base64Image }));
    }
    
    setShowCameraModal(false);
    toast({
        title: "📸 Foto Capturada",
        description: "La imagen de la cámara ha sido cargada.",
    });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.codigo.trim()) {
      toast({
        title: "⚠️ Error",
        description: "El código es obligatorio",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "✅ Guardado exitoso",
      description: `Animal ${formData.codigo} guardado localmente`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-effect rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">
          {animal?.propietario ? 'Editar Animal' : 'Nuevo Animal'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-purple-300">Código *</Label>
            <Input
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="bg-white/5 border-white/10 text-white"
              placeholder="Ej: A001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="propietario" className="text-purple-300">Propietario</Label>
            <Input
              id="propietario"
              name="propietario"
              value={formData.propietario}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Nombre del propietario"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edad" className="text-purple-300">Edad (años)</Label>
            <Input
              id="edad"
              name="edad"
              type="number"
              value={formData.edad}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso" className="text-purple-300">Peso (kg)</Label>
            <Input
              id="peso"
              name="peso"
              type="number"
              value={formData.peso}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partos" className="text-purple-300">Número de Partos</Label>
            <Input
              id="partos"
              name="partos"
              type="number"
              value={formData.partos}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="produccionLeche" className="text-purple-300">Producción Leche (L/día)</Label>
            <Input
              id="produccionLeche"
              name="produccionLeche"
              type="number"
              value={formData.produccionLeche}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaNacimiento" className="text-purple-300">Fecha de Nacimiento</Label>
            <Input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Fotografía</Label>
            <div className="flex gap-2">
              {/* ---------------------------------------------------- */}
              {/* 1. INPUT FILE OCULTO */}
              {/* ---------------------------------------------------- */}
              <input
                type="file"
                id="file-upload" // <- Usaremos este ID para enlazarlo al Label/Botón
                accept="image/*" // <- Solo acepta archivos de imagen
                onChange={handleImageUpload} // <- NUEVO HANDLER
                className="hidden" // <- Ocultamos el input feo
              />
              {/* ---------------------------------------------------- */}
              {/* 2. PREVISUALIZACIÓN DE NOMBRE DE ARCHIVO O BASE64 */}
              {/* ---------------------------------------------------- */}
              <Input
                value={
                  formData.fotografia 
                    ? (formData.fotografia.length > 50 ? 'Imagen Base64 cargada' : formData.fotografia) 
                    : 'Selecciona una imagen o pega un enlace'
                }
                readOnly // <- Hacemos que la entrada sea de solo lectura para mostrar el estado
                className="bg-white/5 border-white/10 text-white flex-1 cursor-default"
              />
              {/* ---------------------------------------------------- */}
              {/* 3. BOTÓN DE SUBIDA (Activa el input oculto) */}
              {/* ---------------------------------------------------- */}
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload').click()} // <- CLIC
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/10"
                title="Subir archivo"
              >
                <Upload className="w-5 h-5" />
              </Button>
              {/* ---------------------------------------------------- */}
              {/* 4. BOTÓN DE CÁMARA (Llamada al Toast) */}
              {/* ---------------------------------------------------- */}
              <Button
                type="button"
                onClick={() => handlePhotoCapture('file-upload')}
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/10"
                title="Usar cámara"
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-purple-300">Código de Barras</Label>
            <div className="flex gap-2">
              {/* ---------------------------------------------------- */}
              {/* 1. INPUT FILE OCULTO */}
              {/* ---------------------------------------------------- */}
              <input
                type="file"
                id="file-upload-barcode" // <- Usaremos este ID para enlazarlo al Label/Botón
                accept="image/*" // <- Solo acepta archivos de imagen
                onChange={handleImageUpload} // <- NUEVO HANDLER
                className="hidden" // <- Ocultamos el input feo
              />
              {/* ---------------------------------------------------- */}
              {/* 2. PREVISUALIZACIÓN DE NOMBRE DE ARCHIVO O BASE64 */}
              {/* ---------------------------------------------------- */}
              <Input
                value={
                  formData.imageBarCode 
                    ? (formData.imageBarCode.length > 50 ? 'Imagen Base64 cargada' : formData.imageBarCode) 
                    : 'Selecciona una imagen o pega un enlace'
                }
                readOnly // <- Hacemos que la entrada sea de solo lectura para mostrar el estado
                className="bg-white/5 border-white/10 text-white flex-1 cursor-default"
              />
              {/* ---------------------------------------------------- */}
              {/* 3. BOTÓN DE SUBIDA (Activa el input oculto) */}
              {/* ---------------------------------------------------- */}
              <Button
                type="button"
                onClick={() => document.getElementById('file-upload-barcode').click()} // <- CLIC
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/10"
                title="Subir archivo"
              >
                <Upload className="w-5 h-5" />
              </Button>
              {/* ---------------------------------------------------- */}
              {/* 4. BOTÓN DE CÁMARA (Llamada al Toast) */}
              {/* ---------------------------------------------------- */}
              <Button
                type="button"
                onClick={() => handlePhotoCapture('file-upload-barcode')}
                variant="outline"
                className="border-purple-500/50 hover:bg-purple-500/10"
                title="Usar cámara"
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* RENDERIZADO CONDICIONAL DEL MODAL DE CAPTURA */}
          {/* ---------------------------------------------------- */}
          {showCameraModal && (
            <PhotoCaptureModal 
              onCapture={handleCaptureSuccess}
              onClose={() => setShowCameraModal(false)}
            />
          )}

        </div>

        {formData.fotografia && (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img
              src={formData.fotografia}
              alt="Vista previa"
              className="w-full h-68 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {formData.imageBarCode && (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img
              src={formData.imageBarCode}
              alt="Vista previa"
              className="w-full h-68 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Localmente
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-white/10 hover:bg-white/5 h-12 px-8"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AnimalForm;
  