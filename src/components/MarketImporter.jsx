import React, { useState } from 'react';

function MarketImporter({ onImport }) {
  const [jsonText, setJsonText] = useState('');

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.success || !parsed.items) throw new Error('Format invalide');

      const priceMap = {};
      parsed.items.forEach(item => {
        const name = item.market_hash_name;
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
          priceMap[name] = price;
        }
      });

      onImport(priceMap);
      alert('✅ Prix marché importés avec succès !');
    } catch (err) {
      alert('❌ Erreur lors de l’import : ' + err.message);
    }
  };

  return (
    <div>
      <h2>📈 Importer les prix du marché</h2>
      <textarea
        rows={15}
        cols={80}
        placeholder="Colle ici ton JSON de prix marché..."
        value={jsonText}
        onChange={e => setJsonText(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Importer</button>
    </div>
  );
}

export default MarketImporter;
