import { useState } from 'react';
import InventoryManager from './InventoryManager';

function InventoryTabs({ inventory, priceMap }) {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { key: 'inventory', label: '🎒 Mon inventaire' },
    { key: 'allskins', label: '🗂️ All skins' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Onglets */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.key ? '#3182ce' : '#e2e8f0',
              color: activeTab === tab.key ? '#fff' : '#2d3748',
              fontWeight: 'bold'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu de l’onglet actif */}
      {activeTab === 'inventory' && (
        <InventoryManager inventory={inventory} priceMap={priceMap} />
      )}

      {activeTab === 'allskins' && (
        <div style={{ fontStyle: 'italic', color: '#718096' }}>
          🧪 Placeholder pour "All skins" – Tu pourras afficher ici tous les skins disponibles.
        </div>
      )}
    </div>
  );
}

export default InventoryTabs;
