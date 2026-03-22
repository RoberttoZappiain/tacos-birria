import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    axios.get('/api/menu')
      .then(res => {
        setItems(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (items.length > ITEMS_PER_PAGE) {
      const interval = setInterval(() => {
        setStartIndex(prev => (prev + ITEMS_PER_PAGE) % items.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [items]);

  // Generamos los items para mostrar garantizando que siempre sea un array
  const finalItems = (() => {
    if (!items || items.length === 0) return [];
    
    // Si tenemos pocos items, simplemente los mostramos todos
    if (items.length <= ITEMS_PER_PAGE) return items;
    
    const displayedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    // Si necesitamos rellenar para completar la "rotación" visual
    if (displayedItems.length < ITEMS_PER_PAGE) {
        return [...displayedItems, ...items.slice(0, ITEMS_PER_PAGE - displayedItems.length)];
    }
    return displayedItems;
  })();

  return (
    <div className="min-h-screen bg-warmBg pb-12">
      <header className="bg-mexicanRed-700 text-white shadow-md rounded-b-[2rem] p-6 mb-8 relative">
        <button 
          onClick={() => navigate('/')} 
          className="absolute left-4 top-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-black text-center mt-2">Nuestro Menú</h1>
        <p className="text-center text-mexicanRed-100 mt-2 font-medium">Para chuparse los dedos</p>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mexicanRed-700"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Aún no hay platillos en el menú. Entra a /admin para agregarlos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {finalItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                <div className="h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-contain p-2"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = 'https://placehold.co/600x400/b91c1c/white?text=HD.png';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <span className="text-xl font-black text-mexicanRed-700 bg-mexicanRed-50 px-3 py-1 rounded-lg">
                      ${item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}