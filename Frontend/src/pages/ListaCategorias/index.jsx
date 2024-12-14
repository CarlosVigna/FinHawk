import { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import './listaCategorias.css';

const ListaCategorias = ({ refresh }) => {
    const [dados, setDados] = useState([]);
    const [filterTipo, setFilterTipo] = useState('Todos');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDados = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }
            const response = await fetch('http://localhost:8080/categorias', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok){
                throw new Error('Erro ao buscar dados');
            }
            const data = await response.json();
            setDados(data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log('Atualizando lista de categorias...');
        fetchDados();
    }, [refresh, fetchDados]);

    const handleFilterTipoChange = (event) => {
        setFilterTipo(event.target.value);
    };

    const filteredData = dados.filter(item => 
        filterTipo === 'Todos' || item.tipo === filterTipo
    );

    return (
        <div className='categoria-container'>
            <div className='titulo-categorias'>
                <h1>Histórico de Categorias</h1>
            </div>
            <div className='filter-container'>
                <label htmlFor='filter'>Filtrar por:</label>
                <select id="filter" value={filterTipo} onChange={handleFilterTipoChange}>
                    <option value="Todos">Todos</option>
                    <option value="Recebimento">Recebimento</option>
                    <option value="Pagamento">Pagamento</option>
                </select>
                <div className='botao-atualizar'>
                    <FontAwesomeIcon
                        icon={faRotate}
                        onClick={fetchDados}
                        style={{ cursor: 'pointer', color: 'white', fontSize: '24px' }}
                    />
                </div>
            </div>
            {loading && <div className="loading">Carregando...</div>}
            <table className='table-categorias'>
                <thead>
                    <tr>
                        <th scope="col">Código:</th>
                        <th scope="col">Desc. Categoria:</th>
                        <th scope="col">Tipo Categoria:</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nome}</td>
                            <td>{item.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <p className="erro-mensagem">{error}</p>}
        </div>
    );
};

export default ListaCategorias;