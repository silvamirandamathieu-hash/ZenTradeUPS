// AllSkins.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  List, Card, SkinImage, SkinTitle, SkinDetails,
  Label, Value, PriceColumn, FilterBar, Select, CollectionImage, ImageWrapper
} from './StyledInventory'; // adapte le chemin
import { getAllInventory, clearAllInventory, bulkAddAllSkins } from "../db";

import AK47 from '../scrapedskins/AK-47_img.json';
import AUG from '../scrapedskins/AUG_img.json';
import AWP from '../scrapedskins/AWP_img.json';
import CZ75Auto from '../scrapedskins/CZ75-Auto_img.json';
import DesertEagle from '../scrapedskins/Desert Eagle_img.json';
import DualBerettas from '../scrapedskins/Dual Berettas_img.json';
import FAMAS from '../scrapedskins/FAMAS_img.json';
import FiveSeveN from '../scrapedskins/Five-SeveN_img.json';
import G3SG1 from '../scrapedskins/G3SG1_img.json';
import GalilAR from '../scrapedskins/Galil AR_img.json';
import Glock18 from '../scrapedskins/Glock-18_img.json';
import M4A1S from '../scrapedskins/M4A1-S_img.json';
import M4A4 from '../scrapedskins/M4A4_img.json';
import M249 from '../scrapedskins/M249_img.json';
import MAC10 from '../scrapedskins/MAC-10_img.json';
import MAG7 from '../scrapedskins/MAG-7_img.json';
import MP5SD from '../scrapedskins/MP5-SD_img.json';
import MP7 from '../scrapedskins/MP7_img.json';
import MP9 from '../scrapedskins/MP9_img.json';
import Negev from '../scrapedskins/Negev_img.json';
import Nova from '../scrapedskins/Nova_img.json';
import P90 from '../scrapedskins/P90_img.json';
import P250 from '../scrapedskins/P250_img.json';
import P2000 from '../scrapedskins/P2000_img.json';
import PPBizon from '../scrapedskins/PP-Bizon_img.json';
import R8Revolver from '../scrapedskins/R8 Revolver_img.json';
import SawedOff from '../scrapedskins/Sawed-Off_img.json';
import SCAR20 from '../scrapedskins/SCAR-20_img.json';
import SG553 from '../scrapedskins/SG 553_img.json';
import SSG08 from '../scrapedskins/SSG 08_img.json';
import Tec9 from '../scrapedskins/Tec-9_img.json';
import UMP45 from '../scrapedskins/UMP-45_img.json';
import USPS from '../scrapedskins/USP-S_img.json';
import XM1014 from '../scrapedskins/XM1014_img.json';
import ZeusX27 from '../scrapedskins/Zeus x27_img.json';

