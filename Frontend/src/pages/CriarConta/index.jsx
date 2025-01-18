import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './criarConta.css'
import Select from 'react-select';

const CriarConta = () => {
    const [descricao, setDescricao] = useState('');
    const [fotoUrl, setFotoUrl] = useState('');
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
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

        const dadosConta = {
            descricao,
            fotoUrl,
            usuarios: selectedUsuarios
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/contas`, {
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

            const data = await response.json();
            if (data.status === 'success') {
                navigate('/contas');
            } else {
                throw new Error(data.message || "Erro ao criar conta");
            }
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            setError(error.message);
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
                        value={fotoUrl}
                        onChange={(e) => setFotoUrl(e.target.value)}
                        placeholder="Insira a URL da foto"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Selecionar Usuários:</label>
                    <Select
                        isMulti
                        name="usuarios"
                        options={todosUsuarios.map(usuario => ({
                            value: usuario.id,
                            label: usuario.nome
                        }))}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) => {
                            const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            setSelectedUsuarios(ids);
                        }}
                        placeholder="Selecione os usuários"
                    />
                </div>
                {error && <div className="erro-mensagem">{error}</div>}
                <div className="botoes-container">
                    <button type="submit" className="botao-salvar">Criar Conta</button>
                    <button 
                        type="button" 
                        className="botao-cancelar"
                        onClick={() => navigate('/contas')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CriarConta;