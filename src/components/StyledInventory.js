import styled from 'styled-components';

export const List = styled.div`
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

export const Card = styled.div`
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


export const PriceColumn = styled.div`
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

export const QuantityBadge = styled.div`
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


export const ImageWrapper = styled.div`
  position: relative;
`;

export const SkinImage = styled.img`
  width: 200px;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: ${({ isStatTrak, theme }) =>
    isStatTrak ? `3px solid ${theme.colors.stattrak}` : 'none'};
  box-shadow: ${({ isStatTrak }) =>
    isStatTrak ? '0 0 12px 4px rgba(255,165,0,0.6)' : '0 4px 12px rgba(0,0,0,0.1)'};

  @media (max-width: 600px) {
    width: 100%;
  }
`;


export const SkinDetails = styled.div`
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


export const SkinTitle = styled.h3`
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

export const Label = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const Value = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

export const CollectionImage = styled.img`
  width: 28px;
  height: auto;
  margin-left: 8px;
  vertical-align: middle;
  border-radius: 4px;
  box-shadow: 0 0 4px rgba(0,0,0,0.2);
`;

export const ProtectionBadge = styled.img`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem;
  align-items: center;
  justify-content: flex-start;
`;

export const Select = styled.select`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;
