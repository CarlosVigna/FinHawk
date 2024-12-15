import React, { useState } from 'react';
import FormularioCategoria from '../../componentes/FormularioCategoria';
import ListaCategorias from '../ListaCategorias';
import './cadastroCategoria.css';

const URL = "http://localhost:8080";

async function cadastrarCategoria(categoria) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(URL + "/categorias", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoria),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na API:", errorData);
            throw new Error('Erro ao cadastrar categoria: ' + errorData.message);
        }

        const data = await response.json();
        console.log("Resposta da API:", data);
        return data;

    } catch (error) {
        console.error("Erro ao fazer a requisição:", error.message);
        throw error;
    }
}

const CadastroCategoria = () => {
    const [valores, setValores] = useState({
        nome: '',
        tipo: 'Recebimento',
    });

    const [erro, setErro] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [sucesso, setSucesso] = useState(""); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValores({
            ...valores,
            [name]: value
        });
    };

    const handleCadastro = async (e) => {
        e.preventDefault();

        const { nome, tipo } = valores;

        if (!nome) {
            setErro("O nome da categoria é obrigatório.");
            return;
        }

        const novaCategoria = { nome, tipo };

        try {
            await cadastrarCategoria(novaCategoria);


            setValores({
                nome: '',
                tipo: 'Recebimento'
            });
            setErro("");
            setSucesso("Categoria cadastrada com sucesso!");
            setRefresh(prev => !prev);
            setTimeout(() => {
                setSucesso("");
            }, 3000);

        } catch (error) {
            setErro(error.message || "Erro ao cadastrar Categoria. Tente novamente.");
            setSucesso("");
        }
    };

    const camposCadastro = [
        { label: "Nome:", placeholder: "Digite o nome da categoria", type: "text", name: "nome" },
        {
            label: "Tipo:",
            type: "select",
            name: "tipo",
            options: [
                { value: "Recebimento", label: "Recebimentos" },
                { value: "Pagamento", label: "Pagamentos" }
            ]
        }
    ];

    return (
        <div className="cadastro-categoria-vertical">
            <div className="secao-superior">
                <FormularioCategoria
                    valores={valores}
                    handleInputChange={handleInputChange}
                    onSubmit={handleCadastro}
                    erro={erro}
                    sucesso={sucesso}
                />
            </div>
            <div className="historico-container">
                <h2 className="historico-titulo">Categorias Cadastradas</h2>
                <ListaCategorias refresh={refresh} />
            </div>
        </div>
    );
};

export default CadastroCategoria;
