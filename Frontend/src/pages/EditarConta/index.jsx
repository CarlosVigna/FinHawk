import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditarConta = () => {
    const [conta, setConta] = useState({});
    const [erro, setErro] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        const fetchConta = async () => {
            try {
                const response = await fetch(`http://localhost:8080/contas/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error("Erro ao carregar conta.");
                }

                const data = await response.json();
                setConta(data);
                setUsuarios(data.usuarios); 
            } catch (error) {
                setErro(error.message || "Erro ao conectar com o servidor.");
            }
        };

        fetchConta();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/contas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...conta, usuarios }),
            });

            if (!response.ok) {
                throw new Error("Erro ao editar conta.");
            }

            navigate('/contas'); 
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUsuarioChange = (index, value) => {
        const newUsuarios = [...usuarios];
        newUsuarios[index] = value;
        setUsuarios(newUsuarios);
    };

    const handleAddUsuario = () => {
        setUsuarios([...usuarios, '']); 
    };

    return (
        <div>
            <h1>Editar Conta</h1>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Descrição:</label>
                    <input 
                        type="text" 
                        value={conta.descricao || ''} 
                        onChange={(e) => setConta({ ...conta, descricao: e.target.value })} 
                        required 
                    />
                </div>
                <div>
                    <label>URL da Foto:</label>
                    <input 
                        type="text" 
                        value={conta.foto || ''} 
                        onChange={(e) => setConta({ ...conta, foto: e.target.value })} 
                        required 
                    />
                </div>
                <div>
                    <label>Usuários:</label>
                    {usuarios.map((usuario, index) => (
                        <input 
                            key={index} 
                            type="text" 
                            value={usuario} 
                            onChange={(e) => handleUsuarioChange(index, e.target.value)} 
                            placeholder={`Usuário ${index + 1}`} 
                            required 
                        />
                    ))}
                    <button type="button" onClick={handleAddUsuario}>Adicionar Usuário</button>
                </div>
                <button type="submit">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditarConta;
