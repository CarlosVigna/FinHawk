import './cadastroCategoria.css';
import { useState } from 'react';
import Formulario from '../../componentes/Formulario';
import ListaCategorias from '../ListaCategorias';

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

function CadastroCategoria() {
    const [valores, setValores] = useState({
        nome: '',
        tipo: 'Recebimento',
    });

    const [erro, setErro] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [sucesso, setSucesso] = useState(""); // Adicionar estado de sucesso

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
            
            // Primeiro atualiza o estado
            setValores({
                nome: '',
                tipo: 'Recebimento'
            });
            setErro("");
            setSucesso("Categoria cadastrada com sucesso!");
            
            // Depois força a atualização da lista
            setRefresh(prev => !prev);

            // Limpa a mensagem de sucesso após 3 segundos
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
        <div className="cadastro-categoria-container">
            <div className="lado-esquerdo">
                <div className="formulario-categoria">
                    <Formulario
                        titulo="Cadastro de Categoria"
                        campos={camposCadastro}
                        botaoTexto="Cadastrar Categoria"
                        className="botao-enviar-cadastro"
                        handleInputChange={handleInputChange}
                        valores={valores}
                        onSubmit={handleCadastro}
                        erro={erro}
                        sucesso={sucesso} // Adicionar prop de sucesso
                    />
                </div>
            </div>
            <div className="lado-direito">
                <ListaCategorias refresh={refresh} />
            </div>
        </div>
    );
}

export default CadastroCategoria;
