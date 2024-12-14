import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../pages/Login/authContext';
import Botao from '../../componentes/Botao';
import './menuHome.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function MenuHome({ scrollToCadastro }) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = (e) => {
        setIsDropdownOpen(!isDropdownOpen);
        e.preventDefault();
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false); // Close the dropdown after item click
    };

    return (
        <nav className='nav'>
            <ul className='nav-list'>
                <li className={location.pathname === '/home' ? 'active' : ''}>
                    <Link to="/home">Página Inicial</Link>
                </li>
                <li className={location.pathname === '/sobre' ? 'active' : ''}>
                    <Link to="/sobre">Sobre</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li className={location.pathname === '/contas' ? 'active' : ''}>
                            <Link to="/contas">Contas</Link>
                        </li>
                        <li className={location.pathname === '/cadastroTitulo' ? 'active' : ''}>
                            <Link to="/cadastroTitulo">Cadastro de Títulos</Link>
                        </li>
                        <li className={location.pathname === '/cadastrarCategoria' ? 'active' : ''}>
                            <Link to="/cadastrarCategoria">Cadastro Categoria</Link>
                        </li>
                        <li className={`dropdown ${location.pathname.startsWith('/rel') ? 'active' : ''} ${isDropdownOpen ? 'open' : ''}`}>
                            <Link to="#" className="dropdown-toggle" onClick={toggleDropdown}>Relatórios</Link>
                            <ul className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                                <li className={location.pathname === '/relContasReceber' ? 'active' : ''}>
                                    <Link to="/relContasReceber" onClick={handleDropdownItemClick}>Contas a Receber</Link>
                                </li>
                                <li className={location.pathname === '/relContasPagar' ? 'active' : ''}>
                                    <Link to="/relContasPagar" onClick={handleDropdownItemClick}>Contas a Pagar</Link>
                                </li>
                                <li className={location.pathname === '/relRecebimentos' ? 'active' : ''}>
                                    <Link to="/relRecebimentos" onClick={handleDropdownItemClick}>Recebimentos</Link>
                                </li>
                                <li className={location.pathname === '/relPagamentos' ? 'active' : ''}>
                                    <Link to="/relPagamentos" onClick={handleDropdownItemClick}>Pagamentos</Link>
                                </li>
                            </ul>
                        </li>
                    </>
                )}
            </ul>
            <div className='buttons'>
                {!isAuthenticated ? (
                    <Link to='/login'>
                        <Botao texto="Login" />
                    </Link>
                ) : (
                    <Botao texto="Logout" onClick={handleLogout} />
                )}
                <Botao texto="Cadastrar" onClick={() => navigate('/cadastro')} />
            </div>
        </nav>
    );
}

export default MenuHome;