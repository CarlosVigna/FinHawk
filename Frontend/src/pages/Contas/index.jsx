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
            const token = localStorage.getItem('token');
            console.log('Token:', token);

            if (!token) {
                setErro("Usuário não autenticado.");
                setContas([]);
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/contas/usuario', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Resposta do servidor para contas:', response);

                if (!response.ok) {
                    throw new Error("Erro ao carregar contas.");
                }

                const data = await response.json();
                console.log('Contas carregadas:', data);
                setContas(data);
            } catch (error) {
                console.error('Erro ao buscar contas:', error);
                setErro(error.message || "Erro ao conectar com o servidor.");
                setContas([]);
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
        const userConfirmed = window.confirm("Tem certeza que deseja excluir esta conta?");
        if (!userConfirmed) return;
    
        try {
            const response = await fetch(`http://localhost:8080/contas/${idConta}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error("Erro ao excluir conta.");
            }
    
            setContas(contas.filter(conta => conta.id !== idConta));
            setSucesso("Conta excluída com sucesso!");
        } catch (error) {
            setErro(error.message || "Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className='contas-container'>
            <h1 className='titulo-contas'>Minhas Contas</h1>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
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
