import React, { useState, useEffect } from 'react';
import {
    getAllAnimalsADM,
    createAnimal,
    deleteAnimal,
    updateAnimal
} from '../../services/animalService';
import { getAllSpecies } from '../../services/specieService';
import { getRacesBySpecie } from '../../services/raceService';
import './AnimalsManager.css';

const DEFAULT_IMAGE = "https://via.placeholder.com/80x80?text=Sem+Foto";

const AnimalsManager = () => {
    const [animals, setAnimals] = useState([]);
    const [species, setSpecies] = useState([]);
    const [races, setRaces] = useState([]);

    const [editingId, setEditingId] = useState(null); // ← ID do animal em edição

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        specieId: '',
        raceId: '',
        gender: '',
        age: '',
        animalSize: '',
        photoUrl: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (formData.specieId) {
            loadRaces(formData.specieId);
        } else {
            setRaces([]);
        }
    }, [formData.specieId]);

    const loadInitialData = async () => {
        try {
            const [animalsData, speciesData] = await Promise.all([
                getAllAnimalsADM(),
                getAllSpecies()
            ]);
            setAnimals(animalsData);
            setSpecies(speciesData);
        } catch (e) {
            console.error("Erro ao carregar dados:", e);
        }
    };

    const loadRaces = async (specieId) => {
        try {
            const racesData = await getRacesBySpecie(specieId);
            setRaces(racesData);
        } catch (e) {
            console.error("Erro ao carregar raças:", e);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            name: '',
            description: '',
            specieId: '',
            raceId: '',
            gender: '',
            age: '',
            animalSize: '',
            photoUrl: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photoUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            description: formData.description,
            specieId: formData.specieId,
            raceId: formData.raceId,
            gender: formData.gender,
            age: formData.age,
            animalSize: formData.animalSize,
            photoUrl: formData.photoUrl,
            status: formData.status || 'AVAILABLE'
        };

        try {
            if (editingId) {
                await updateAnimal(editingId, payload);
                alert("Animal atualizado com sucesso!");
            } else {
                await createAnimal(payload);
                alert("Animal cadastrado!");
            }

            resetForm();
            loadInitialData();

        } catch (error) {
            console.error(error);
            alert("Erro ao salvar animal.");
        }
    };

    const startEditing = (animal) => {
        setEditingId(animal.id);

        setFormData({
            name: animal.name,
            description: animal.description,
            specieId: animal.specie?.id || '',
            raceId: animal.race?.id || '',
            gender: animal.gender ?? '',
            age: animal.age ?? '',
            animalSize: animal.animalSize ?? '',
            photoUrl: animal.photoUrl ?? '',
            status: animal.status
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;

        try {
            await deleteAnimal(id);
            setAnimals(animals.filter(a => a.id !== id));
        } catch (err) {
            alert("Erro ao deletar.");
        }
    };

    return (
        <div className="manager-container">
            <h3>Gerenciar Animais</h3>

            {/* FORMULÁRIO */}
            <form className="animal-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Nome *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Idade</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Sexo</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Porte</label>
                    <select name="animalSize" value={formData.animalSize} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="Pequeno">Pequeno</option>
                        <option value="Médio">Médio</option>
                        <option value="Grande">Grande</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Foto do Animal</label>
                    <input type="file" accept="image/*" onChange={handleImageSelect} />
                    {formData.photoUrl && (
                        <img src={formData.photoUrl} className="preview-image" alt="preview" />
                    )}
                </div>

                <div className="form-group">
                    <label>Espécie *</label>
                    <select
                        name="specieId"
                        value={formData.specieId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {species.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Raça *</label>
                    <select
                        name="raceId"
                        value={formData.raceId}
                        disabled={!formData.specieId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {races.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group full-width">
                    <label>Descrição</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>

                <button type="submit" className="btn-add">
                    {editingId ? "Salvar Alterações" : "Cadastrar Animal"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={resetForm}
                    >
                        Cancelar Edição
                    </button>
                )}
            </form>

            {/* LISTA */}
            <table className="animals-table">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Espécie/Raça</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {animals.map(animal => (
                        <tr key={animal.id}>
                            <td>
                                <img
                                    src={animal.photoUrl || DEFAULT_IMAGE}
                                    className="thumb-image"
                                    alt="Sem foto"
                                />
                            </td>
                            <td><strong>{animal.name}</strong></td>
                            <td>{animal.specie?.name} - {animal.race?.name}</td>
                            <td>{animal.status}</td>

                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => startEditing(animal)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(animal.id)}
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default AnimalsManager;
