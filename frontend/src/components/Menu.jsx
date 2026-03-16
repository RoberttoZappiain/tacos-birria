import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Apuntamos al backend local de forma relativa
    axios.get('/api/menu')
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
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