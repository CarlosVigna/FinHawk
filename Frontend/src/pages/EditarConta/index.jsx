import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './editarConta.css';

const EditarConta = () => {
    const [conta, setConta] = useState({
        descricao: '',
        foto: '',
        usuarios: [],
        fotoUrl: '' // Adicionado para manter compatibilidade com o DTO
    });
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchConta = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/contas/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(response.status === 404 
                        ? "Conta não encontrada." 
                        : `Erro ao carregar conta: ${response.status}`);
                }

                const data = await response.json();
                setConta({
                    descricao: data.descricao || '',
                    foto: data.foto || '',
                    fotoUrl: data.fotoUrl || '',
                    usuarios: Array.isArray(data.usuarios) ? data.usuarios : []
                });
            } catch (error) {
                setErro(error.message);
                console.error('Erro ao carregar conta:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConta();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/contas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    descricao: conta.descricao,
                    fotoUrl: conta.foto || conta.fotoUrl
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Erro ao editar conta: ${response.status}`);
            }

            navigate('/contas');
        } catch (error) {
            setErro(error.message);
            console.error('Erro ao editar conta:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConta({ ...conta, [name]: value });
    };

    const handleUsuarioChange = (index, value) => {
        const newUsuarios = [...conta.usuarios];
        newUsuarios[index] = value;
        setConta({ ...conta, usuarios: newUsuarios });
    };

    const handleAddUsuario = () => {
        setConta({ ...conta, usuarios: [...conta.usuarios, ''] });
    };

    const handleRemoveUsuario = (index) => {
        const newUsuarios = conta.usuarios.filter((_, i) => i !== index);
        setConta({ ...conta, usuarios: newUsuarios });
    };

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div className="editar-conta-container">
            <h1>Editar Conta</h1>

            {erro && <div className="error-message">{erro}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="descricao">Descrição:</label>
                    <input
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={conta.descricao}
                        onChange={handleInputChange}
                        placeholder="Insira a nova descrição da conta"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="foto">URL da Foto:</label>
                    <input
                        type="text"
                        id="foto"
                        name="foto"
                        value={conta.foto || conta.fotoUrl}
                        onChange={handleInputChange}
                        placeholder="Insira a nova URL da foto"
                    />
                </div>
                {Array.isArray(conta.usuarios) && (
                    <div className="form-group">
                        <label>Usuários:</label>
                        <div className="usuarios-lista">
                            {conta.usuarios.map((usuario, index) => (
                                <div key={index} className="user-input">
                                    <input
                                        type="text"
                                        value={usuario}
                                        onChange={(e) => handleUsuarioChange(index, e.target.value)}
                                        placeholder={`Usuário ${index + 1}`}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveUsuario(index)} 
                                        className="remove-button"
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                            <button 
                                type="button" 
                                onClick={handleAddUsuario} 
                                className="add-button"
                            >
                                Adicionar Usuário
                            </button>
                        </div>
                    </div>
                )}
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditarConta;