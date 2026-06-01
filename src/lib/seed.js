import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { products } from '../data/products';

const initialPromos = [
  { name: 'Verano Dorado', code: 'VERANO20', discount: 20, type: 'percent', active: true, expiry: '2026-07-31' },
  { name: 'Primera Compra', code: 'BIENVENIDO', discount: 15, type: 'percent', active: true, expiry: '2026-12-31' },
  { name: 'Descuento Fijo', code: 'MENOS30', discount: 30, type: 'fixed', active: false, expiry: '2026-06-15' },
];

export async function seedIfEmpty() {
  try {
    const snap = await getDocs(collection(db, 'products'));
    if (!snap.empty) return;

    const batch = writeBatch(db);

    products.forEach(p => {
      const ref = doc(collection(db, 'products'));
      batch.set(ref, { ...p, createdAt: new Date() });
    });

    initialPromos.forEach(p => {
      const ref = doc(collection(db, 'promotions'));
      batch.set(ref, { ...p, createdAt: new Date() });
    });

    await batch.commit();
    console.log('Firestore seeded with initial data');
  } catch (e) {
    console.warn('Seed skipped (check Firestore rules):', e.message);
  }
}
