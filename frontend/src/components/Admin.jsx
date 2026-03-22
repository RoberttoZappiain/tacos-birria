import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, QrCode, Plus, LogIn, Trash2, Edit2, LayoutDashboard, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Modal/Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  
  // QR State
  const [qrCode, setQrCode] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const navigate = useNavigate();

  // Config axios with token
  const api = axios.create({
    baseURL: '/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      const res = await api.get('/menu');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      if(error.response?.status === 401 || error.response?.status === 403) handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { username, password });
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
    } catch (error) {
      alert('Credenciales inválidas');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        // Edit Mode (Only name and price for simplicity)
        await api.put(`/menu/${currentId}`, { name, price });
        setMessage('¡Platillo actualizado!');
      } else {
        // Create Mode
        if (!image) {
          setMessage('La imagen HD.png es obligatoria');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('image', image);
        await api.post('/menu', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        setMessage('¡Platillo agregado!');
      }
      fetchItems();
      setTimeout(() => { setShowModal(false); resetForm(); }, 1000);
    } catch (error) {
      setMessage('Error al guardar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este platillo?')) {
      try {
        await api.delete(`/menu/${id}`);
        fetchItems();
      } catch (error) {
        alert('Error al borrar el producto');
      }
    }
  };

  const openEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setName(item.name);
    setPrice(item.price);
    setImage(null);
    setMessage('');
    setShowModal(true);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setPrice('');
    setImage(null);
    setMessage('');
  };

  const generatePrintQR = async () => {
    try {
      const res = await api.get('/qr');
      setQrCode(res.data.qr);
      setQrUrl(res.data.url);
      setShowQrModal(true);
    } catch (error) {
      alert('Error generando QR. Verifica estar logueado.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-warmBg flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-mexicanRed-700 rounded-full"><LogIn className="text-white w-8 h-8" /></div>
          </div>
          <h2 className="text-2xl font-black text-center mb-6">Acceso Administrador</h2>
          <input 
            type="text" placeholder="Usuario" 
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-mexicanRed-700" 
            value={username} onChange={e => setUsername(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Contraseña" 
            className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-mexicanRed-700" 
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-mexicanRed-700 text-white font-bold py-3 rounded-xl hover:bg-mexicanRed-900 transition-colors">
            Entrar al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmBg p-4 md:p-8 relative">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center">
          <LayoutDashboard className="mr-3 text-mexicanRed-700 w-8 h-8" /> 
          <div>
            <h1 className="text-2xl font-black text-gray-900">Panel de Gestión</h1>
            <p className="text-gray-500 text-sm">Control de Platillos y Códigos QR</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button onClick={generatePrintQR} className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800">
            <QrCode className="w-5 h-5 mr-2" /> Menú QR
          </button>
          <button onClick={handleLogout} className="text-gray-500 font-bold hover:text-red-500 px-4 py-2">
            Salir
          </button>
        </div>
      </header>

      {/* Listado de Productos */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-40 bg-gray-50 flex items-center justify-center p-2">
                <img src={item.image_url} alt={item.name} className="h-full object-contain drop-shadow-md" />
              </div>
              <div className="p-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-mexicanRed-700 font-black">${item.price}</p>
                <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Botón Flotante Redondo para Agregar */}
      <button 
        onClick={openCreate}
        className="fixed bottom-8 right-8 bg-mexicanRed-700 text-white p-5 rounded-full shadow-[0_10px_25px_-5px_rgba(185,28,28,0.5)] hover:bg-mexicanRed-900 hover:scale-110 transition-all z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modal de Formulario (Crear/Editar) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Platillo' : 'Nuevo Platillo'}</h2>
            {message && <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-sm font-bold mb-4">{message}</div>}
            
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border rounded-xl outline-none" />
              <input type="number" step="0.01" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-3 border rounded-xl outline-none" />
              
              {!isEditing && (
                <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50">
                  <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={e => setImage(e.target.files[0])} />
                  <label htmlFor="img-upload" className="flex flex-col items-center text-gray-500 cursor-pointer">
                    <Upload className="mb-2" />
                    <span>{image ? image.name : 'Subir imagen HD.png'}</span>
                  </label>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 p-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Cancelar</button>
                <button type="submit" disabled={loading} className="w-1/2 p-3 bg-mexicanRed-700 text-white rounded-xl font-bold hover:bg-mexicanRed-900">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Imprimible */}
      {showQrModal && qrCode && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
          <div id="print-area" className="bg-white rounded-[2rem] p-8 md:p-12 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-3xl font-black text-mexicanRed-700 uppercase tracking-widest mb-2">Taquería</h2>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-mexicanRed-100 pb-4">La Birria</h3>
            <p className="text-gray-500 font-medium mb-6">Escanea para ver nuestro menú completo</p>
            
            <img src={qrCode} alt="Menu QR" className="w-full max-w-[250px] mx-auto mb-6 border-4 border-gray-100 rounded-2xl" />
            
            <p className="text-mexicanRed-700 font-bold bg-mexicanRed-50 py-2 rounded-xl text-sm break-words px-2">{qrUrl}</p>
          </div>

          <div className="flex gap-4 mt-8 print:hidden">
            <button onClick={() => setShowQrModal(false)} className="px-6 py-3 bg-gray-800 text-white rounded-full font-bold">Cerrar</button>
            <button onClick={() => window.print()} className="flex items-center px-6 py-3 bg-mexicanRed-700 text-white rounded-full font-bold shadow-lg">
              <Printer className="mr-2" /> Imprimir QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}