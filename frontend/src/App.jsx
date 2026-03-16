import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Menu from './components/Menu';
import Admin from './components/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;