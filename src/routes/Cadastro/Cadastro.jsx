import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';
import './Cadastro.css';
import logo from '../../assets/logo.png';
import api from '../../services/api';

const Cadastro = () => {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const handleSubmit = async (event) => { 
        event.preventDefault();

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        try {
            const signUpPayload = {
                name: nome,
                email: email,
                password: senha,
                phone: telefone,
                address: endereco
            };

            await api.post('/api/pvt/auth/signUp', signUpPayload);

            alert('Cadastro realizado com sucesso! Agora podes fazer o login.');
            window.location.href = '/login';

        } catch (error) {
            alert('Falha no cadastro. O e-mail pode já estar em uso.');
            console.error('Ocorreu um erro no cadastro:', error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>

                <h1>Anjos Protetores de Animais - Cadastro</h1>

                <div className='input-field'>
                    <input
                        type="text"
                        placeholder="Nome completo"
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input
                        type="email"
                        placeholder="E-mail"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaEnvelope className='icon' />
                </div>

                <div className='input-field'>
                    <input
                        type="text"
                        placeholder="Telefone"
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input
                        type="text"
                        placeholder="Endereço"
                        onChange={(e) => setEndereco(e.target.value)}
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input
                        type="password"
                        placeholder="Senha"
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
                </div>

                <div className='input-field'>
                    <input
                        type="password"
                        placeholder="Confirmar senha"
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                    <FaLock className='icon' />
                </div>

                <button>Cadastrar</button>

                <div className="login-link">
                    <p>Já tem uma conta? <a href="/login">Entrar</a></p>
                </div>
            </form>
        </div>
    );
};

export default Cadastro;
