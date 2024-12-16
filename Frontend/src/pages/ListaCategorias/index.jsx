import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons';
import './listaCategorias.css';

const ListaCategorias = ({ refresh }) => {
    const [dados, setDados] = useState([]);
    const [tipoFiltro, setTipoFiltro] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            if (!response.ok) {
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

    const filteredData = dados.filter((categoria) => {
        if (tipoFiltro === 'todos') return true;
        return categoria.tipo.toLowerCase() === tipoFiltro.toLowerCase();
    });

    return (
        <>
            <div className="botoes-tipo-container">
                <button
                    className={`botao-tipo ${tipoFiltro === 'recebimento' ? 'ativo' : ''}`}
                    onClick={() => setTipoFiltro(prev => prev === 'recebimento' ? 'todos' : 'recebimento')}
                >
                    Recebimentos
                </button>
                <button
                    className={`botao-tipo ${tipoFiltro === 'pagamento' ? 'ativo' : ''}`}
                    onClick={() => setTipoFiltro(prev => prev === 'pagamento' ? 'todos' : 'pagamento')}
                >
                    Pagamentos
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome da Categoria</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((categoria) => (
                            <tr key={categoria.id}>
                                <td>{categoria.id}</td>
                                <td>{categoria.nome}</td>
                                <td>{categoria.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="loading">Carregando...</div>}
                {error && <p className="erro-mensagem">{error}</p>}
            </div>
        </>
    );
};

export default ListaCategorias;