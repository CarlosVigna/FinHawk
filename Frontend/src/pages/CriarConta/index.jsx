import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './criarConta.css'

const CriarConta = () => {
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/usuarios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar usuários.");
                }

                const usuariosData = await response.json();
                setTodosUsuarios(usuariosData);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsuarios();
    }, []);

    const handleUsuarioSelect = (usuarioId) => {
        setSelectedUsuarios(prevSelectedUsuarios => {

            const isSelected = prevSelectedUsuarios.includes(usuarioId);

            return isSelected 
                ? prevSelectedUsuarios.filter(id => id !== usuarioId) 
                : [...prevSelectedUsuarios, usuarioId];
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const usuarioIdLogado = localStorage.getItem('id'); 
    
        const usuariosParaEnviar = selectedUsuarios.filter(id => id !== usuarioIdLogado);
    
        const dadosConta = {
            descricao,
            foto,
            usuarios: usuariosParaEnviar, 
        };
    
        console.log("Dados a serem enviados:", dadosConta); 
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/contas', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosConta),
            });
    
            if (!response.ok) {
                throw new Error("Erro ao criar conta.");
            }
    
            navigate('/contas');
        } catch (error) {
            console.error("Erro ao criar conta:", error); 
            alert(error.message);
        }
    };
    return (
        <div>
            <h1>Criar Nova Conta</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Descrição:</label>
                    <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>URL da Foto:</label>
                    <input
                        type="text"
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Selecionar Usuários:</label>
                    <div>
                        {todosUsuarios.map(usuario => (
                            <div key={usuario.id}>
                                <input
                                    type="checkbox"
                                    id={`usuario-${usuario.id}`}
                                    value={usuario.id}
                                    checked={selectedUsuarios.includes(usuario.id)}
                                    onChange={() => handleUsuarioSelect(usuario.id)}
                                />
                                <label htmlFor={`usuario-${usuario.id}`}>{usuario.nome}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Criar Conta</button>
            </form>
        </div>
    );
};

export default CriarConta;
