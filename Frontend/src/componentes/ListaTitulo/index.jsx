import React, { useState, useEffect } from 'react';
import './listaTitulo.css';

const ListaTitulo = ({ onEdit, refresh, tipoTransacao, filtroData }) => {
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

            let url = `${import.meta.env.VITE_API_URL}/titulos?contaId=${idConta}`;
            
            if (tipoTransacao && tipoTransacao !== 'todos') {
                url += `&tipo=${encodeURIComponent(tipoTransacao)}`;
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

            let data = await response.json();

            if (filtroData.dataInicio || filtroData.dataFim) {
                data = data.filter(titulo => {
                    const dataVencimento = new Date(titulo.vencimento);
                    const dataInicio = filtroData.dataInicio ? new Date(filtroData.dataInicio) : null;
                    const dataFim = filtroData.dataFim ? new Date(filtroData.dataFim) : null;

                    if (dataInicio && dataFim) {
                        return dataVencimento >= dataInicio && dataVencimento <= dataFim;
                    } else if (dataInicio) {
                        return dataVencimento >= dataInicio;
                    } else if (dataFim) {
                        return dataVencimento <= dataFim;
                    }
                    return true;
                });
            }

            setTitulos(data);
            setError(null);
        } catch (error) {
            setError(error.message);
            console.error('Erro:', error);
        }
    };

    useEffect(() => {
        fetchTitulos();
    }, [refresh, tipoTransacao, filtroData.dataInicio, filtroData.dataFim]);

};

export default ListaTitulo;
