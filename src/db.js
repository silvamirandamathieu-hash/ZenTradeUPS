import Dexie from 'dexie';

export const db = new Dexie('cs2TradeUpDB');
db.version(1).stores({
  inventory: '++id,name,wear,collection,collectionIMGUrl,rarity,isStatTrak,imageUrl',
  history: '++id,name,wear,price,date,collection,rarity,imageUrl'
});

// Inventory
export async function getInventory() {
  return db.inventory.toArray();
}

export async function addSkin(skin) {
  return db.inventory.add(skin);
}

export async function clearInventory() {
  return db.inventory.clear();
}

export async function migrateInventory() {
  const all = await db.inventory.toArray();

  const migrated = all.map(skin => {
    const item = {
      float: skin.float ?? 0,
      price: skin.price ?? 0,
      tradeProtected: skin.tradeProtected ?? false,
      protectionIcon: skin.protectionIcon ?? ''
    };

    return {
      ...skin,
      statTrakItems: skin.isStatTrak ? [item] : [],
      regularItems: !skin.isStatTrak ? [item] : []
    };
  });

  await db.inventory.clear();
  await db.inventory.bulkAdd(migrated);
}

// History
export async function addHistory(entry) {
  return db.history.add(entry);
}

export async function getHistory() {
  return db.history.orderBy('date').reverse().toArray();
}

export async function clearHistory() {
  return db.history.clear();
}
