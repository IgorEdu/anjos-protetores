import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getAllAnimals, getAllAnimalsADM } from '../../services/animalService';
import './AdoptionsManager.css';

const AdoptionsManager = () => {
  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [selectedAnimalDetails, setSelectedAnimalDetails] = useState(null);

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const data = await getAllAnimalsADM();
        setAnimals(data || []);
      } catch {
        alert('Não foi possível carregar a lista de animais.');
      }
    };
    loadAnimals();
  }, []);

  const loadRequests = async (animalId) => {
    if (!animalId) {
      setRequests([]);
      return;
    }

    setLoadingRequests(true);

    try {
      const { data } = await api.get(`/api/pvt/adoptionRequests`);
      const filtered = data.filter(req => req.animal?.id === animalId);
      setRequests(filtered);
    } catch {
      alert('Não foi possível carregar os pedidos de adoção.');
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAnimalChange = async (event) => {
    const id = event.target.value;
    setSelectedAnimalId(id);
    setSelectedAnimalDetails(null);

    if (id) {
      try {
        const { data } = await api.get(`/api/pub/animals/${id}`);
        setSelectedAnimalDetails(data);
      } catch {
        alert('Erro ao carregar dados do animal.');
      }
    }

    loadRequests(id);
  };

  const handleViewAnimal = async (animalId) => {
    try {
      const { data } = await api.get(`/api/pub/animals/${animalId}`);
      setSelectedAnimalDetails(data);
    } catch {
      alert('Não foi possível carregar os detalhes do animal.');
    }
  };

  const handleApprove = async (requestId) => {
    if (!requestId) {
      alert("ID do pedido inválido");
      return;
    }

    const ok = window.confirm("Confirmar adoção?");
    if (!ok) return;

    try {
      await api.put(`/api/pvt/adoptionRequests/${requestId}`);
      alert("Adoção aprovada!");
      loadRequests(selectedAnimalId);
    } catch {
      alert("Erro ao aprovar a adoção.");
    }
  };

  return (
    <div className="manager-container">
      <div className="adoptions-header">
        <h2>Pedidos de Adoção</h2>
        <p>Selecione um animal para visualizar os pedidos e definir o adotante.</p>
      </div>

      <div className="adoptions-toolbar">
        <div className="adoptions-filter">
          <label htmlFor="animalSelect">Animal:</label>
          <select
            id="animalSelect"
            value={selectedAnimalId}
            onChange={handleAnimalChange}
          >
            <option value="">Selecione um animal</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="adoptions-content">
        {loadingRequests ? (
          <p>Carregando pedidos...</p>
        ) : !selectedAnimalId ? (
          <p>Selecione um animal para ver os pedidos de adoção.</p>
        ) : selectedAnimalDetails?.status === "ADOPTED" ? (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Este animal já foi adotado. Não é possível aprovar novos pedidos.
          </p>
        ) : requests.length === 0 ? (
          <p>Não há pedidos de adoção para este animal.</p>
        ) : (
          <table className="adoptions-table">
            <thead>
              <tr>
                <th>Adotante</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Status do Animal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.adopter?.name}</td>
                  <td>{req.adopter?.email}</td>
                  <td>{req.adopter?.phone}</td>
                  <td>{req.adopter?.address}</td>
                  <td>{req.animal?.status}</td>

                  <td className="adoptions-actions">
                    <button
                      className="btn-view"
                      type="button"
                      onClick={() => handleViewAnimal(req.animal?.id)}
                    >
                      Ver animal
                    </button>

                    <button
                      className="btn-approve"
                      type="button"
                      disabled={req.animal?.status === "ADOPTED"}
                      onClick={() => handleApprove(req.id)}
                    >
                      {req.animal?.status === "ADOPTED"
                        ? "Já adotado"
                        : "Aprovar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedAnimalDetails && (
        <div className="animal-details-card">
          <h3>Detalhes do Animal</h3>

          {/* FOTO */}
          <div style={{ marginBottom: "15px" }}>
            <img
              src={selectedAnimalDetails.photoUrl || "https://via.placeholder.com/200?text=Sem+Foto"}
              alt={selectedAnimalDetails.name}
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #ccc"
              }}
            />
          </div>

          <p><strong>Nome:</strong> {selectedAnimalDetails.name}</p>
          <p><strong>Status:</strong> {selectedAnimalDetails.status}</p>

          {/* NOVOS CAMPOS */}
          <p><strong>Idade:</strong> {selectedAnimalDetails.age ?? "Não informada"}</p>
          <p><strong>Sexo:</strong> {selectedAnimalDetails.gender ?? "Não informado"}</p>
          <p><strong>Porte:</strong> {selectedAnimalDetails.animalSize ?? "Não informado"}</p>

          <p><strong>Espécie:</strong> {selectedAnimalDetails.specie?.name}</p>
          <p><strong>Raça:</strong> {selectedAnimalDetails.race?.name}</p>
          <p><strong>Descrição:</strong> {selectedAnimalDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default AdoptionsManager;
