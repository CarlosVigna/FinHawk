import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './pages/Login/authContext';
import PrivateRoute from './pages/Login/privateRoute'; 
import MenuHome from './componentes/MenuHome';
import Banner from './componentes/Banner';
import Footer from './componentes/Footer';
import CadastroUsuario from './pages/CadastroUsuario';
import Login from './pages/Login';
import Contas from './pages/Contas';
import CadastroTitulo from './pages/CadastroTitulo';
import BodyHome from './componentes/BodyHome';
import ListaTitulo from './pages/ListaTitulo';
import CadastroCategoria from './pages/CadastroCategoria';
import CriarConta from './pages/CriarConta';
import EditarConta from './pages/EditarConta';
import ContaDetails from './pages/ContaDetails';
import ContasReceber from './pages/ContasReceber';
import ContasPagar from './pages/ContasPagar';
import Sobre from './pages/Sobre';
import ContasRecebidas from './pages/ContasRecebidas';
import ContasPagas from './pages/ContasPagas';

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isAuthenticated) {}
  }, [isAuthenticated]);

  return (
    <div id="root">
      <MenuHome />
      <Banner />

      <main>
        <Routes>
          <Route path="/" element={<BodyHome />} />
          <Route path="/home" element={<BodyHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/sobre" element={<Sobre />} />


          
          <Route path="/contas" element={<PrivateRoute><Contas /></PrivateRoute>} />
          <Route path="/cadastroTitulo" element={<PrivateRoute><CadastroTitulo /></PrivateRoute>} />
          <Route path="/listaTitulo" element={<PrivateRoute><ListaTitulo /></PrivateRoute>} />
          <Route path="/cadastrarCategoria" element={<PrivateRoute><CadastroCategoria /></PrivateRoute>} />
          <Route path="/criar-conta" element={<PrivateRoute><CriarConta /></PrivateRoute>} />
          <Route path="/editar-conta/:id" element={<PrivateRoute><EditarConta /></PrivateRoute>} />
          <Route path="/conta/:id" element={<PrivateRoute><ContaDetails /></PrivateRoute>} />
          <Route path="/relContasReceber" element={<PrivateRoute><ContasReceber /></PrivateRoute>} />
          <Route path="/relContasPagar" element={<PrivateRoute><ContasPagar /></PrivateRoute>} />
          <Route path="/relRecebimentos" element={<PrivateRoute><ContasRecebidas /></PrivateRoute>} />
          <Route path="/relPagamentos" element={<PrivateRoute><ContasPagas /></PrivateRoute>} />

          


        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
