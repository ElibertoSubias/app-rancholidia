
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import AnimalForm from '@/components/AnimalForm';
import AnimalList from '@/components/AnimalList';
import SyncStatus from '@/components/SyncStatus';
import { useLocalStorage } from '@/hooks/useLocalStorage';

function App() {
  const [animals, setAnimals] = useLocalStorage('ganado-animals', []);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch((err) => console.error('Error al registrar SW:', err));
    }
  }, []);

  const handleSearch = (code) => {
    setSearchCode(code);
    const found = animals.find(a => a.codigo === code);
    if (found) {
      setSelectedAnimal(found);
      setShowForm(true);
    } else {
      setSelectedAnimal({ codigo: code });
      setShowForm(true);
    }
  };

  const handleSaveAnimal = (animalData) => {
    const existingIndex = animals.findIndex(a => a.codigo === animalData.codigo);
    
    if (existingIndex >= 0) {
      const updated = [...animals];
      updated[existingIndex] = { ...animalData, updatedAt: new Date().toISOString() };
      setAnimals(updated);
    } else {
      setAnimals([...animals, { ...animalData, createdAt: new Date().toISOString() }]);
    }
    
    setShowForm(false);
    setSelectedAnimal(null);
    setSearchCode('');
  };

  const handleDeleteAnimal = (codigo) => {
    setAnimals(animals.filter(a => a.codigo !== codigo));
  };

  const handleEditAnimal = (animal) => {
    setSelectedAnimal(animal);
    setShowForm(true);
  };

  return (
    <>
      <Helmet>
        <title>Control de Ganado - Sistema de Inventario</title>
        <meta name="description" content="Sistema PWA para control y gestión de inventario de ganado con sincronización offline" />
      </Helmet>

      <div className="min-h-screen pb-20">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SearchBar onSearch={handleSearch} />
            
            <SyncStatus totalAnimals={animals.length} />

            <AnimatePresence mode="wait">
              {showForm ? (
                <AnimalForm
                  key="form"
                  animal={selectedAnimal}
                  onSave={handleSaveAnimal}
                  onCancel={() => {
                    setShowForm(false);
                    setSelectedAnimal(null);
                    setSearchCode('');
                  }}
                />
              ) : (
                <AnimalList
                  key="list"
                  animals={animals}
                  onEdit={handleEditAnimal}
                  onDelete={handleDeleteAnimal}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        <Toaster />
      </div>
    </>
  );
}

export default App;
  