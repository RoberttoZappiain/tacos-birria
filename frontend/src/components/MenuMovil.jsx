import React from 'react';
import logo from '../assets/logo.jpg';

const menuData = {

  tacos: [
    { name: 'Taco de birria', desc: 'Dorado o blandito con carne', price: 43 },
    { name: 'Quesabirria de maiz', desc: 'Carne, queso y frijol, dorada o blandita', price: 47 },
    { name: 'Quesabirria de harina', desc: 'Harina, queso y frijol, dorada o blandita', price: 90 },
    { name: 'Taco baby', desc: 'Tortilla blanca con carne', price: 43 },
    { name: 'Taco de costilla de res', desc: 'Tortilla dorada o blandita', price: 67 },
    { name: 'Taco de lengua', desc: 'Tortilla dorada o blandita', price: 67 },
    { name: 'Chichabirria', desc: 'Tostada con carne, frijol, queso estilo chicharrón', price: 67 },
    { name: 'Pizabirria', desc: 'Tortilla de harina dorada con carne, frijol y queso', price: 120 },
    { name: 'Biriaman', desc: 'Plato/vaso litro con pasta, carne y queso', price: 120 },
  ],
  otros: [
    { name: 'Orden de birria', desc: 'Plato/vaso litro con carne', price: 220 },
    { name: 'Torta de birria', desc: 'Pan de la casa, costra de queso, carne y frijol', price: 120 },
    { name: 'Tuétano en hueso tipo chalupa', desc: 'Con carne, cilantro y tortillas doradas y queso', price: 90 },
    { name: 'PREPARADO', desc: 'vaso de 12 oz con carne, cilantro, cebolla, salsa y limón', price: 55 },
    { name: 'Planchada', desc: 'Tostadas doradas con carne, queso y frijol', price: 120 },
    { name: 'Tostilla de res', desc: 'Pieza de costilla con cilantro, tortillas doradas y blanditas', price: 120 },
  ],
  bebidas: [
    { name: 'Refresco', price: 40 },
    { name: 'Aguas de sabor (litro)', price: 45 },
  ]
};

// Se eliminaron las anotaciones de tipos : { ... }
const MenuItem = ({ name, desc, price }) => (
  <div className="mb-1 sm:mb-3">
    <div className="flex justify-between items-baseline text-xs sm:text-lg">
      <span className="font-bold uppercase">{name}</span>
      <span className="flex-1 border-b border-dotted border-gray-400 mx-1 sm:mx-2"></span>
      <span className="font-bold">${price}</span>
    </div>
    {desc && <p className="text-[10px] sm:text-sm text-gray-600 italic leading-tight">{desc}</p>}
  </div>
);

export default function MenuMovil() {
  return (
    <div className="h-screen flex flex-col bg-[#F5F2EF] p-2 sm:p-4 font-sans text-gray-900 max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center mb-2 sm:mb-8">
        <img src={logo} alt="Logo" className="w-20 h-20 sm:w-40 sm:h-40 rounded-full border-2 sm:border-4 border-white shadow-lg object-cover" />
      </div>

      <h2 className="text-lg sm:text-3xl font-bold text-center mb-2 sm:mb-8 uppercase tracking-widest text-gray-800">TACOS Y ESPECIALIDADES</h2>
      <div className="mb-2 sm:mb-12 overflow-y-auto sm:overflow-visible">
        {menuData.tacos.map((item, i) => (
          <MenuItem key={i} {...item} />
        ))}
      </div>

      <h2 className="text-lg sm:text-3xl font-bold text-center mb-2 sm:mb-8 uppercase tracking-widest text-gray-800 border-t border-gray-300 pt-2 sm:pt-8">OTROS PLATILLOS</h2>
      <div className="grid grid-cols-2 gap-x-4 mb-2 sm:mb-12 relative overflow-y-auto sm:overflow-visible">
        <div className="border-r border-dotted border-gray-400 pr-2">
          {menuData.otros.slice(0, 3).map((item, i) => (
            <MenuItem key={i} {...item} />
          ))}
        </div>
        <div className="pl-2">
          {menuData.otros.slice(3).map((item, i) => (
            <MenuItem key={i} {...item} />
          ))}
        </div>
      </div>

      <h2 className="text-lg sm:text-3xl font-bold text-center mb-2 sm:mb-8 uppercase tracking-widest text-gray-800 border-t border-gray-300 pt-2 sm:pt-8">BEBIDAS</h2>
      <div className="grid grid-cols-2 gap-x-4 relative overflow-y-auto sm:overflow-visible">
        <div className="border-r border-dotted border-gray-400 pr-2">
          {menuData.bebidas.slice(0, 1).map((item, i) => (
            <MenuItem key={i} {...item} />
          ))}
        </div>
        <div className="pl-2">
          {menuData.bebidas.slice(1).map((item, i) => (
            <MenuItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
