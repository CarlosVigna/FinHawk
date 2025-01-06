import React, { useEffect, useState } from 'react';
import './contasPagar.css';


const ContasPagar = () => {
    const [dados, setDados] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [filterCategoria, setFilterCategoria] = useState('');


    const fetchDados = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados. Faça login novamente.');
                return;
            }

            // Alteração na URL - agora busca títulos PENDENTES
            const response = await fetch(`http://localhost:8080/titulos/pag-aberto?contaId=${idConta}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
        }
    };

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const tipo = 'Pagamento';

            const response = await fetch(`http://localhost:8080/categorias?tipo=${tipo}`, {
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


    const filteredData = dados.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;
        const categoriaMatch = !filterCategoria || item.categoria.nome === filterCategoria;

        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);

        return dateMatch && categoriaMatch;
    });

    const totalValor = filteredData.reduce((total, item) => total + Number(item.valor), 0);



    return (
        <div className='rel-pagar-container'>
            <div className='titulo-contas-pagar'>
                <h1>Relatório de Contas a Pagar</h1>
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
                <div className="cabecalho-container">
                    <p>
                        <strong>Período: </strong>
                        {filterStartDate && filterEndDate
                            ? `${new Date(filterStartDate).toLocaleDateString('pt-BR')} a ${new Date(filterEndDate).toLocaleDateString('pt-BR')}`
                            : ' Nenhum período selecionado'}
                    </p>
                    <p><strong>Data de Geração:</strong> {new Date().toLocaleString('pt-BR')}</p>
                </div>

                <table className="rel-table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Núm. Doc.</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Data Emissão</th>
                            <th scope="col">Venc.</th>
                            <th scope="col">Categoria</th>
                            <th scope="col">Valor Título (R$)</th>
                            <th scope="col">Parcela</th>
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
                                <td>{item.numeroParcela || 1}/{item.quantidadeParcelas || 1}</td> { }
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="totalizador-container">
                    <span>Total a Pagar: R$ {totalValor.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    );
};

export default ContasPagar;
