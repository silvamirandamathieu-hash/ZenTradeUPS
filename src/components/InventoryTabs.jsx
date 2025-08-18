import { useState, useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import InventoryManager from './InventoryManager';
import '../styles/InventoryTabs.css'; // ton fichier CSS avec les classes d’animation
import AllSkins from './AllSkins';
import cs2Skins from '../cs2_skins.json'; // adapte le chemin



function InventoryTabs({ inventory, setInventory, priceMap, onExport, onImport, onReset }) {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { key: 'inventory', label: '🎒 Mon inventaire' },
    { key: 'allskins', label: '🗂️ All skins' }
  ];

  const nodeRef = useRef(null); // 👈 ajoute cette ligne avant le return

  const renderTabContent = () => {
    if (activeTab === 'inventory') {
      return (
        <InventoryManager
          inventory={inventory}
          priceMap={priceMap}
          onExport={onExport}
          onImport={onImport}
          onReset={onReset}
        />
      );
    } else if (activeTab === 'allskins') {
      return (
        <AllSkins
          allSkinsInventory={cs2Skins} // ✅ ici on passe tous les skins
          setInventory={setInventory}
          priceMap={priceMap}
          onExport={onExport}
          onImport={onImport}
          onReset={onReset}
        />

      );
    }
  };

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
      <SwitchTransition>
        <CSSTransition
          key={activeTab}
          timeout={300}
          classNames="fade"
          nodeRef={nodeRef} // 👈 Ajout ici
        >
          <div ref={nodeRef}>
            {renderTabContent()}
          </div>
        </CSSTransition>
      </SwitchTransition>


      {/* Contenu de l’onglet actif */}
      
    </div>
  );
}

export default InventoryTabs;
