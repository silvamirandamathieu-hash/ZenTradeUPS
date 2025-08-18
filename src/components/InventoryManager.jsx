
import styled from 'styled-components';
import React, { useState, useMemo } from 'react';



const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 2rem;

  @media (min-width: 1580px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 1579px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.5rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  backdrop-filter: blur(12px);
  border: 2px solid ${({ rarity, theme }) =>
    theme.rarityColors[rarity] || theme.colors.border};
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
  margin: 0;

  &:hover {
    transform: scale(1.01);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;


const PriceColumn = styled.div`
  position: absolute;
  top: 50%;
  right: 5rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-weight: bold;
  font-size: 1.1rem;
  text-align: right;
  gap: 0.3rem;
`;

const QuantityBadge = styled.div`
  position: absolute;
  bottom: 12px;
  right: 2px;
  color: ${({ theme }) => theme.colors.textOnBadge};
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Verdana', sans-serif;
  line-height: 1;
  text-shadow: 3px 1px 5px rgba(130, 148, 210, 0.2);
  -webkit-text-stroke: 0.4px ${({ theme }) => theme.colors.textOnBadge};
  text-stroke: 0.2px ${({ theme }) => theme.colors.textOnBadge};
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const ImageWrapper = styled.div`
  position: relative;
`;

const SkinImage = styled.img`
  width: 200px;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: ${({ isStatTrak, theme }) =>
    isStatTrak ? `3px solid ${theme.colors.stattrak}` : 'none'};

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const SkinDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: left;
  text-align: left;

  p {
    margin: 0.5rem;
    line-height: 1.2;
    font-size: 1.3rem;
  }
`;


const SkinTitle = styled.h3`
  margin: 0.5rem;
  font-size: 1.5rem;
  font-weight: ${({ isStatTrak }) => (isStatTrak ? 'bold' : 600)};
  color: ${({ rarity, isStatTrak, theme }) =>
    isStatTrak
      ? '#FFA500'
      : theme.rarityColors[rarity] || theme.colors.accent};
  text-align: left;
  text-shadow: ${({ isStatTrak }) =>
    isStatTrak ? '0 0 2px rgba(255, 165, 0, 0.5)' : 'none'};
`;

const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const CollectionImage = styled.img`
  width: 28px;
  height: auto;
  margin-left: 8px;
  vertical-align: middle;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
`;

const ProtectionBadge = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem;
  align-items: center;
  justify-content: flex-start;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

function InventoryManager({ inventory, priceMap = {}, onExport, onImport, onReset }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [wearFilter, setWearFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionSearch, setCollectionSearch] = useState('');
  const [raritySearch, setRaritySearch] = useState('all');
  

  const handleResetFilters = () => {
    setTypeFilter('all');
    setWearFilter('all');
    setCollectionFilter('all');
    setSearchQuery('');
    setCollectionSearch('');
    setRaritySearch('all');
  };

  const rarityOrder = [
    "Consumer Grade",
    "Industrial Grade",
    "Mil-Spec Grade",
    "Restricted",
    "Classified",
    "Covert",
    "Contraband", // optionnel
    "Extraordinary" // pour les gants/stickers
  ];


  const collections = useMemo(() => {
    const unique = new Set(inventory.map(s => s.collection).filter(Boolean));
    return Array.from(unique).sort();
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(skin => {
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'stattrak' && skin.statTrakItems?.length > 0) ||
        (typeFilter === 'regular' && skin.regularItems?.length > 0);

      const matchesWear = wearFilter === 'all' || skin.wear === wearFilter;
      const matchesCollection = collectionFilter === 'all' || skin.collection === collectionFilter;
      const matchesSearch = searchQuery.trim() === '' ||
        skin.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesCollectionSearch = collectionSearch.trim() === '' ||
        (skin.collection || '').toLowerCase().includes(collectionSearch.trim().toLowerCase());
      const matchesRaritySearch = raritySearch === 'all' || skin.rarity === raritySearch ;

      return matchesType && matchesWear && matchesCollection && matchesSearch && matchesCollectionSearch && matchesRaritySearch;
    });
  }, [
    inventory,
    typeFilter,
    wearFilter,
    collectionFilter,
    searchQuery,
    collectionSearch,
    raritySearch,
  ]);

  return (
    <div style={{ padding: '2rem' }}>
      {/* 🧰 Boutons d'action */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={onExport}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#48bb78',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📤 Exporter
        </button>

        <button
          onClick={onImport}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#4299e1',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📥 Importer
        </button>

        <button
          onClick={onReset}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#f56565',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🗑️ Réinitialiser l’inventaire
        </button>
      </div>
      {/* 🔍 Barre de filtres */}
      <FilterBar style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <input
          type="text"
          placeholder="Rechercher une collection..."
          value={collectionSearch}
          onChange={e => setCollectionSearch(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            flex: '1',
            minWidth: '200px'
          }}
        />
        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">Tous les types</option>
          <option value="stattrak">StatTrak™</option>
          <option value="regular">Non-StatTrak</option>
          
        </Select>

        <Select value={raritySearch} onChange={e => setRaritySearch(e.target.value)}>
          <option value="all">Toutes les raretés</option>
          {rarityOrder.map((rarity, i) => (
            <option key={i} value={rarity}>{rarity}</option>
          ))}
        </Select>


        <Select value={wearFilter} onChange={e => setWearFilter(e.target.value)}>
          <option value="all">Toutes les usures</option>
          <option value="Factory New">Factory New</option>
          <option value="Minimal Wear">Minimal Wear</option>
          <option value="Field-Tested">Field-Tested</option>
          <option value="Well-Worn">Well-Worn</option>
          <option value="Battle-Scarred">Battle-Scarred</option>
        </Select>

        <Select value={collectionFilter} onChange={e => setCollectionFilter(e.target.value)}>
          <option value="all">Toutes les collections</option>
          {collections.map((col, i) => (
            <option key={i} value={col}>{col}</option>
          ))}
        </Select>

        <button
          onClick={handleResetFilters}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#e2e8f0',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🔄 Réinitialiser les filtres
        </button>
      </FilterBar>

      {/* 📦 Liste des skins */}
      <List>
        {filteredInventory.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#718096' }}>
            Aucun skin ne correspond aux filtres.
          </p>
        ) : (
          filteredInventory.map(skin => {
            const marketPrice = priceMap[`${skin.name} (${skin.wear})`];
            const statTrakQty = skin.statTrakItems?.length || 0;
            const regularQty = skin.regularItems?.length || 0;
            const totalQty = statTrakQty + regularQty;

            const allTradeProtected =
              (statTrakQty === 0 || skin.statTrakItems.every(item => item.tradeProtected)) &&
              (regularQty === 0 || skin.regularItems.every(item => item.tradeProtected));

            const isSelected = selectedItemId === skin.id;

            return (
              <Card
                key={skin.id}
                rarity={skin.rarity}
                onClick={() =>
                  setSelectedItemId(prev => (prev === skin.id ? null : skin.id))
                }
              >
                <ImageWrapper>
                  {allTradeProtected && (() => {
                    const icon =
                      skin.statTrakItems?.find(item => item.protectionIcon)?.protectionIcon ||
                      skin.regularItems?.find(item => item.protectionIcon)?.protectionIcon;

                    return icon ? (
                      <ProtectionBadge src={icon} alt="Trade Protected" />
                    ) : null;
                  })()}

                  <SkinImage
                    src={skin.imageUrl}
                    alt={skin.name}
                    isStatTrak={skin.isStatTrak}
                  />
                  <QuantityBadge>x{totalQty}</QuantityBadge>
                </ImageWrapper>

                <SkinDetails>
                  <SkinTitle
                    rarity={skin.rarity}
                    isStatTrak={skin.isStatTrak}
                    className={skin.isStatTrak ? 'stattrak-title' : ''}
                  >
                    {skin.isStatTrak ? `StatTrak™ ${skin.name}` : skin.name}
                  </SkinTitle>



                  <p><Label>Usure :</Label> <Value>{skin.wear}</Value></p>

                  <p>
                    <Label>Collection :</Label> <Value>{skin.collection}</Value>
                    {skin.collectionIMGUrl && (
                      <CollectionImage
                        src={skin.collectionIMGUrl}
                        alt={`Collection ${skin.collection}`}
                        title={skin.collection}
                      />
                    )}
                  </p>

                  <PriceColumn>
                    <div>
                      💰 : {totalQty > 0
                        ? (
                            [...(skin.statTrakItems || []), ...(skin.regularItems || [])]
                              .reduce((sum, item) => sum + item.price, 0) / totalQty
                          ).toFixed(2)
                        : '—'} €
                    </div>
                    <div>
                      💵 : {marketPrice !== undefined ? marketPrice.toFixed(2) + ' €' : '—'}
                    </div>
                  </PriceColumn>

                  {isSelected && (
                    <>
                      {statTrakQty > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <Label>StatTrak™ :</Label>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {skin.statTrakItems.map((item, i) => (
                              <li key={`st-${i}`} style={{ fontSize: '0.9rem' }}>
                                Float: {item.float.toFixed(8)} – Prix: {item.price.toFixed(2)} €
                                {item.tradeProtected && ' 🔒'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {regularQty > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <Label>Non-StatTrak :</Label>
                          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                            {skin.regularItems.map((item, i) => (
                              <li key={`reg-${i}`} style={{ fontSize: '0.9rem' }}>
                                Float: {item.float.toFixed(8)}
                                {item.tradeProtected && ' 🔒'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </SkinDetails>
              </Card>
            );
          })
        )}
      </List>
    </div>
  );
}

export default InventoryManager