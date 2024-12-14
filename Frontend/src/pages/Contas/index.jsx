import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../componentes/Card';
import './contas.css';

const Contas = () => {
    const [contas, setContas] = useState([]);
    const [erro, setErro] = useState("");
    const navigate = useNavigate();
    const [sucesso, setSucesso] = useState("");


    useEffect(() => {
        const fetchContas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/contas', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar contas.');
                }

                const data = await response.json();
                setContas(data);
            } catch (error) {
                setErro('Erro ao carregar contas: ' + error.message);
                console.error('Erro ao buscar contas:', error);
            }
        };

        fetchContas();
    }, []);

    const handleEntrar = (idConta) => {
        console.log('Entrando na conta com ID:', idConta);
        localStorage.setItem('id', idConta);
        navigate('/cadastroTitulo');
    };

    const handleEditar = (idConta) => {
        console.log('Editando a conta com ID:', idConta);
        navigate(`/editar-conta/${idConta}`);
    };

    const handleCriarConta = () => {
        console.log('Criando uma nova conta');
        navigate('/criar-conta');
    };

    const handleExcluir = async (idConta) => {
        const userConfirmed = window.confirm("ATENÇÃO: Excluir esta conta também removerá todos os títulos associados a ela. Deseja continuar?");
        if (!userConfirmed) return;

        setErro("");
        setSucesso("");

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/contas/${idConta}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            let jsonData;
            try {
                const text = await response.text();
                jsonData = text ? JSON.parse(text) : {};
            } catch (parseError) {
                throw new Error('Erro ao processar resposta do servidor');
            }

            if (!response.ok) {
                throw new Error(jsonData.message || 'Erro ao excluir conta e seus títulos');
            }

            setContas(prevContas => prevContas.filter(conta => conta.id !== idConta));
            setSucesso('Conta e seus títulos foram excluídos com sucesso');
        } catch (error) {
            setErro(error.message);
        } finally {
            setTimeout(() => {
                setErro("");
                setSucesso("");
            }, 3000);
        }
    };

    return (
        <div className='contas-container'>
            <h1 className='titulo-contas'>Minhas Contas</h1>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
            <div className="cards-container">
                {contas.length > 0 ? (
                    contas.map(conta => (
                        <Card
                            key={conta.id}
                            conta={conta}
                            onEntrar={handleEntrar}
                            onEditar={handleEditar}
                            onExcluir={handleExcluir}
                        />
                    ))
                ) : (
                    <div>
                        <p>Nenhuma conta encontrada.</p>
                        <button onClick={handleCriarConta}>Criar Nova Conta</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contas;