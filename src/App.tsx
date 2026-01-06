import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Diagnostico from './pages/Diagnostico';
import Checklist from './pages/Checklist';
import Indicadores from './pages/Indicadores';
import AterroZero from './pages/AterroZero';
import Consultor from './pages/Consultor';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/diagnostico" element={<Diagnostico />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/indicadores" element={<Indicadores />} />
              <Route path="/aterro-zero" element={<AterroZero />} />
              <Route path="/consultor" element={<Consultor />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
