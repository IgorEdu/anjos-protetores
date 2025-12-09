import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPaw } from 'react-icons/fa';
import './Adocao.css';
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const Adocao = () => {
    const [animais, setAnimais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const fetchAnimais = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await api.get('/api/pub/animals');

                console.log("Animais recebidos:", response.data);
                setAnimais(response.data);

            } catch (err) {
                console.error("Erro ao buscar animais:", err);

                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("Sua sessão expirou. Por favor, faça login novamente.");
                    localStorage.removeItem('token');

                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError("Não foi possível carregar a lista de animais. Tente novamente mais tarde.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnimais();
    }, [navigate]);

    const handleAdoptClick = (animalId) => {
        const targetUrl = animalId ? `/animal/${animalId}` : '/animais';
        navigate(targetUrl);
    };

    if (loading) {
        return (
            <div className="listagem-container">
                <p className="loading-message">Carregando animais...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="listagem-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="default-container padding-container">
                <div className="listagem-container">
                    <header className="listagem-header">
                        <h1><FaPaw /> Encontre seu novo amigo!</h1>
                        <p>Estes são os animais que esperam por um lar.</p>
                    </header>

                    <div className="animais-grid">
                        {animais.length === 0 ? (
                            <p>Nenhum animal disponível para adoção no momento.</p>
                        ) : (
                            animais.map(animal => (
                                <div className="animal-card" key={animal.id}>
                                    <img
                                        src={animal.photoUrl || 'https://via.placeholder.com/300x200?text=Sem+Foto'}
                                        alt={animal.nome}
                                        className="animal-foto"
                                    />
                                    <div className="animal-info">
                                        <h3>{animal.nome}</h3>
                                        <p><strong>Espécie:</strong> {animal.specie?.name || 'Não informada'}</p>
                                        <p><strong>Raça:</strong> {animal.race?.name || 'Não informada'}</p>
                                        <p><strong>Idade:</strong> {animal.age ? `${animal.age} anos` : 'Não informada'}</p>
                                        <p><strong>Porte:</strong> {animal.animalSize || 'Não informado'}</p>
                                        <p><strong>Sexo:</strong> {animal.gender || 'Não informado'}</p>

                                        <p className="animal-descricao"><strong>Descrição:</strong> {animal.description || 'Um amiguinho muito especial!'}</p>

                                        {/* BOTÃO ALTERADO AQUI */}
                                        <button
                                            className="btn-adotar"
                                            onClick={() => handleAdoptClick(animal.id)}
                                        >
                                            Quero Adotar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Adocao;