const scrapedData = [
  ...AK47,
  ...AUG,
  ...AWP,
  ...CZ75Auto,
  ...DesertEagle,
  ...DualBerettas,
  ...FAMAS,
  ...FiveSeveN,
  ...G3SG1,
  ...GalilAR,
  ...Glock18,
  ...M4A1S,
  ...M4A4,
  ...M249,
  ...MAC10,
  ...MAG7,
  ...MP5SD,
  ...MP7,
  ...MP9,
  ...Negev,
  ...Nova,
  ...P90,
  ...P250,
  ...P2000,
  ...PPBizon,
  ...R8Revolver,
  ...SawedOff,
  ...SCAR20,
  ...SG553,
  ...SSG08,
  ...Tec9,
  ...UMP45,
  ...USPS,
  ...XM1014,
  ...ZeusX27
];
const normalizeRarity = (rarity) => {
  const map = {
    'Mil-spec': 'Mil-Spec Grade',
    'Consumer': 'Consumer Grade',
    'Industrial': 'Industrial Grade',
    'Restricted': 'Restricted',
    'Classified': 'Classified',
    'Covert': 'Covert',
    'Contraband': 'Contraband',
    'Rare': 'Rare'
  };
  return map[rarity] || rarity;
};

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
    const generateMissingRegularVariants = async () => {
    const existingSkins = await getAllInventory();
    const newRegulars = [];

    for (const skin of existingSkins) {
      if (skin.isStatTrak || skin.isSouvenir) {
        const alreadyExists = existingSkins.some(s =>
          s.name === skin.name &&
          s.wear === skin.wear &&
          !s.isStatTrak &&
          !s.isSouvenir
        );

        if (!alreadyExists) {
          newRegulars.push({
            ...skin,
            isStatTrak: false,
            isSouvenir: false,
          });
        }
      }
    }

    if (newRegulars.length === 0) {
      alert("✅ Toutes les variantes regular existent déjà !");
      return;
    }

    await bulkAddAllSkins(newRegulars);
    await loadSkins();
    alert(`✅ ${newRegulars.length} variantes regular ajoutées !`);
  };

  const updateSkinsFromScrapedData = async () => {
    if (!window.confirm("Mettre à jour les images et variantes ST/SV ?")) return;

    const existingSkins = await getAllInventory();
    const updatedSkins = [];

    for (const scraped of scrapedData) {
      const { name, imageUrl, isST, isSV, rarity } = scraped;

      // Trouver les usures existantes pour ce skin
      const wearVariants = existingSkins
        .filter(s => s.name.trim() === name.trim())
        .map(s => s.wear);

      const uniqueWears = [...new Set(wearVariants)];

      for (const wear of uniqueWears) {
        const baseSkin = existingSkins.find(s => s.name.trim() === name.trim() && s.wear === wear);
        if (!baseSkin) {
          console.log(`❌ Skin ignoré : ${name} (${wear}) — aucune correspondance trouvée dans l'inventaire existant`);
          continue;
        }


        const commonFields = {
          name,
          wear,
          rarity: baseSkin.rarity || rarity,
          collection: baseSkin.collection || '',
          price: baseSkin.price || null,
          volume: baseSkin.volume || null,
          date: baseSkin.date || null,
          imageUrl,
        };

        // Regular — toujours présent
        updatedSkins.push({
          ...commonFields,
          isStatTrak: false,
          isSouvenir: false,
        });

        // StatTrak — si disponible
        if (isST === "StatTrak Available") {
          updatedSkins.push({
            ...commonFields,
            isStatTrak: true,
            isSouvenir: false,
          });
        }

        // Souvenir — si disponible
        if (isSV === "Souvenir Available") {
          updatedSkins.push({
            ...commonFields,
            isStatTrak: false,
            isSouvenir: true,
          });
        }
      }
    }

    await clearAllInventory();
    await bulkAddAllSkins(updatedSkins);
    await loadSkins();

    alert(`✅ Mise à jour terminée : ${updatedSkins.length} skins mis à jour avec variantes ST/SV correctes`);
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

  const handleExport = () => {
    if (!allSkins || allSkins.length === 0) {
      alert("❌ Aucun skin à exporter.");
      return;
    }

    const dataStr = JSON.stringify(allSkins, null, 2); // JSON lisible avec indentation
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "allSkins_export.json"; // nom du fichier
    a.click();
    URL.revokeObjectURL(url);
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
        (typeFilter === 'stattrak' && allSkin.isStatTrak === true) ||
        (typeFilter === 'regular' && !allSkin.isStatTrak && !allSkin.isSouvenir) ||
        (typeFilter === 'souvenir' && allSkin.isSouvenir === true);

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
        <button onClick={handleExport}>💾 Exporter JSON</button>
        <button onClick={updateSkinsFromScrapedData}>🧬 Update IMG + ST/SV</button>
        <button onClick={generateMissingRegularVariants}>➕ Ajouter variantes regular manquantes</button>
      </div>
      {/* 📊 Statistiques */}
      <p style={{
        fontStyle: 'italic',
        marginBottom: '1rem',
        backgroundColor: '#2d385faa',
        padding: '0.5rem 1rem',
        borderRadius: '6px'
      }}>
        🧮 Total: <strong>{allSkins.length}</strong> | Regular: <strong>{allSkins.filter(s => !s.isStatTrak && !s.isSouvenir).length}</strong> | ST: <strong>{allSkins.filter(s => s.isStatTrak).length}</strong> | SV: <strong>{allSkins.filter(s => s.isSouvenir).length}</strong>
      </p>

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
          <option value="Consumer">Consumer Grade</option>
          <option value="Industrial">Industrial Grade</option>
          <option value="Mil-spec">Mil-Spec</option>
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
            const normalizedRarity = normalizeRarity(allSkin.rarity);
            return (
              <Card key={i} rarity={normalizedRarity}>
                <ImageWrapper>
                  <SkinImage src={allSkin.imageUrl} alt={allSkin.name} isStatTrak={allSkin.isStatTrak} isSouvenir={allSkin.isSouvenir}/>
                </ImageWrapper>
                <SkinDetails>
                  <SkinTitle rarity={normalizedRarity} isStatTrak={allSkin.isST}>
                    {allSkin.isStatTrak && <span style={{ fontSize: '1rem', color: '#FFA500', marginRight: '0.5rem' }}>StatTrak™</span>}
                    {allSkin.isSouvenir && <span style={{ fontSize: '1rem', color: '#d6e412ff', marginRight: '0.5rem' }}>Souvenir</span>}
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
