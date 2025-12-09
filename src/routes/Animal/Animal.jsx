import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPaw } from 'react-icons/fa';
import { TiArrowBackOutline } from 'react-icons/ti';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Animal.css';
import api from '../../services/api';

const Animal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoEnviado, setPedidoEnviado] = useState(false); // Controla o estado do botão

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Se não tiver token, redireciona para login
    if (!token) {
      navigate('/login');
      return;
    }

    const buscarDados = async () => {
      try {
        setLoading(true);

        // 1. Busca os detalhes do animal
        const responseAnimal = await api.get(`/api/pub/animals/${id}`);
                if (!responseAnimal.ok) {
          throw new Error("Erro ao buscar animal");
        }
        const dataAnimal = responseAnimal.data;
        setAnimal(dataAnimal);

                // 2. Verifica se o usuário JÁ enviou um pedido para este animal
                // Isso garante que o botão fique verde mesmo se der F5 na página
        const responseCheck = await api.get(`/api/pub/animals/request/check/${id}`);
        
        if (responseCheck.status === 200) {
            const jaPediu = responseCheck.data;
            setPedidoEnviado(jaPediu);
        }

      } catch (error) {
        console.error("Erro:", error);
        setErro(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        buscarDados();
    }
  }, [id, navigate]);

  const handleAdotar = async () => {
    const token = localStorage.getItem("token");

    // Evita duplo clique se já foi enviado
    if (pedidoEnviado) return;

    try {
      await api.post(`/api/pub/animals/request/${id}`);

            if (!response.ok) {
        throw new Error("Falha ao enviar pedido");
      }
      
      // Atualiza o estado visual imediatamente
      setPedidoEnviado(true);

      alert("Pedido de adoção enviado com sucesso! Entraremos em contato em breve via e-mail ou whatsapp para te comunicar nossa decisão.");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar o pedido de adoção");
    }
  };

  const handleVoltar = () => navigate(-1);

  if (loading) return <div className="loading">Carregando...</div>;

  if (!animal || erro) {
    return (
      <div className="default-container padding-container">Animal não encontrado</div>
    );
  }

  // Objeto auxiliar para exibir dados com segurança (evita erros se for null)
  const animalDisplay = {
    name: animal.name,
    description: animal.description,
    specie: animal.specie?.name || 'Espécie não informada',
    race: animal.race?.name || 'Raça não informada',
    fotoUrl: animal.photoUrl || "https://via.placeholder.com/500x350?text=Sem+Foto",
    idade: animal.age ? `${animal.age} anos` : "Não informado",
    sexo: animal.gender || "Não informado",
    porte: animal.animalSize || "Não informado"
  };

  return (
    <>
      <Navbar />
      <div className='section-animal'>
        <div className="default-container padding-container">

          <div className="detalhes-wrapper">
            <button onClick={handleVoltar} className="back-icon" title="Voltar">
              <TiArrowBackOutline />
            </button>

            <div className="detalhes-imagem-container">
              <img
                src={animalDisplay.fotoUrl}
                alt={animalDisplay.name}
                className="detalhes-foto"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className="detalhes-info-container">

              <h1 className="detalhes-titulo">{animalDisplay.name}</h1>

              <div className="tags-container">
                <span className="tag especie">{animalDisplay.specie}</span>
                <span className="tag raca">{animalDisplay.race}</span>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <strong>Idade:</strong>
                  <span>{animalDisplay.idade}</span>
                </div>
                <div className="info-item">
                  <strong>Sexo:</strong>
                  <span>{animalDisplay.sexo}</span>
                </div>
                <div className="info-item">
                  <strong>Porte:</strong>
                  <span>{animalDisplay.porte}</span>
                </div>
              </div>

              <div className="descricao-section">
                <h3>Sobre o {animalDisplay.name}</h3>
                <p>{animalDisplay.description}</p>
              </div>

              {/* Botão de Adoção Dinâmico */}
              <button 
                className={`btn-adotar-grande ${pedidoEnviado ? 'btn-sucesso' : ''}`} 
                onClick={handleAdotar}
                disabled={pedidoEnviado} // Desabilita se já pediu
                style={pedidoEnviado ? { backgroundColor: '#4CAF50', cursor: 'default' } : {}}
              >
                {pedidoEnviado ? (
                  <span>Requisição feita com sucesso!</span>
                ) : (
                  <>
                    <FaPaw /> Quero Adotar o {animalDisplay.name}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Animal;