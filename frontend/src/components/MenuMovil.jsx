import React, { useState } from 'react';

const products = [
  { id: 'tacobirria43', name: 'Taco de Birria', price: 43, desc: 'Dorado o blandito con carne', img: '/productos/tacobirria43.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'quesabirriademaiz47', name: 'Quesabirria de Maíz', price: 47, desc: 'Carne, queso y frijol, dorada o blandita', img: '/productos/quesabirriademaiz47.jpeg', span: 'col-span-1 row-span-2' },
  { id: 'quesabirriaharina90', name: 'Quesabirria de Harina', price: 90, desc: 'Harina, queso y frijol, dorada o blandita', img: '/productos/quesabirriaharina90.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'pizzabirria120', name: 'Pizzabirria', price: 120, desc: 'Tortilla de harina dorada con carne, frijol y queso', img: '/productos/pizzabirria120.jpeg', span: 'col-span-2 row-span-1' },
  { id: 'birriamen120', name: 'Birriamen', price: 120, desc: 'Plato/vaso litro con pasta, carne y queso', img: '/productos/birriamen120.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'tortabirria120', name: 'Torta de Birria', price: 120, desc: 'Pan de la casa, costra de queso, carne y frijol', img: '/productos/tortabirria120.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'chichabirria67', name: 'Chichabirria', price: 67, desc: 'Tostada con carne, frijol, queso estilo chicharrón', img: '/productos/chichabirria67.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'tacobaby43', name: 'Taco Baby', price: 43, desc: 'Tortilla blanca con carne', img: '/productos/tacobaby43.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'costillares220', name: 'Costilla de Res', price: 220, desc: 'Pieza de costilla con cilantro y tortillas', img: '/productos/costillares220.jpeg', span: 'col-span-2 row-span-1' },
  { id: 'ordenbirria220', name: 'Orden de Birria', price: 220, desc: 'Plato/vaso litro con carne', img: '/productos/ordenbirria220.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'planchada90', name: 'Planchada', price: 90, desc: 'Tostadas doradas con carne, queso y frijol', img: '/productos/planchadaHD.png', span: 'col-span-1 row-span-2' },
  { id: 'tacolengua67', name: 'Taco de Lengua', price: 67, desc: 'Tortilla dorada o blandita', img: '/productos/tacolengua67.jpg', span: 'col-span-1 row-span-1' },
  { id: 'tacocostilla67', name: 'Taco Costilla', price: 67, desc: 'Tortilla dorada o blandita', img: '/productos/tacobirria43.jpeg', span: 'col-span-1 row-span-1' },
  { id: 'tuetano110', name: 'Tuétano en Hueso', price: 110, desc: 'Con carne, cilantro y tortillas doradas y queso', img: '/productos/tuetano110.jpg', span: 'col-span-1 row-span-1' },
  { id: 'agua45', name: 'Agua Fresca litro', price: 45, desc: '1/2 litro $25', img: '/productos/Agua25mediolitro45litro.png', span: 'col-span-1 row-span-1' },
  { id: 'coca40', name: 'Coca Cola', price: 40, desc: 'Regular & Sin Azucar', img: '/productos/cocacola40.jpg', span: 'col-span-1 row-span-1' },
];

export default function MenuMovil() {
  const [selected, setSelected] = useState(null);

  const foods = products.filter(p => p.id !== 'agua45' && p.id !== 'coca40');
  const drinks = products.filter(p => p.id === 'agua45' || p.id === 'coca40');

  return (
    <main className="h-screen bg-[#1a0f0a] font-sans text-white flex flex-col overflow-hidden">
      
      {/* Header Fijo */}
      <header className="flex flex-col items-center justify-center pt-6 pb-2 shrink-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <img 
          src="/logotacoschinohd.png" 
          alt="Tacos de Birria El Chino" 
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-2xl mb-2"
        />
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase drop-shadow-md leading-none mb-1">
            MENÚ
          </h2>
          <h1 className="text-xl sm:text-2xl font-black text-orange-400 tracking-widest uppercase drop-shadow-md leading-none">
            TACOS DE BIRRIA EL CHINO
          </h1>
        </div>
      </header>

      {/* Grid con Scroll y Snap */}
      <div className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth p-2 pb-8">
        <div className="grid grid-cols-2 gap-2 auto-rows-[20vh] mb-6">
          {foods.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelected(p)}
              className={`${p.span} snap-center relative overflow-hidden rounded-3xl cursor-pointer group transition-transform hover:scale-[0.98] shadow-xl border border-white/10`}
            >
              <img src={p.img} alt={p.name} className="w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 p-4 w-full pointer-events-none">
                <h3 className="font-bold text-base sm:text-lg uppercase leading-tight mb-1 text-white drop-shadow-lg">{p.name}</h3>
                <p className="text-orange-400 font-black text-xl drop-shadow-lg">${p.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Separador de Bebidas */}
        <div className="flex items-center justify-center mb-6 px-4 snap-center">
          <div className="h-px bg-white/20 flex-1"></div>
          <h2 className="px-4 text-2xl font-black text-orange-500 uppercase tracking-widest drop-shadow-md">Bebidas</h2>
          <div className="h-px bg-white/20 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 auto-rows-[20vh]">
          {drinks.map((p) => (
            <div 
              key={p.id}
              onClick={() => setSelected(p)}
              className={`${p.span} snap-center relative overflow-hidden rounded-3xl cursor-pointer group transition-transform hover:scale-[0.98] shadow-xl border border-white/10`}
            >
              <img src={p.img} alt={p.name} className="w-full h-full object-cover brightness-90 transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 p-4 w-full pointer-events-none">
                <h3 className="font-bold text-base sm:text-lg uppercase leading-tight mb-1 text-white drop-shadow-lg">{p.name}</h3>
                <p className="text-orange-400 font-black text-xl drop-shadow-lg">${p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Interactivo */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelected(null)}></div>
          <div className="relative w-full max-w-md bg-[#2d1b15] rounded-t-3xl sm:rounded-3xl p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-10 border-t sm:border border-white/10 shadow-2xl">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10">
              ✕
            </button>
            <div className="relative w-full h-64 sm:h-72 mb-5 rounded-2xl overflow-hidden shadow-inner">
              <img src={selected.img} alt={selected.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b15] to-transparent"></div>
            </div>
            <h2 className="text-3xl font-black uppercase text-orange-100 tracking-tight">{selected.name}</h2>
            <p className="text-3xl font-bold text-orange-500 mb-3 drop-shadow-sm">${selected.price}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{selected.desc}</p>
          </div>
        </div>
      )}
    </main>
  );
}
