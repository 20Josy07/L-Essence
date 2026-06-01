import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

export default function Checkout() {
  const { items, total, dispatch } = useCart();
  const { promos, addOrder } = useAdmin();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  const discount = promoApplied
    ? promoApplied.type === 'percent' ? total * promoApplied.discount / 100 : Math.min(promoApplied.discount, total)
    : 0;
  const subtotalAfterDiscount = total - discount;
  const shipping = subtotalAfterDiscount >= 100 ? 0 : 9.99;
  const grandTotal = subtotalAfterDiscount + shipping;

  function applyPromo() {
    const code = promoCode.toUpperCase().trim();
    const promo = promos.find(p => p.code === code && p.active);
    if (promo) {
      setPromoApplied(promo);
      setPromoError('');
    } else {
      setPromoError('Código no válido o expirado');
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Campo requerido';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.address.trim()) e.address = 'Campo requerido';
    if (!form.city.trim()) e.city = 'Campo requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addOrder({
        customer: form.name,
        email: form.email,
        phone: form.phone,
        address: `${form.address}, ${form.city}`,
        notes: form.notes,
        paymentMethod,
        items: items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
        subtotal: total,
        discount: discount,
        shipping: shipping,
        total: grandTotal,
        promoCode: promoApplied?.code || null,
        date: new Date().toISOString().split('T')[0],
      });
      dispatch({ type: 'CLEAR' });
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-20 bg-[#FAF8F5] flex items-center justify-center px-6">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1714] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            ¡Pedido confirmado!
          </h1>
          <p className="text-[#6B6560] mb-1">Gracias por tu compra, {form.name}.</p>
          <p className="text-sm text-[#6B6560] mb-8">
            Recibirás un email en <span className="text-[#B8955A] font-medium">{form.email}</span> con todos los detalles.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 gold-gradient text-white px-8 py-4 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity btn-press shadow-md"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 bg-[#FAF8F5] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6B6560]">Tu carrito está vacío</p>
        <Link to="/catalogo" className="text-sm font-medium text-[#B8955A] hover:text-[#8B6B3D] transition-colors">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const fieldClass = (field) =>
    `w-full bg-white border ${errors[field] ? 'border-red-300' : 'border-[#1A1714]/10'} rounded-xl px-4 py-3 text-sm text-[#1A1714] placeholder-[#6B6560]/50 focus:outline-none focus:border-[#B8955A]/50 focus:ring-2 focus:ring-[#B8955A]/10 transition-all shadow-sm`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-10">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-xs text-[#6B6560] hover:text-[#1A1714] transition-colors font-medium mb-7 sm:mb-10 group">
          <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1 duration-200" /> Seguir comprando
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-5 sm:gap-8 order-2 lg:order-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1714] animate-fade-up" style={{ fontFamily: 'Georgia, serif' }}>
              Finalizar compra
            </h1>

            {/* Personal info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1714]/6 animate-fade-up delay-100">
              <h2 className="text-sm font-semibold text-[#1A1714] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full gold-gradient text-white text-[10px] flex items-center justify-center font-bold">1</span>
                Información personal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Nombre completo *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={fieldClass('name')} placeholder="Tu nombre completo" />
                  {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={fieldClass('email')} placeholder="tu@email.com" />
                  {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Teléfono</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={fieldClass('phone')} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1714]/6 animate-fade-up delay-200">
              <h2 className="text-sm font-semibold text-[#1A1714] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full gold-gradient text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Dirección de envío
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Dirección *</label>
                  <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={fieldClass('address')} placeholder="Calle, número, piso..." />
                  {errors.address && <p className="text-red-400 text-[11px] mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Ciudad *</label>
                  <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={fieldClass('city')} placeholder="Tu ciudad" />
                  {errors.city && <p className="text-red-400 text-[11px] mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-[10px] tracking-wide text-[#6B6560] uppercase font-semibold block mb-1.5">Notas (opcional)</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={fieldClass(null) + ' resize-none'} placeholder="Instrucciones especiales de entrega..." />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#1A1714]/6 animate-fade-up delay-300">
              <h2 className="text-sm font-semibold text-[#1A1714] mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full gold-gradient text-white text-[10px] flex items-center justify-center font-bold">3</span>
                Método de pago
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'card', label: 'Tarjeta', sub: 'Crédito o débito' },
                  { id: 'transfer', label: 'Transferencia', sub: 'Bancaria' },
                  { id: 'cash', label: 'Efectivo', sub: 'Al recibir' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === opt.id
                        ? 'border-[#B8955A] bg-[#B8955A]/5'
                        : 'border-[#1A1714]/8 hover:border-[#B8955A]/30'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#1A1714]">{opt.label}</p>
                    <p className="text-[11px] text-[#6B6560] mt-0.5">{opt.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="gold-gradient text-white py-4 rounded-2xl text-sm font-bold tracking-wide hover:opacity-90 transition-opacity btn-press shadow-xl animate-fade-up delay-400"
            >
              {submitting
                ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : `Confirmar pedido · $${grandTotal.toFixed(2)}`
              }
            </button>
          </form>

          {/* Summary — appears first on mobile */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#1A1714]/6 p-5 sm:p-6 lg:sticky lg:top-24 animate-fade-up delay-200">
              <h2 className="text-sm font-semibold text-[#1A1714] mb-5">Resumen del pedido</h2>

              <div className="flex flex-col gap-4 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1A1714] text-white text-[9px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1A1714]">{item.name}</p>
                      <p className="text-[11px] text-[#6B6560]">{item.size}</p>
                    </div>
                    <p className="text-sm font-bold text-[#1A1714]">${(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              {/* Promo input */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6560]" />
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                      className="w-full bg-[#F5F0E8] rounded-xl pl-8 pr-3 py-2.5 text-xs text-[#1A1714] placeholder-[#6B6560]/60 focus:outline-none focus:ring-2 focus:ring-[#B8955A]/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-3 py-2.5 bg-[#1A1714] text-white rounded-xl text-xs font-semibold hover:bg-[#B8955A] transition-colors btn-press"
                  >
                    Aplicar
                  </button>
                </div>
                {promoError && <p className="text-red-400 text-[11px] mt-1.5">{promoError}</p>}
                {promoApplied && (
                  <p className="text-green-600 text-[11px] mt-1.5 flex items-center gap-1">
                    <CheckCircle size={11} /> Código <strong>{promoApplied.code}</strong> aplicado
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-[#1A1714]/6 pt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-[#6B6560]">
                  <span>Subtotal</span><span>${total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span><span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6B6560]">
                  <span>Envío</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && <p className="text-[11px] text-[#6B6560]/60">Envío gratuito en pedidos +$100</p>}
                <div className="flex justify-between text-base font-bold mt-1 pt-3 border-t border-[#1A1714]/6">
                  <span className="text-[#1A1714]">Total</span>
                  <span className="text-[#B8955A]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
