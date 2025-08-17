import Dexie from 'dexie';

export const db = new Dexie('cs2TradeUpDB');
db.version(1).stores({
  inventory: '++id,name,wear,float,price,collection,collectionImageUrl,quantity,rarity,tradeProtected,isStatTrak,imageUrl,protectionIcon',
  history: '++id,name,wear,price,date,collection,rarity,imageUrl'
});

//Fonction pour Inventory
export async function getInventory() {
  return db.inventory.toArray();
}

export async function addSkin(skin) {
  return db.inventory.add(skin);
}

export async function clearInventory() {
  return db.inventory.clear();
}

// Fonction pour History
export async function addHistory(entry) {
  return db.history.add(entry);
}

export async function getHistory() {
  return db.history.orderBy('date').reverse().toArray();
}

export async function clearHistory() {
  return db.history.clear();
}
