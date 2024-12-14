import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../pages/Login/authContext';
import Botao from '../../componentes/Botao';
import './menuHome.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

    const isActive = (path) => {
        if (path === '/home') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const closeDropdown = (e) => {
        if (!e.target.closest('.dropdown')) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <nav className='nav'>
            <ul className='nav-list'>
                <li className={isActive('/home') ? 'active' : ''}>
                    <Link to="/home">Página Inicial</Link>
                </li>
                <li className={isActive('/sobre') ? 'active' : ''}>
                    <Link to="/sobre">Sobre</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li className={isActive('/contas') ? 'active' : ''}>
                            <Link to="/contas">Contas</Link>
                        </li>
                        <li className={isActive('/cadastroTitulo') ? 'active' : ''}>
                            <Link to="/cadastroTitulo">Cadastro de Títulos</Link>
                        </li>
                        <li className={isActive('/cadastrarCategoria') ? 'active' : ''}>
                            <Link to="/cadastrarCategoria">Cadastro Categoria</Link>
                        </li>
                        <li className={`dropdown ${isActive('/rel') ? 'active' : ''} ${isDropdownOpen ? 'open' : ''}`}>
                            <Link to="#" 
                                className="dropdown-toggle" 
                                onClick={toggleDropdown}
                                aria-expanded={isDropdownOpen}
                                role="button"
                            >
                                Relatórios
                            </Link>
                            <ul className="dropdown-content" role="menu">
                                <li className={isActive('/relContasReceber') ? 'active' : ''}>
                                    <Link to="/relContasReceber" onClick={handleDropdownItemClick}>Contas a Receber</Link>
                                </li>
                                <li className={isActive('/relContasPagar') ? 'active' : ''}>
                                    <Link to="/relContasPagar" onClick={handleDropdownItemClick}>Contas a Pagar</Link>
                                </li>
                                <li className={isActive('/relRecebimentos') ? 'active' : ''}>
                                    <Link to="/relRecebimentos" onClick={handleDropdownItemClick}>Recebimentos</Link>
                                </li>
                                <li className={isActive('/relPagamentos') ? 'active' : ''}>
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