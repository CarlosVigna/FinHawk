import { useState } from 'react';
import Formulario from '../../componentes/Formulario';
import './cadastroUsuario.css';

const URL = "http://localhost:8080";

async function cadastrarUsuario(usuario) {
    console.log("Enviando dados para o backend:", usuario);  
    const response = await fetch (URL + "/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
    });

    console.log("Resposta da requisição:", response);  
    const data = await response.json();
    console.log("Dados retornados do backend:", data);  
    return data;
}

function CadastroUsuario() {
    const [valores, setValores] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(""); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(`Campo alterado: ${name}, Novo valor: ${value}`); 
        setValores({
            ...valores,
            [name]: value
        });
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        console.log("Iniciando cadastro com os seguintes dados:", valores);  

        const { nome, email, senha, confirmarSenha } = valores;

        if (senha !== confirmarSenha) {
            console.log("Erro: As senhas não coincidem!"); 
            setErro("As senhas não coincidem!");
            return;
        }

        const novoUsuario = { nome, email, senha };
        console.log("Dados do novo usuário para cadastro:", novoUsuario);  

        try {
            const data = await cadastrarUsuario(novoUsuario);
            console.log("Dados após o cadastro:", data);  

            if (data && data.id) {  
                setSucesso("Cadastro realizado com sucesso!");  
                setValores({
                    nome: '',
                    email: '',
                    senha: '',
                    confirmarSenha: ''
                });
                setErro("");  
            } else {
                setErro("Erro ao cadastrar Usuário. Tente novamente.");
            }
        } catch (error) {
            console.log("Erro ao tentar cadastrar usuário:", error); 
            setErro("Erro ao cadastrar Usuário. Tente novamente.");
        }
    };

    const camposCadastro = [
        { label: "Nome:", placeholder: "Digite seu nome", type: "text", name: "nome" },
        { label: "Email:", placeholder: "Digite seu e-mail", type: "email", name: "email" },
        { label: "Senha:", placeholder: "Digite sua senha", type: "password", name: "senha" },
        { label: "Confirme sua senha:", placeholder: "Repita sua senha", type: "password", name: "confirmarSenha" }
    ];

    return (
        <div className='contai-cadastro'>
            <Formulario 
                titulo="Cadastro de Usuário"
                campos={camposCadastro}
                botaoTexto="Enviar Cadastro" 
                className="botao-enviar-cadastro"
                handleInputChange={handleInputChange}
                valores={valores}
                onSubmit={handleCadastro}
            />
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        </div>
    );
}

export default CadastroUsuario;
