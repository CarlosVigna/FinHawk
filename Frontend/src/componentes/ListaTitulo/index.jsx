import React, { useState, useEffect } from 'react';
import './listaTitulo.css';

const ListaTitulo = ({ onEdit, refresh, tipoTransacao }) => {
    const [titulos, setTitulos] = useState([]);
    const [error, setError] = useState(null);

    const fetchTitulos = async () => {
        try {
            const token = localStorage.getItem('token');
            const idConta = localStorage.getItem('id');

            if (!token || !idConta) {
                setError('Token ou ID da conta não encontrados.');
                return;
            }

            let url = `http://localhost:8080/titulos?contaId=${idConta}`;
            if (tipoTransacao !== 'todos') {
                url += `&tipo=${tipoTransacao}`;
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
            setTitulos(data);
        } catch (error) {
            setError(error.message);
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchTitulos();
    }, [refresh, tipoTransacao]);

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este título?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/titulos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchTitulos(); 
            } else {
                throw new Error('Erro ao excluir título');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="lista-titulos-container">
            {error && <div className="error-message">{error}</div>}
            <table className="tabela-titulos">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Emissão</th>
                        <th>Vencimento</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {titulos.map((titulo) => (
                        <tr key={titulo.id}>
                            <td>{titulo.descricao}</td>
                            <td>{titulo.tipo}</td>
                            <td>R$ {titulo.valor.toFixed(2).replace('.', ',')}</td>
                            <td>{new Date(titulo.emissao).toLocaleDateString('pt-BR')}</td>
                            <td>{new Date(titulo.vencimento).toLocaleDateString('pt-BR')}</td>
                            <td>{titulo.categoria?.nome}</td>
                            <td>{titulo.status}</td>
                            <td className="acoes">
                                <button onClick={() => onEdit(titulo)} className="botao-editar">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(titulo.id)} className="botao-excluir">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaTitulo;
