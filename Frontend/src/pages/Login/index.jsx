import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Formulario from '../../componentes/Formulario';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './authContext';
import './login.css';

const Login = () => {
    const { login } = useAuth();
    const [valores, setValores] = useState({
        email: '',
        senha: ''
    });
    const [erro, setErro] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValores({
            ...valores,
            [name]: value
        });
    };

    const handleLogin = async () => {
        const { email, senha } = valores;
        console.log('Tentativa de login com:', email, senha);

        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            console.log('Resposta do servidor:', response);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Erro ao fazer login.';
                setErro(errorMessage);
                return;
            }

            const data = await response.json();
            console.log('Dados recebidos no login:', data);

            const { token, usuarioId } = data;

            login(token, usuarioId);
            localStorage.setItem('token', token);
            localStorage.setItem('usuarioId', usuarioId);

            setValores({ email: '', senha: '' });
            setErro('');

            console.log('Redirecionando para /contas');
            navigate('/contas');
        } catch (error) {
            console.error('Erro na requisição:', error);
            setErro('Erro ao conectar com o servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    const camposLogin = [
        { label: 'Email:', placeholder: 'Digite seu e-mail', type: 'email', name: 'email' },
        { label: 'Senha:', placeholder: 'Digite sua senha', type: 'password', name: 'senha' },
    ];

    return (
        <div className='container-login'>
            <Formulario
                titulo="Login"
                campos={camposLogin}
                botaoTexto={isLoading ? 'Carregando...' : 'Entrar'}
                className="botao-login"
                handleInputChange={handleInputChange}
                valores={valores}
                onSubmit={handleLogin}
                disabled={isLoading}
            />
            {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
    );
};

export default Login;
