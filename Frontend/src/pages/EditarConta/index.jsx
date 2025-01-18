import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import './editarConta.css';

const EditarConta = () => {
    const [conta, setConta] = useState({
        descricao: '',
        foto: '',
        usuarios: [],
        fotoUrl: '' 
    });
    const [erro, setErro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [todosUsuarios, setTodosUsuarios] = useState([]);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const contaResponse = await fetch(`${import.meta.env.VITE_API_URL}/contas/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                
                const usuariosResponse = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!contaResponse.ok || !usuariosResponse.ok) {
                    throw new Error("Erro ao carregar dados");
                }

                const contaData = await contaResponse.json();
                const usuariosData = await usuariosResponse.json();

                setConta(contaData.data);
                setTodosUsuarios(usuariosData);
                
                
                if (contaData.data.usuarios) {
                    setSelectedUsuarios(contaData.data.usuarios.map(u => u.id));
                }
            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/contas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    descricao: conta.descricao,
                    fotoUrl: conta.fotoUrl,
                    usuarios: selectedUsuarios
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar conta");
            }

            navigate('/contas');
        } catch (error) {
            setErro(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConta({ ...conta, [name]: value });
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
                <div className="form-group">
                    <label>Usuários:</label>
                    <Select
                        isMulti
                        value={todosUsuarios
                            .filter(u => selectedUsuarios.includes(u.id))
                            .map(u => ({ value: u.id, label: u.nome }))}
                        options={todosUsuarios.map(u => ({
                            value: u.id,
                            label: u.nome
                        }))}
                        onChange={(selected) => {
                            setSelectedUsuarios(selected ? selected.map(s => s.value) : []);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="botoes-container">
                    <button type="submit" className="botao-salvar">Salvar Alterações</button>
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

export default EditarConta;