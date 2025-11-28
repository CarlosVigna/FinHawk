import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faRotate } from '@fortawesome/free-solid-svg-icons';
import './listaTitulo.css';

const ListaTitulo = ({ onEdit, refresh, tipoTransacao }) => {
    const [titulos, setTitulos] = useState([]);
    const [error, setError] = useState(null);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchTitulos = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados.');
                return;
            }

            let url = `${import.meta.env.VITE_API_URL}/titulos?contaId=${idConta}`;
            
            
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

    useEffect(() => {
        fetchTitulos();
    }, [tipoTransacao]);

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/titulos/${id}`, {
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

    const filteredData = titulos.filter((item) => {
        const itemVenc = new Date(item.vencimento);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        const dateMatch = (!startDate || itemVenc >= startDate) && (!endDate || itemVenc <= endDate);

        return dateMatch;
    });

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
                </div>
                <button className="botao-filtrar" onClick={fetchTitulos}>
                    <FontAwesomeIcon icon={faRotate} /> Atualizar
                </button>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Núm. Doc.</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Tipo Trans.</th>
                        <th scope="col">Data Emissão</th>
                        <th scope="col">Venc.</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Valor Título (R$)</th>
                        <th scope="col">Parcela</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.descricao}</td>
                            <td>{item.tipo}</td>
                            <td>{new Date(item.emissao).toLocaleDateString('pt-BR')}</td>
                            <td>{new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                            <td>{item.categoria?.nome}</td>
                            <td>{Number(item.valor).toFixed(2).replace('.', ',')}</td>
                            <td>{item.numeroParcela}</td>
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