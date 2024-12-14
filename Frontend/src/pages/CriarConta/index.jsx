import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './criarConta.css'
import Select from 'react-select';

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
        <div className="criar-conta-container">
            <h1>Criar Nova Conta</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Descrição:</label>
                    <input
                        type="text"
                        className="form-control no-inner-shadow"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Insira a descrição da conta"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>URL da Foto:</label>
                    <input
                        type="text"
                        className="form-control no-inner-shadow"
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        placeholder="Insira a URL da foto"
                        required
                    />
                </div>
                <div className="form-group">
  <label>Selecionar Usuários:</label>
  <Select
    isMulti
    options={todosUsuarios.map(usuario => ({
      value: usuario.id,
      label: `${usuario.nome} (${usuario.email})`
    }))}
    value={selectedUsuarios.map(id => ({
        value: id,
        label: todosUsuarios.find(u => u.id === id)?.nome // encontra o nome pelo id
      }))}
    onChange={(selected) => setSelectedUsuarios(selected.map(item => item.value))}
  />
</div>
                {error && <div className="erro-mensagem">{error}</div>}
                <button type="submit" className="botao-enviar-cadastro">Criar Conta</button>
            </form>
        </div>
    );
};

export default CriarConta;