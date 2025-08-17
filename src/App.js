import React, { useState, useEffect } from 'react';
import { getInventory, addSkin, clearInventory } from './db';
import InventoryTabs from './components/InventoryTabs';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { db } from './db';

function App() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [priceMap, setPriceMap] = useState(() => {
    const saved = localStorage.getItem('priceMap');
    return saved ? JSON.parse(saved) : {};
  });
  const [darkMode, setDarkMode] = useState(false);
  


  useEffect(() => {
    getInventory().then(setInventory);
  }, []);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          alert('Le fichier doit contenir un tableau de skins.');
          return;
        }

        if (data.length === 0) {
          alert('Le fichier est vide.');
          return;
        }

        // 🔍 Optionnel : validation de chaque skin
        const isValid = data.every(skin =>
          skin.name && skin.wear && skin.imageUrl
        );

        if (!isValid) {
          alert('Certains skins sont mal formatés.');
          return;
        }

        setInventory(data);
        await db.inventory.clear();
        await db.inventory.bulkAdd(data); // ✅ Met à jour ton inventaire
        alert('Inventaire importé avec succès !');
      } catch (err) {
        console.error('Erreur d’importation :', err);
        alert('Le fichier est invalide ou corrompu.');
      }
    };

    input.click();
  };


  const handleExport = () => {
    const json = JSON.stringify(inventory, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    await clearInventory();
    setInventory([]);
  };

  const handleMarketImport = (newPrices) => {
    setPriceMap(prev => ({ ...prev, ...newPrices }));
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div style={{
        background: darkMode ? darkTheme.colors.bg : lightTheme.colors.bg,
        minHeight: '100vh',
        padding: '2rem',
        transition: 'background 0.3s ease',
        color: darkMode ? darkTheme.colors.text : lightTheme.colors.text
      }}>
        <h1>🎮 Gestionnaire de Skins CS</h1>

        {/* Toggle mode */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: darkMode ? '#334155' : '#e2e8f0',
              color: darkMode ? '#e8ecefff' : '#1f2937',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>
        {/* Erreur */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Inventaire */}
        <InventoryTabs
          inventory={inventory}
          priceMap={priceMap}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleReset}
        />

      </div>
    </ThemeProvider>
  );
}

export default App;
