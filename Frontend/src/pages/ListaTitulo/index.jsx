import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons';
import './listaTitulo.css';

const ListaTitulo = ({ onEdit, refresh, tipoTransacao }) => {
    const [titulos, setTitulos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filterCategoria, setFilterCategoria] = useState('');
    const [error, setError] = useState(null);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchTitulos = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados.');
                return;
            }

            let url = `http://localhost:8080/titulos?contaId=${idConta}`;

            if (tipoTransacao === 'recebimentos') {
                url += '&tipo=Recebimento';
            } else if (tipoTransacao === 'pagamentos') {
                url += '&tipo=Pagamento';
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar títulos');
            }

            const data = await response.json();
            console.log('Títulos recebidos:', data);
            setTitulos(data);
        } catch (error) {
            setError(error.message);
            console.error('Erro:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/categorias', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Falha ao carregar categorias.');
            }
            const data = await response.json();
            setCategorias(data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    useEffect(() => {
        fetchTitulos();
        fetchCategorias();
    }, [tipoTransacao]);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/titulos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao excluir item');
                }

                setTitulos((prevTitulos) => prevTitulos.filter(item => item.id !== id));
            } catch (error) {
                console.error('Erro ao excluir item:', error);
                setError(error.message);
            }
        }
    };

    const handleEdit = (id) => {
        console.log('Editando título:', id);
        const tituloParaEditar = titulos.find(titulo => titulo.id === id);
        if (tituloParaEditar) {
            console.log('Título encontrado:', tituloParaEditar);
            onEdit(tituloParaEditar);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const filteredData = titulos.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);
        const categoriaMatch = !filterCategoria || item.categoria.nome === filterCategoria;
        const tipoMatch = !tipoTransacao || tipoTransacao === 'todos' ||
            (tipoTransacao === 'recebimentos' && item.tipo === 'Recebimento') ||
            (tipoTransacao === 'pagamentos' && item.tipo === 'Pagamento');

        return dateMatch && categoriaMatch && tipoMatch;
    });

    let sortedData = [...filteredData];
    if (sortBy) {
        sortedData.sort((a, b) => {
            let aValue, bValue;

            if (sortBy === 'id' || sortBy === 'valor') {
                aValue = Number(a[sortBy]);
                bValue = Number(b[sortBy]);
            } else if (sortBy === 'emissao' || sortBy === 'vencimento') {
                aValue = new Date(a[sortBy]);
                bValue = new Date(b[sortBy]);
            } else if (sortBy === 'categoria') {
                aValue = a.categoria.nome.toLowerCase();
                bValue = b.categoria.nome.toLowerCase();
            } else {
                aValue = a[sortBy].toLowerCase();
                bValue = b[sortBy].toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return (
        <div className="table-container">
            <div className="filtros-historico">
                <div className="filtro-periodo">
                    <div className="campo-filtro">
                        <label>De:</label>
                        <input
                            type="date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                        />
                    </div>
                    <div className="campo-filtro">
                        <label>Até:</label>
                        <input
                            type="date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                        />
                    </div>
                    <div className="campo-filtro">
                        <label>Categoria:</label>
                        <select
                            value={filterCategoria}
                            onChange={(e) => setFilterCategoria(e.target.value)}
                            className="filtro-categoria"
                        >
                            <option value="">Todas</option>
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.nome}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button className="botao-filtrar" onClick={fetchTitulos}>
                    <FontAwesomeIcon icon={faRotate} /> Atualizar
                </button>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" onClick={() => handleSort('id')}>
                            Núm. Doc.
                            {sortBy === 'id' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('descricao')}>
                            Descrição
                            {sortBy === 'descricao' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col">Tipo Trans.</th>
                        <th scope="col" onClick={() => handleSort('emissao')}>
                            Data Emissão
                            {sortBy === 'emissao' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('vencimento')}>
                            Venc.
                            {sortBy === 'vencimento' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('categoria')}>
                            Categoria
                            {sortBy === 'categoria' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col" onClick={() => handleSort('valor')}>
                            Valor Título (R$)
                            {sortBy === 'valor' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                        </th>
                        <th scope="col">Parcela</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.descricao}</td>
                            <td>{item.tipo}</td>
                            <td>{new Date(item.emissao).toLocaleDateString('pt-BR')}</td>
                            <td>{new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                            <td>{item.categoria?.nome}</td>
                            <td>{Number(item.valor).toFixed(2).replace('.', ',')}</td>
                            <td>{item.numeroParcela || 1}/{item.quantidadeParcelas || 1}</td>
                            <td>{item.status}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    onClick={() => handleEdit(item.id)}
                                    style={{ cursor: 'pointer', marginRight: '10px', color: '#fff' }}
                                    title="Editar"
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    onClick={() => handleDelete(item.id)}
                                    style={{ cursor: 'pointer', color: '#ff4444' }}
                                    title="Excluir"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaTitulo;