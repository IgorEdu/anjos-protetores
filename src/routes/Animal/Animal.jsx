import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaw } from 'react-icons/fa';
import './Animal.css';
import Navbar from '../Navbar/Navbar';
import { TiArrowBackOutline } from 'react-icons/ti';
import Footer from '../Footer/Footer';

const Animal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

useEffect(() => {

  const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }
  const buscarAnimal = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:8080/api/pub/animals/${id}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar animal");
      }

      const data = await response.json();
      setAnimal(data);

    } catch (error) {
      console.error("Erro:", error);
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  if (id) buscarAnimal();
}, [id]);

  const handleAdotar = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/pub/animals/request/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao enviar pedido");
      }

      alert("Pedido de adoção enviado com sucesso!");
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

  console.log(animal)
  const animalDisplay = {
    name: animal.name,
    description: animal.description,
    specie: animal.specie?.name || 'Espécie não informada',
    race: animal.race?.name || 'Raça não informada',
    fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    idade: 'Não informado',
    sexo: 'Não informado',
    porte: 'Não informado'
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
                <span className="tag especie">{animal.specie.name}</span>
                <span className="tag raca">{animal.race.name}</span>
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

              <button className="btn-adotar-grande" onClick={handleAdotar}>
                <FaPaw /> Quero Adotar o {animalDisplay.name}
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