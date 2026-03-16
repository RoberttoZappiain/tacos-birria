import { useNavigate } from 'react-router-dom';
import { ChefHat, Flame, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warmBg flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-mexicanRed-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 translate-y-1/3"></div>

      <main className="text-center z-10 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-mexicanRed-700 rounded-full shadow-lg shadow-mexicanRed-500/30">
            <Flame className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          La Verdadera <br />
          <span className="text-mexicanRed-700">Birria de Res</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
          Tacos doraditos, consomé calientito y el sabor auténtico de México directo a tu mesa.
        </p>

        <button 
          onClick={() => navigate('/menu')}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-mexicanRed-700 rounded-full hover:bg-mexicanRed-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mexicanRed-700 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <ChefHat className="w-6 h-6 mr-3" />
          Ver el Menú
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </button>
      </main>
    </div>
  );
}