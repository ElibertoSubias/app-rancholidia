
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Calendar, Weight, Milk } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AnimalList = ({ animals, onEdit, onDelete }) => {
  const handleDelete = (codigo) => {
    if (window.confirm('¿Estás seguro de eliminar este animal?')) {
      onDelete(codigo);
      toast({
        title: "🗑️ Animal eliminado",
        description: "El registro ha sido eliminado del almacenamiento local",
      });
    }
  };

  if (animals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-effect rounded-2xl p-12 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="text-4xl">🐄</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No hay animales registrados</h3>
        <p className="text-gray-400">Usa el buscador para agregar tu primer animal</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold gradient-text">Inventario ({animals.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animals.map((animal, index) => (
          <motion.div
            key={animal.codigo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect rounded-xl p-5 hover:bg-white/10 transition-all group"
          >
            {animal.fotografia && (
              <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={animal.fotografia}
                  alt={animal.codigo}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-purple-300">{animal.codigo}</h3>
                  {animal.propietario && (
                    <p className="text-sm text-gray-400">{animal.propietario}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {animal.edad && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{animal.edad} años</span>
                  </div>
                )}
                {animal.peso && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Weight className="w-4 h-4 text-pink-400" />
                    <span>{animal.peso} kg</span>
                  </div>
                )}
                {animal.produccionLeche && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Milk className="w-4 h-4 text-blue-400" />
                    <span>{animal.produccionLeche} L/día</span>
                  </div>
                )}
                {animal.partos && (
                  <div className="text-gray-300">
                    <span className="text-purple-400">Partos:</span> {animal.partos}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => onEdit(animal)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-500/50 hover:bg-purple-500/10"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(animal.codigo)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimalList;
  