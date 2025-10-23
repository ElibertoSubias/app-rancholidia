
import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SyncStatus = ({ totalAnimals }) => {
  const handleSync = () => {
    toast({
      title: "🚧 Sincronización pendiente",
      description: "La sincronización con el servidor estará disponible pronto. Todos los datos están guardados localmente.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-effect rounded-xl p-4 mb-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <CloudOff className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <p className="text-sm font-semibold">Modo Offline</p>
          <p className="text-xs text-gray-400">{totalAnimals} registros locales</p>
        </div>
      </div>

      <Button
        onClick={handleSync}
        variant="outline"
        size="sm"
        className="border-purple-500/50 hover:bg-purple-500/10"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Sincronizar
      </Button>
    </motion.div>
  );
};

export default SyncStatus;
  