import React, { useEffect, useState } from 'react';
import './contasPagar.css';


const ContasPagar = () => {
    const [dados, setDados] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [error, setError] = useState(null);
  

    const fetchDados = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados. Faça login novamente.');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/titulos?contaId=${idConta}&tipo=Pagamento&status=PENDENTE`, {
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

    useEffect(() => {
        fetchDados();
    }, []);

    const handleFilterStartDateChange = (event) => {
        setFilterStartDate(event.target.value);
    };

    const handleFilterEndDateChange = (event) => {
        setFilterEndDate(event.target.value);
    };



    const filteredData = dados.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

      
        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);

        return dateMatch;
    });

    const totalValor = filteredData.reduce((total, item) => total + Number(item.valor), 0);



    return (
        <div className='rel-pagar-container'>
            <div className='titulo-contas-pagar'>
                <h1>Contas a Pagar</h1>
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
            </div>
            
            <div className="relatorio-box">
                <div className="cabecalho-container">
                    <strong>Relatório de Contas a Pagar</strong>
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

                <div className="totalizador-container">
                    <span>Total a Pagar: R$ {totalValor.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    );
};

export default ContasPagar;
