import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ContaDetails = () => {
    const { id } = useParams();
    const [conta, setConta] = useState(null);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchConta = async () => {
            const response = await fetch(`http://localhost:8080/contas/${id}/usuarios`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setConta(data);
        };

        fetchConta();
    }, [id]);

    return (
        <div>
            {conta && (
                <>
                    <h1>{conta.nome}</h1>
                    <h2>Usuários associados:</h2>
                    <ul>
                        {usuarios.map(usuario => (
                            <li key={usuario.id}>{usuario.nome}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default ContaDetails;
