import { useEffect, useState } from 'react'
import './listaCategorias.css'

const ListaCategorias = () => {
    const [dados, setDados] = useState([]);
    const [filterTipo, setFilterTipo] = useState('Todos');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
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
                console.log('Dados recebidos da API:', data);

                setDados(data);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setError(error.message);
            }
        };
        fetchDados();

    }, []);

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
            </div>
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
                    )) }
                </tbody>
            </table>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    
);

}

export default ListaCategorias;