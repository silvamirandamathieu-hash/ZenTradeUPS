import Dexie from 'dexie';

export const db = new Dexie('cs2TradeUpDB');

// Définition des tables
db.version(1).stores({
  inventory: '++id,name,wear,collection,collectionIMGUrl,rarity,isStatTrak,imageUrl',
  history: '++id,name,wear,price,date,collection,rarity,imageUrl'
});

//
// 📦 INVENTAIRE
//

export async function getInventory() {
  return db.inventory.toArray();
}

export async function addSkin(skin) {
  if (!skin || typeof skin !== 'object') throw new Error('Skin invalide');
  return db.inventory.add(skin);
}

export async function clearInventory() {
  return db.inventory.clear();
}

export async function migrateInventory() {
  const all = await getInventory();

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

  await clearInventory();
  await db.inventory.bulkAdd(migrated);
}

//
// 📜 HISTORIQUE
//

export async function addHistory(entry) {
  if (!entry || typeof entry !== 'object') throw new Error('Entrée invalide');
  return db.history.add(entry);
}

export async function getHistory() {
  return db.history.orderBy('date').reverse().toArray();
}

export async function clearHistory() {
  return db.history.clear();
}
