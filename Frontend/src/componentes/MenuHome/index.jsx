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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDropdown = (e) => {
        setIsDropdownOpen(!isDropdownOpen);
        e.preventDefault();
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false);
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isDropdownOpen) setIsDropdownOpen(false);
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const closeMenu = (e) => {
            if (!e.target.closest('nav') && isMenuOpen) {
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', closeMenu);
        return () => document.removeEventListener('click', closeMenu);
    }, [isMenuOpen]);

    useEffect(() => {
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <nav className='nav'>
            <div className="nav-header">
                {/* Logo ou título pode ir aqui */}
                <button
                    className="menu-toggle"
                    onClick={toggleMenu}
                    aria-label="Menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            <div
                className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
                <li style={{ "--i": 1 }} className={isActive('/home') ? 'active' : ''}>
                    <Link to="/home" onClick={handleLinkClick}>
                        <i className="fas fa-home"></i>
                        <span>Página Inicial</span>
                    </Link>
                </li>
                <li style={{ "--i": 2 }} className={isActive('/sobre') ? 'active' : ''}>
                    <Link to="/sobre" onClick={handleLinkClick}>Sobre</Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li style={{ "--i": 3 }} className={isActive('/contas') ? 'active' : ''}>
                            <Link to="/contas" onClick={handleLinkClick}>Contas</Link>
                        </li>
                        <li style={{ "--i": 4 }} className={isActive('/cadastroTitulo') ? 'active' : ''}>
                            <Link to="/cadastroTitulo" onClick={handleLinkClick}>Cadastro de Títulos</Link>
                        </li>
                        <li style={{ "--i": 5 }} className={isActive('/cadastrarCategoria') ? 'active' : ''}>
                            <Link to="/cadastrarCategoria" onClick={handleLinkClick}>Cadastro Categoria</Link>
                        </li>
                        <li style={{ "--i": 6 }} className={`dropdown ${isActive('/rel') ? 'active' : ''} ${isDropdownOpen ? 'open' : ''}`}>
                            <Link to="#"
                                className="dropdown-toggle"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                                aria-expanded={isDropdownOpen}
                                role="button"
                            >
                                Relatórios
                            </Link>
                            <ul className="dropdown-content" role="menu">
                                <li style={{ "--i": 7 }} className={isActive('/relContasReceber') ? 'active' : ''}>
                                    <Link to="/relContasReceber" onClick={handleDropdownItemClick}>Contas a Receber</Link>
                                </li>
                                <li style={{ "--i": 8 }} className={isActive('/relContasPagar') ? 'active' : ''}>
                                    <Link to="/relContasPagar" onClick={handleDropdownItemClick}>Contas a Pagar</Link>
                                </li>
                                <li style={{ "--i": 9 }} className={isActive('/relRecebimentos') ? 'active' : ''}>
                                    <Link to="/relRecebimentos" onClick={handleDropdownItemClick}>Recebimentos</Link>
                                </li>
                                <li style={{ "--i": 10 }} className={isActive('/relPagamentos') ? 'active' : ''}>
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