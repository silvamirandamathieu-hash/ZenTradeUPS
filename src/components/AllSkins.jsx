import React, { useState, useMemo } from 'react';
import {
  List, Card, SkinImage, SkinTitle, SkinDetails,
  Label, Value, PriceColumn, FilterBar, Select, CollectionImage, ImageWrapper
} from './StyledInventory'; // adapte le chemin

import { db } from '../db';
import cs2Skins from '../cs2_skins.json'; // adapte le chemin


function AllSkins({ allSkinsInventory, setInventory, priceMap, onExport, onImport, onReset }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [wearFilter, setWearFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [raritySearch, setRaritySearch] = useState('all');

  const rarityOrder = [
    "Consumer Grade", "Industrial Grade", "Mil-Spec Grade", "Restricted",
    "Classified", "Covert", "Contraband", "Extraordinary"
  ];

  const collections = useMemo(() => {
    const unique = new Set(allSkinsInventory.map(s => s.collection).filter(Boolean));
    return Array.from(unique).sort();
  }, [allSkinsInventory]);

  const filteredInventory = useMemo(() => {
    return allSkinsInventory.filter(skin => {
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'stattrak' && skin.isST === "StaTrack Available") ||
        (typeFilter === 'regular' && skin.isST === "N/A" && skin.isSV === "N/A") ||
        (typeFilter === 'souvenir' && skin.isSV === "Souvenir Available");

      const matchesWear = wearFilter === 'all' || skin.wear === wearFilter;
      const matchesCollection = collectionFilter === 'all' || skin.collection === collectionFilter;
      const matchesSearch = searchQuery.trim() === '' || skin.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesRarity = raritySearch === 'all' || skin.rarity === raritySearch;

      return matchesType && matchesWear && matchesCollection && matchesSearch && matchesRarity;
    });
  }, [allSkinsInventory, typeFilter, wearFilter, collectionFilter, searchQuery, raritySearch]);

  const handleImportFromJson = async () => {
    try {
      if (!Array.isArray(cs2Skins)) return alert("Fichier JSON invalide.");
      setInventory(cs2Skins);
      await db.inventory.clear();
      await db.inventory.bulkAdd(cs2Skins);
      alert("Import depuis JSON réussi !");
    } catch (err) {
      console.error(err);
      alert("Erreur d'importation.");
    }
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setWearFilter('all');
    setCollectionFilter('all');
    setSearchQuery('');
    setRaritySearch('all');
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* 🧰 Boutons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={handleImportFromJson}>📥 Importer depuis JSON</button>
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
          <option value="Consumer">Consumer</option>
          <option value="Industrial">Industrial</option>
          <option value="Mil-spec">Mil-spec</option>
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
          filteredInventory.map((skin, i) => {
            const price = priceMap[`${skin.name} (${skin.wear})`] || 'N/A';
            return (
              <Card key={i} rarity={skin.rarity}>
                <ImageWrapper>
                  <SkinImage src={skin.imageUrl} alt={skin.name} isStatTrak={skin.isST === "StaTrack Available"} />
                </ImageWrapper>
                <SkinDetails>
                  <SkinTitle rarity={skin.rarity} isStatTrak={skin.isST === "StaTrack Available"}>
                    {skin.isST === "StaTrack Available" && <span style={{ fontSize: '1rem', color: '#FFA500', marginRight: '0.5rem' }}>StatTrak™</span>}
                    {skin.name}
                    {skin.collectionImage && <CollectionImage src={skin.collectionImage} />}
                  </SkinTitle>

                  <p><Label>Usure:</Label> <Value>{skin.wear}</Value></p>
                  <p><Label>Collection:</Label> <Value>{skin.collection}</Value></p>
                  <p><Label>Rareté:</Label> <Value>{skin.rarity}</Value></p>
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
