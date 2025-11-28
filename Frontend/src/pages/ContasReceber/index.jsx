import React, { useEffect, useState } from 'react';
import './contasReceber.css';

const ContasReceber = () => {
    const [dados, setDados] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(true);

    const fetchDados = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados. Faça login novamente.');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/titulos?contaId=${idConta}&tipo=Recebimento&status=PENDENTE`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar dados');
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
    };

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados. Faça login novamente.');
                return;
            }

            const params = new URLSearchParams({
                tipo: 'Recebimento',
                contaId: idConta
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/categorias/tipo?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao carregar categorias.');
            }

            const data = await response.json();
            setCategorias(data);
            console.log('Categorias recebidas:', data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchDados();
        fetchCategorias();
    }, []);

    useEffect(() => {
        console.log('Categorias no estado:', categorias);
    }, [categorias]);

    const handleFilterStartDateChange = (event) => {
        setFilterStartDate(event.target.value);
    };

    const handleFilterEndDateChange = (event) => {
        setFilterEndDate(event.target.value);
    };

    const handleFilterCategoriaChange = (event) => {
        setFilterCategoria(event.target.value);
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const filteredData = dados.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        const categoriaMatch = !filterCategoria || item.categoria.nome === filterCategoria;
        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);

        return dateMatch && categoriaMatch;
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

            if (aValue < bValue) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const totalValor = sortedData.reduce((total, item) => total + Number(item.valor), 0);

    return (
        <div className='container-relatorio-receber'>
            <div className='titulo-contas-receber'>
                <h1>Relatório de Contas à Receber</h1>
            </div>

            <div className='container-filtro-receber'>
                <label htmlFor="startDate" className='rel-white-label'>Data Inicial:</label>
                <input
                    type="date"
                    className="form-control no-inner-shadow"
                    id="startDate"
                    value={filterStartDate}
                    onChange={handleFilterStartDateChange}
                />
                <label htmlFor="endDate" className="rel-white-label">Data Final:</label>
                <input
                    type="date"
                    className="form-control no-inner-shadow"
                    id="endDate"
                    value={filterEndDate}
                    onChange={handleFilterEndDateChange}
                />
                <label htmlFor="categoria" className="rel-white-label">Categoria:</label>
                <select
                    className="form-control no-inner-shadow"
                    id="categoria"
                    value={filterCategoria}
                    onChange={handleFilterCategoriaChange}
                >
                    <option value="">Todas</option>
                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.nome}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div>Carregando...</div>
            ) : (
                <div className="caixa-relatorio-receber">
                    <div className="cabecalho-relatorio-receber">
                        <p>
                            <strong>Período: </strong>
                            {filterStartDate && filterEndDate
                                ? `${new Date(filterStartDate).toLocaleDateString('pt-BR')} a ${new Date(filterEndDate).toLocaleDateString('pt-BR')}`
                                : ' Nenhum período selecionado'}
                        </p>
                        <p>
                            <strong>Data de Geração:</strong> {new Date().toLocaleString('pt-BR')}
                        </p>
                    </div>

                    <table className="tabela-relatorio-receber">
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
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.descricao}</td>
                                    <td>{new Date(item.emissao).toLocaleDateString('pt-BR')}</td>
                                    <td>{new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                                    <td>{item.categoria.nome}</td>
                                    <td>{Number(item.valor).toFixed(2).replace('.', ',')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="container-totalizador-receber">
                        <span>Total à Receber: R$ {totalValor.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContasReceber;
