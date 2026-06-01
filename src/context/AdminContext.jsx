import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { seedIfEmpty } from '../lib/seed';

const AdminContext = createContext(null);

// Código secreto requerido para registrar una cuenta de administrador.
// Cámbialo por uno propio y solo compártelo con quien deba tener acceso.
const ADMIN_CODE = 'ESSENCE-2026';

function authError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Ese email ya está registrado';
    case 'auth/invalid-email':        return 'Email inválido';
    case 'auth/weak-password':        return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':       return 'Email o contraseña incorrectos';
    default:                          return 'Ocurrió un error, inténtalo de nuevo';
  }
}

export function AdminProvider({ children }) {
  const [user, setUser] = useState(undefined);   // undefined = cargando
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);

  // Auth + verificación de rol admin (campo isAdmin en users/{uid})
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          const admin = snap.exists() && snap.data().isAdmin === true;
          setIsAdmin(admin);
          if (admin) seedIfEmpty();
        } catch {
          setIsAdmin(false);
        }
        setUser(u);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // Listeners de Firestore en tiempo real
  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'products'), snap =>
        setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      , err => console.warn('products:', err.message)),

      onSnapshot(
        query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
        snap => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        , err => console.warn('orders:', err.message)),

      onSnapshot(collection(db, 'promotions'), snap =>
        setPromos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      , err => console.warn('promotions:', err.message)),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // ── Auth ──
  async function login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      if (!snap.exists() || snap.data().isAdmin !== true) {
        await signOut(auth);
        return { ok: false, error: 'Esta cuenta no tiene permisos de administrador' };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authError(e.code) };
    }
  }

  async function register(email, password, code) {
    if (code !== ADMIN_CODE) {
      return { ok: false, error: 'Código de administrador incorrecto' };
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        isAdmin: true,
        createdAt: serverTimestamp(),
      });
      setIsAdmin(true);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: authError(e.code) };
    }
  }

  async function logout() {
    await signOut(auth);
  }

  // ── Products ──
  const addProduct    = data       => addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
  const updateProduct = (id, data) => updateDoc(doc(db, 'products', id), data);
  const deleteProduct = id         => deleteDoc(doc(db, 'products', id));

  // ── Orders ──
  const addOrder = orderData => addDoc(collection(db, 'orders'), {
    ...orderData, status: 'Pendiente', createdAt: serverTimestamp(),
  });
  const updateOrderStatus = (id, status) => updateDoc(doc(db, 'orders', id), { status });

  // ── Promotions ──
  const addPromo    = data => addDoc(collection(db, 'promotions'), { ...data, createdAt: serverTimestamp() });
  const deletePromo = id   => deleteDoc(doc(db, 'promotions', id));
  function togglePromo(id) {
    const promo = promos.find(p => p.id === id);
    if (promo) return updateDoc(doc(db, 'promotions', id), { active: !promo.active });
  }

  return (
    <AdminContext.Provider value={{
      user, isAdmin, authLoading,
      login, register, logout,
      inventory, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus,
      promos, addPromo, togglePromo, deletePromo,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
