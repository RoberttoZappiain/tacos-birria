import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ChevronLeft as LeftArrow, Facebook, Instagram, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [loadedImages, setLoadedImages] = useState({}); // Estado para el spinner
  const navigate = useNavigate();

  // Función para ordenar los items (Bebidas al final)
  const sortItems = (data) => {
    const isDrink = (name) => {
      const lowerName = name.toLowerCase();
      return lowerName.includes('agua') || 
             lowerName.includes('refresco') || 
             lowerName.includes('bebida') ||
             lowerName.includes('coca');
    };

    return data.sort((a, b) => {
      const aIsDrink = isDrink(a.name);
      const bIsDrink = isDrink(b.name);
      
      if (aIsDrink && !bIsDrink) return 1;
      if (!aIsDrink && bIsDrink) return -1;
      return a.name.localeCompare(b.name);
    });
  };

  useEffect(() => {
    axios.get('/api/menu')
      .then(res => {
        const sortedData = sortItems(Array.isArray(res.data) ? res.data : []);
        setItems(sortedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  // Efecto Carrusel Automático
  useEffect(() => {
    if (items.length > 1) {
      const interval = setInterval(() => {
        nextItem();
      }, 5000); // Cambia cada 5 segundos
      return () => clearInterval(interval);
    }
  }, [items.length]);

  const nextItem = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevItem = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  // Variantes para la animación de Framer Motion
  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col font-sans text-gray-800">
      <header className="bg-red-800 text-white shadow-lg p-5 flex items-center justify-center border-b-4 border-yellow-500 relative z-50">
        <button 
          onClick={() => navigate('/')} 
          className="absolute left-6 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors"
        >
          <LeftArrow className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-serif font-black tracking-wide uppercase">Tacos de Birria el Chino</h1>
      </header>

      <main className="flex flex-1 overflow-hidden p-6 gap-6 max-w-[1800px] mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-700"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex-1 flex flex-col justify-center">
            <p className="text-2xl font-medium">El menú se está preparando...</p>
            <p className="mt-2">Aún no hay platillos. Entra a /admin para agregarlos.</p>
          </div>
        ) : (
          <>
            {/* Sidebar Menú con Precios */}
            <aside className="w-[350px] bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col h-full relative overflow-hidden flex-shrink-0">
              <div className="absolute top-0 left-0 right-0 h-2 bg-red-700"></div>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-red-800 uppercase tracking-widest border-b-2 border-red-100 pb-4 inline-block">Menú</h2>
              </div>
              
              <ul className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {items.map((item, index) => (
                  <li 
                    key={item.id} 
                    className={`group cursor-pointer flex items-end transition-all duration-200 ${index === currentIndex ? 'scale-[1.02]' : 'hover:opacity-80'}`}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                  >
                    <div className="flex-1 min-w-0 pr-2 relative">
                      <span className={`text-lg font-medium whitespace-nowrap bg-white pr-2 relative z-10 ${index === currentIndex ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                        {item.name}
                      </span>
                      <div className="absolute left-0 bottom-[6px] w-full border-b-[2px] border-dotted border-gray-300 z-0"></div>
                    </div>
                    <div className={`text-xl bg-white pl-2 relative z-10 ${index === currentIndex ? 'text-red-700 font-bold' : 'font-semibold text-gray-900'}`}>
                      ${item.price}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col items-center">
                <div className="flex gap-4 mb-4 text-red-800">
                  <a href="#" className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"><MapPin className="w-5 h-5" /></a>
                </div>
                
                <span className="text-xs text-center text-gray-500 font-medium tracking-wide mb-6 uppercase">
                  AV. GRAL RAMÓN CORONA, SAN JUAN DE OCOTÁN, 45019.<br/>ZAPOPAN JALISCO
                </span>

                <a href="tel:+523312345678" className="w-full flex items-center justify-center gap-3 bg-red-700 text-white py-4 rounded-xl font-bold shadow-md hover:bg-red-800 hover:shadow-lg transition-all active:scale-[0.98]">
                  <Phone className="w-5 h-5" />
                  ORDENA POR TELÉFONO
                </a>
              </div>
            </aside>

            {/* Carousel Animado (Framer Motion) */}
            <section className="flex-1 bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative group flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  {!loadedImages[currentIndex] && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1a1a1a]">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                    </div>
                  )}
                  <img 
                    src={items[currentIndex].image_url} 
                    alt={items[currentIndex].name} 
                    onLoad={() => handleImageLoad(currentIndex)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[currentIndex] ? 'opacity-80' : 'opacity-0'}`}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Overlay inferior de información */}
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent z-10 flex flex-col justify-end p-10 pb-12">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex + '-text'}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-end"
                  >
                    <h3 className="text-6xl font-black text-white drop-shadow-lg tracking-tight max-w-[70%]">
                      {items[currentIndex].name}
                    </h3>
                    <p className="text-5xl font-black text-yellow-400 drop-shadow-md">
                      ${items[currentIndex].price}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Botones Flotantes */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevItem(); }} 
                className="absolute left-6 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); nextItem(); }} 
                className="absolute right-6 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 hover:scale-110"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </section>

            {/* Panel Mosaico Derecho (Grid sin precios) */}
            <aside className="w-[450px] bg-white p-8 rounded-2xl shadow-xl border border-gray-200 overflow-y-auto flex-shrink-0 custom-scrollbar flex flex-col relative h-full">
              <div className="absolute top-0 left-0 right-0 h-2 bg-red-700"></div>
              <h3 className="text-3xl font-serif font-bold text-red-800 uppercase tracking-widest border-b-2 border-red-100 pb-4 mb-6 text-center inline-block">ESPECIALIDADES</h3>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {items.map((item, index) => (
                  <div 
                    key={`grid-${item.id}`}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`cursor-pointer rounded-2xl overflow-hidden relative group aspect-square border-4 transition-all duration-300 ${index === currentIndex ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105 z-10' : 'border-transparent hover:border-gray-300 hover:shadow-lg'}`}
                  >
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-3 opacity-100">
                      <span className="text-white text-sm font-bold leading-tight text-center w-full drop-shadow-md">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}} />
    </div>
  );
}
