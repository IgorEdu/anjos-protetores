import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import './Login.css';
import logo from '../../assets/logo.png';
import api from '../../services/api';

const Login = () => {

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => { 
    event.preventDefault();

    try {
        const loginPayload = {
        email: email,
        password: password,
        };

        // Envia login
        const response = await api.post('/api/pvt/auth/login', loginPayload);

        // Pega o token retornado pela API
        const token = response?.data?.token;
        if (!token) {
        alert("Falha no login: token não recebido.");
        return;
        }

        // Salva o token localmente
        localStorage.setItem("token", token);

        alert('Login realizado com sucesso!');
        console.log('Token de acesso:', token);

        // Redireciona o usuário para a página de perfil
        window.location.href = "/perfil";

    } catch (error) {
        alert('Falha no login. Verifique seu e-mail e senha.');
        console.error('Ocorreu um erro no login:', error);
    }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <a href="/"><TiArrowBackOutline className='back-icon' /></a>
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <h1>Anjos Protetores de Animais Login</h1>
                <div className='input-field'>
                    <input type="email" placeholder="E-mail"
                        onChange={(e) => setEmail(e.target.value)} />
                    <FaUser className='icon' />
                </div>
                <div className='input-field'>
                    <input type="password" placeholder="Senha"
                        onChange={(e) => setPassword(e.target.value)} />
                    <FaLock className='icon' />
                </div>
                <div className="recall-forget">
                    <label>
                        <input type="checkbox" />
                        Lembrar de mim
                    </label>
                    <a href="#">Esqueci minha senha</a>
                </div>
                <button>Entrar</button>
                <div className="signup-link">
                    <p>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></p>
                </div>
            </form>
        </div>
    )
}

export default Login;
