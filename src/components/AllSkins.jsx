// AllSkins.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  List, Card, SkinImage, SkinTitle, SkinDetails,
  Label, Value, PriceColumn, FilterBar, Select, CollectionImage, ImageWrapper
} from './StyledInventory'; // adapte le chemin
import { getAllInventory, clearAllInventory, bulkAddAllSkins } from "../db";

function AllSkins({ priceMap = {} }) {
  const [allSkins, setAllSkins] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [wearFilter, setWearFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [raritySearch, setRaritySearch] = useState('all');

  //
  // 📥 Chargement initial depuis IndexedDB
  //
  useEffect(() => {
    loadSkins();
  }, []);

  const loadSkins = async () => {
    const dbSkins = await getAllInventory();
    setAllSkins(dbSkins);
  };

  //
  // 🧩 Import JSON → IndexedDB
  //
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (Array.isArray(json)) {
        await bulkAddAllSkins(json);
        await loadSkins();
        alert("✅ Import terminé !");
      } else {
        alert("❌ Le fichier JSON doit contenir un tableau.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'import.");
    }
  };

  //
  // ♻️ Reset DB
  //
  const handleReset = async () => {
    if (window.confirm("Voulez-vous vraiment vider AllSkins ?")) {
      await clearAllInventory();
      setAllSkins([]);
    }
  };

  //
  // 📚 Collections uniques
  //
  const collections = useMemo(() => {
    if (!Array.isArray(allSkins)) return [];
    const unique = new Set(allSkins.map(s => s.collection).filter(Boolean));
    return Array.from(unique).sort();
  }, [allSkins]);

  //
  // 🔍 Filtres appliqués
  //
  const filteredInventory = useMemo(() => {
    if (!Array.isArray(allSkins)) return [];
    return allSkins.filter(allSkin => {
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'stattrak' && allSkin.isST === true) ||
        (typeFilter === 'regular' && !allSkin.isST && !allSkin.isSV) ||
        (typeFilter === 'souvenir' && allSkin.isSV === true);

      const matchesWear = wearFilter === 'all' || allSkin.wear === wearFilter;
      const matchesCollection = collectionFilter === 'all' || allSkin.collection === collectionFilter;
      const matchesSearch = searchQuery.trim() === '' || allSkin.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesRarity = raritySearch === 'all' || allSkin.rarity === raritySearch;

      return matchesType && matchesWear && matchesCollection && matchesSearch && matchesRarity;
    });
  }, [allSkins, typeFilter, wearFilter, collectionFilter, searchQuery, raritySearch]);

  //
  // 🔄 Reset filtres
  //
  const handleResetFilters = () => {
    setTypeFilter('all');
    setWearFilter('all');
    setCollectionFilter('all');
    setSearchQuery('');
    setRaritySearch('all');
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* 🧰 Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <label>
          📥 Importer JSON
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
        </label>
        <button onClick={handleReset}>♻️ Reset AllSkins</button>
      </div>

      {/* 🔍 Filtres */}
      <FilterBar>
        <input
          type="text"
          placeholder="🔎 Rechercher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Tous les types</option>
          <option value="stattrak">StatTrak™</option>
          <option value="regular">Non StatTrak</option>
          <option value="souvenir">Souvenir</option>
        </Select>
        <Select value={wearFilter} onChange={e => setWearFilter(e.target.value)}>
          <option value="all">Toutes les usures</option>
          <option value="Factory New">Factory New</option>
          <option value="Minimal Wear">Minimal Wear</option>
          <option value="Field-Tested">Field-Tested</option>
          <option value="Well-Worn">Well-Worn</option>
          <option value="Battle-Scarred">Battle-Scarred</option>
        </Select>
        <Select value={raritySearch} onChange={e => setRaritySearch(e.target.value)}>
          <option value="all">Toutes les raretés</option>
          <option value="Consumer Grade">Consumer Grade</option>
          <option value="Industrial Grade">Industrial Grade</option>
          <option value="Mil-Spec Grade">Mil-Spec Grade</option>
          <option value="Restricted">Restricted</option>
          <option value="Classified">Classified</option>
          <option value="Covert">Covert</option>
        </Select>
        <Select value={collectionFilter} onChange={e => setCollectionFilter(e.target.value)}>
          <option value="all">Toutes les collections</option>
          {collections.map((col, i) => <option key={i} value={col}>{col}</option>)}
        </Select>
        <button onClick={handleResetFilters}>🔄 Réinitialiser les filtres</button>
      </FilterBar>

      {/* 📦 Liste des skins */}
      <List>
        {filteredInventory.length === 0 ? (
          <p>Aucun skin trouvé.</p>
        ) : (
          filteredInventory.map((allSkin, i) => {
            const price = priceMap[`${allSkin.name} (${allSkin.wear})`] || allSkin.price || 'N/A';
            return (
              <Card key={i} rarity={allSkin.rarity}>
                <ImageWrapper>
                  <SkinImage src={allSkin.imageUrl} alt={allSkin.name} isStatTrak={allSkin.isST} />
                </ImageWrapper>
                <SkinDetails>
                  <SkinTitle rarity={allSkin.rarity} isStatTrak={allSkin.isST}>
                    {allSkin.isST && <span style={{ fontSize: '1rem', color: '#FFA500', marginRight: '0.5rem' }}>StatTrak™</span>}
                    {allSkin.name}
                    {allSkin.collectionImage && <CollectionImage src={allSkin.collectionImage} />}
                  </SkinTitle>

                  <p><Label>Usure:</Label> <Value>{allSkin.wear}</Value></p>
                  <p><Label>Collection:</Label> <Value>{allSkin.collection}</Value></p>
                  <p><Label>Rareté:</Label> <Value>{allSkin.rarity}</Value></p>
                </SkinDetails>
                <PriceColumn>
                  <span>{price} €</span>
                </PriceColumn>
              </Card>
            );
          })
        )}
      </List>
    </div>
  );
}

export default AllSkins;
