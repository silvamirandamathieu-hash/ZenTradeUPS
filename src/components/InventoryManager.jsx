import React from 'react';
import styled from 'styled-components';

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
  background: rgba(255, 255, 255, 0.9);
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


const PriceBlock = styled.div`
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  span {
    display: block;
    margin-bottom: 0.2rem;
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
  bottom: 4px;
  right: 0px;
  color: black;
  font-size: 2rem;
  font-weight: bold;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  line-height: 1;

  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  -webkit-text-stroke: 0.4px white;
  text-stroke: 0.4px white;

  padding: 4px 10px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const SkinImage = styled.img`
  width: 250px;
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
  gap: 0.2rem;

  p {
    margin: 0;
    line-height: 1.4;
    font-size: 0.95rem;
  }
`;


const SkinTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ rarity, theme }) =>
    theme.rarityColors[rarity] || theme.colors.accent};
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

const ProtectionIcon = styled.img`
  width: 20px;
  vertical-align: middle;
  margin-right: 5px;
`;

const ProtectionBadge = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
`;

function InventoryManager({ inventory, priceMap = {} }) {
  return (
    <List>
      {inventory.map(skin => {
        const marketPrice = priceMap[`${skin.name} (${skin.wear})`];
        const isStatTrak = skin.isStatTrak;

        return (
          <Card key={skin.id} rarity={skin.rarity}>
            <ImageWrapper>
              {skin.tradeProtected && skin.protectionIcon && (
                <ProtectionBadge src={skin.protectionIcon} alt="Trade Protected" />
              )}
              <SkinImage
                src={skin.imageUrl}
                alt={skin.name}
                isStatTrak={isStatTrak}
              />
              <QuantityBadge>x{skin.quantity}</QuantityBadge>
            </ImageWrapper>

            <SkinDetails>
              <SkinTitle rarity={skin.rarity} isStatTrak={isStatTrak}>
                {isStatTrak && <span title="StatTrak™">★ </span>}
                {skin.name}
              </SkinTitle>

              <p><Label>Usure :</Label> <Value>{skin.wear}</Value></p>
              <p><Label>Float :</Label> <Value>{skin.float?.toFixed(8)}</Value></p>
              <p><Label>Rareté :</Label> <Value>{skin.rarity}</Value></p>

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
                <div>💰 : {skin.price.toFixed(2)} €</div>
                <div>💵 : {marketPrice !== undefined ? marketPrice.toFixed(2) + ' €' : '—'}</div>
              </PriceColumn>

              {skin.tradeProtected && skin.protectionIcon && (
                <p>
                  <ProtectionIcon src={skin.protectionIcon} alt="Trade Protected" />
                  <Value>Échange protégé</Value>
                </p>
              )}
            </SkinDetails>
          </Card>
        );
      })}
    </List>
  );
}


export default InventoryManager;
