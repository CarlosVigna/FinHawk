import { Link } from 'react-router-dom';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../pages/Login/authContext';
import Botao from '../../componentes/Botao';
import './menuHome.css';
import { useNavigate } from 'react-router-dom';

function MenuHome({ scrollToCadastro }) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className='nav'>
            <div className='nav-left'>
                <Nav variant="tabs">
                    <Nav.Link as={Link} to="/home">Página Inicial</Nav.Link>
                    <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
                    {isAuthenticated && (
                        <>


                            <Nav.Link as={Link} to="/contas">Contas</Nav.Link>
                            <Nav.Link as={Link} to="/cadastroTitulo">Cadastro de Títulos</Nav.Link>
                            <Nav.Link as={Link} to="/cadastrarCategoria">Cadastro Categoria</Nav.Link>
                            <NavDropdown title="Relatórios" id="filter-dropdown" className="nav-dropdown">
                                <NavDropdown.Item as={Link} to="/relContasReceber">Contas a Receber</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/relContasPagar">Contas a Pagar</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/relRecebimentos">Recebimentos</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/relPagamentos">Pagamentos</NavDropdown.Item>
                                
                            </NavDropdown>
                        </>
                    )}
                </Nav>
            </div>
            <div className='botao-container'>
                {!isAuthenticated ? (
                    <Link to='/login'>
                        <Botao texto="Login" className="botao-login" />
                    </Link>
                ) : (
                    <Botao texto="Logout" className="botao-cadastrar" onClick={handleLogout} />
                )}
                <Botao texto="Cadastrar" className="botao-cadastrar" onClick={() => navigate('/cadastro')} />
            </div>
        </nav>
    );
}

export default MenuHome;
