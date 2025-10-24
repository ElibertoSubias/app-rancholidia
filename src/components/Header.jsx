
import React from 'react';
import { motion } from 'framer-motion';
import { Beef } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-effect sticky top-0 z-50 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Beef className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Control de Ganado</h1>
            <p className="text-xs text-purple-300">Sistema de Inventario PWA</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
  