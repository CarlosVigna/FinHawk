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
            const resposta = await cadastrarCategoria(novaCategoria);
            console.log("Categoria cadastrada com sucesso:", resposta);

            setRefresh(prev => !prev); 

            setValores({
                nome: '',
                tipo: 'Recebimento' 
            });

            setErro(""); 

        } catch (error) {
            setErro(error.message || "Erro ao cadastrar Categoria. Tente novamente.");
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
        <div className='container-categoria'>
            <div className='header-categoria'>
            <Formulario 
                titulo="Cadastro de Categoria"
                campos={camposCadastro}
                botaoTexto="Enviar Cadastro" 
                className="botao-enviar-cadastro"
                handleInputChange={handleInputChange}
                valores={valores}
                onSubmit={handleCadastro}
            />
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            </div>
         
            <div className='lista-categorias'>
            <ListaCategorias refresh={refresh}/>

            </div>
         </div>
        

        
    );
}

export default CadastroCategoria;
