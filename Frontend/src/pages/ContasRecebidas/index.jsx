import React, { useEffect, useState } from 'react';
import './contasRecebidas.css';


const ContasRecebidas = () => {
    const [dados, setDados] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchDados = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados. Faça login novamente.');
                return;
            }

            const url = `http://localhost:8080/titulos?contaId=${idConta}&tipo=Recebimento&status=RECEBIDO`;
            console.log("URL da requisição:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("Resposta do servidor:", response);

            if (!response.ok) {
                throw new Error('Erro ao buscar dados');
            }

            const data = await response.json();
            setDados(data);
            setError(null);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError(error.message);
        }
    };

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Token não encontrado. Faça login novamente.');
                return;
            }

            const url = `http://localhost:8080/categorias`;
            console.log("URL da requisição:", url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log("Resposta do servidor:", response);

            if (!response.ok) {
                throw new Error('Erro ao buscar categorias');
            }

            const data = await response.json();
            setCategorias(data);
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
        const order = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(order);
    };

    const sortedData = [...dados].sort((a, b) => {
        if (sortBy) {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (aValue < bValue) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOrder === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const filteredData = sortedData.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;
        const categoriaMatch = !filterCategoria || item.categoria.nome === filterCategoria;

        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);

        return dateMatch && categoriaMatch;
    });

    const totalValor = filteredData.reduce((total, item) => total + Number(item.valor), 0);

    return (
        <div className='rel-recebidas-container'>
            <div className='titulo-contas-recebidas'>
                <h1>Relatório de Contas Recebidas</h1>
            </div>

            <div className='filter-rel-container'>
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

            <div className="relatorio-box">
                <div className="cabecalho-container-green">
                    <p>
                        <strong>Período: </strong>
                        {filterStartDate && filterEndDate
                            ? `${new Date(filterStartDate).toLocaleDateString('pt-BR')} a ${new Date(filterEndDate).toLocaleDateString('pt-BR')}`
                            : ' Nenhum período selecionado'}
                    </p>
                    <p><strong>Data de Geração:</strong> {new Date().toLocaleString('pt-BR')}</p>
                </div>


                <table className="rel-table-hover-recebidas">
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
                        {filteredData.map((item) => (
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

                <div className="totalizador-container-recebidas">
                    <span>Total Recebido: R$ {totalValor.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    );
};

export default ContasRecebidas;
