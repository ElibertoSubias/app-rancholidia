
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Camera, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import BarcodeScanner from '@/components/BarcodeScanner';

const SearchBar = ({ onSearch }) => {
  const [code, setCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleManualSearch = () => {
    if (!code.trim()) {
      toast({
        title: "⚠️ Código requerido",
        description: "Por favor ingresa un código para buscar",
        variant: "destructive"
      });
      return;
    }
    onSearch(code.trim());
  };

  const handleScanSuccess = (scannedCode) => {
    setCode(scannedCode);
    setShowScanner(false);
    onSearch(scannedCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl p-6 mb-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Scan className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold">Buscar Animal</h2>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Ingresa el código del animal..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12"
          />
        </div>
        
        <Button
          onClick={handleManualSearch}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 px-6"
        >
          <Search className="w-5 h-5 mr-2" />
          Buscar
        </Button>

        <Button
          onClick={() => setShowScanner(true)}
          variant="outline"
          className="border-purple-500/50 hover:bg-purple-500/10 h-12 px-6"
        >
          <Camera className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showScanner && (
          <BarcodeScanner
            key="barcode-scanner-modal"
            onScanSuccess={handleScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
  