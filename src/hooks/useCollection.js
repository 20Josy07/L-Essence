import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export function useCollection(col, order = null) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = order
      ? query(collection(db, col), orderBy(order, 'desc'))
      : collection(db, col);

    const unsub = onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.warn(`useCollection(${col}):`, err.message);
      setLoading(false);
    });

    return unsub;
  }, [col]);

  return { docs, loading };
}
