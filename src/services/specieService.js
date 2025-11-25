import api from './api';

// Buscar todas as espécies
export const getAllSpecies = async () => {
    const response = await api.get('/api/pvt/species');
    return response.data;
};

// Criar nova espécie
export const createSpecie = async (name) => {
    // O backend espera um JSON: { "name": "..." }
    const response = await api.post('/api/pvt/species', { name });
    return response.data;
};

// Deletar espécie
export const deleteSpecie = async (id) => {
    await api.delete(`/api/pvt/species/${id}`);
};