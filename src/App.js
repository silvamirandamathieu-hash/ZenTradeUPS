import React, { useState, useEffect } from 'react';
import { getInventory, addSkin, clearInventory } from './db';
import InventoryManager from './components/InventoryManager';
import MarketImporter from './components/MarketImporter';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme'; 


function App() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [priceMap, setPriceMap] = useState(() => {
    const saved = localStorage.getItem('priceMap');
    return saved ? JSON.parse(saved) : {};
  });
  const [activeTab, setActiveTab] = useState('inventory');

  useEffect(() => {
    getInventory().then(setInventory);
  }, []);

  useEffect(() => {
    localStorage.setItem('priceMap', JSON.stringify(priceMap));
  }, [priceMap]);

  const handleImport = async e => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const raw = ev.target.result;
        const data = JSON.parse(raw);

        if (!Array.isArray(data)) throw new Error('Le JSON doit être un tableau.');

        await clearInventory();
        for (const skin of data) {
          await addSkin(skin);
        }
        setInventory(await getInventory());
      } catch (err) {
        setError(`❌ Erreur import : ${err.message}`);
      }
    };

    reader.readAsText(file);
    e.target.value = '';
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
    <ThemeProvider theme={theme}>
      <>
        <div style={{ padding: 20 }}>
          <h1>🎮 Gestionnaire de Skins CS</h1>

          {/* Onglets */}
          <div style={{ marginBottom: 20 }}>
            <button onClick={() => setActiveTab('inventory')} disabled={activeTab === 'inventory'}>
              🎒 Inventaire
            </button>
            <button onClick={() => setActiveTab('market')} disabled={activeTab === 'market'}>
              📈 Prix Marché
            </button>
          </div>

          {/* Boutons d'action */}
          {activeTab === 'inventory' && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <button onClick={handleExport}>📤 Exporter</button>
              <label>
                📥 Importer
                <input type="file" accept=".json,.txt" onChange={handleImport} style={{ display: 'none' }} />
              </label>
              <button onClick={handleReset} style={{ color: 'red' }}>🗑️ Réinitialiser</button>
            </div>
          )}

          {/* Erreur */}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Contenu des onglets */}
          {activeTab === 'inventory' && (
            <InventoryManager inventory={inventory} priceMap={priceMap} />
          )}
          {activeTab === 'market' && (
            <MarketImporter onImport={handleMarketImport} />
          )}
        </div>
      </>
    </ThemeProvider>
  );

}

export default App;
