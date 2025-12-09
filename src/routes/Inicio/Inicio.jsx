import React, { useState, useEffect } from 'react';
import './Inicio.css';
import Navbar from '../Navbar/Navbar';
import { BiAlignLeft } from 'react-icons/bi';
import Footer from '../Footer/Footer';
import api from '../../services/api';

const Inicio = () => {
    const [dogs, setDogs] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const response = await api.get('/api/pub/animals');
                if (!response.ok) {
                    throw new Error('Falha ao buscar dados');
                }
                
                const data = response.data;

                const formattedDogs = data.map(animal => ({
                    id: animal.id,
                    name: animal.name || animal.nome, 
                    breed: animal.race?.name || "Sem raça",
                    // age: animal.age || animal.idade || "Idade não informada",
                    // size: animal.size || animal.porte || "Médio",
                    image: animal.photoUrl || "https://via.placeholder.com/400x300?text=Sem+Foto"
                }));

                setDogs(formattedDogs);
            } catch (error) {
                console.error("Erro ao carregar animais:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDogs();
    }, []);

    // Efeito de scroll para navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Controle do carrossel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === dogs.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [dogs.length]);

    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    // para levar para a pagina de adoção (lista de caes)
    const handleAllAdoptClick = () => {
        window.location.href = '/adocao';
    };

    // na foto especifica do cachorro, para levar a aba de adoção especifica dele
    const handleAdoptClick = (animalId) => {
        const targetUrl = animalId ? `/animal/${animalId}` : '/animais'; 
        window.location.href = targetUrl;
    };

    const getItemsPerPage = () => {
        if (window.innerWidth < 600) return 1;
        if (window.innerWidth < 992) return 2;
        return 4;
    };

    const nextSlide = () => {
        const itemsPerPage = getItemsPerPage();
        const maxIndex = Math.max(0, dogs.length - itemsPerPage);

        setCurrentSlide((prev) => {
            if (prev >= maxIndex) return 0; 
            return prev + 1;
        });
    };

    const prevSlide = () => {
        const itemsPerPage = getItemsPerPage();
        const maxIndex = Math.max(0, dogs.length - itemsPerPage);

        setCurrentSlide((prev) => {
            if (prev <= 0) return maxIndex;
            return prev - 1;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [dogs.length]); 

    const goToSlide = (index) => {
        const itemsPerPage = getItemsPerPage();
        const maxIndex = Math.max(0, dogs.length - itemsPerPage);
        if (index <= maxIndex) {
            setCurrentSlide(index);
        }
    };

    return (
        <div className="inicio-container">
            {/* Navbar */}
            < Navbar />
            {/* Hero Section */}
            <section id="home" className="hero-section">
                <div className='default-container'>
                    <div className="hero-content">
                        <h1>Dê um lar para um amigo de quatro patas</h1>
                        <p>Encontre seu novo melhor amigo no Anjos Protetores. Centenas de cães esperam por uma segunda chance.</p>
                        <div className="hero-buttons">
                            <button className="primary-btn" onClick={handleAllAdoptClick}>Ver Cães para Adoção</button>
                            <button className="secondary-btn" onClick={() => 
                            {const el = document.getElementById("process"); if (el) el.scrollIntoView({ behavior: "smooth" });}}
                            >Como Funciona</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="default-container">
                    <div className="about-content">

                        <div className="about-image">
                            <img src="../../src/assets/gato-home.png" alt="Sobre nós" />
                        </div>
                        <div className="about-text">
                            <div className='about-text-content'>
                                <h2>Sobre o Anjos Protetores</h2>
                                <p>O Anjos Protetores é uma organização sem fins lucrativos dedicada a resgatar, reabilitar e encontrar lares amorosos para animais abandonados e maltratados.</p>
                                <p>Desde nossa fundação, já ajudamos mais de 1.300 animais a encontrarem famílias amorosas. Nossa missão é garantir que cada animal tenha a chance de viver uma vida feliz e saudável.</p>
                            </div>
                            <div className="stats">
                                <div className="stat">
                                    <h3>1.300+</h3>
                                    <p>Animais ajudados</p>
                                </div>
                                <div className="stat">
                                    <h3>20+</h3>
                                    <p>Voluntários</p>
                                </div>
                                <div className="stat">
                                    <h3>5</h3>
                                    <p>Anos de Atuação</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Dogs Section */}
            <section id="dogs" className="dogs-section">
                <div className="carousel-container">

                    <div className="dogs-carousel">
                        <h2>Cães Disponíveis para Adoção</h2>
                        <p className="section-subtitle">Conheça alguns dos nossos anjinhos que estão procurando um lar</p>
                        <button className="carousel-btn prev" onClick={prevSlide}>‹</button>
                        <button className="carousel-btn next" onClick={nextSlide}>›</button>

                        <div className="carousel-track">
                            {dogs.map((dog, index) => (
                                <div
                                    key={dog.id}
                                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    <div className="dog-card">
                                        <div className="dog-image">
                                            <img src={dog.image} alt={dog.name} />
                                            <div className="dog-overlay">
                                                <button className="adopt-me-btn" onClick={() => handleAdoptClick(dog.id)}>Quero Adotar</button>
                                            </div>
                                        </div>
                                        <div className="dog-info">
                                            <h3>{dog.name}</h3>
                                            {/* <p><strong>Idade:</strong> {dog.age}</p>
                                            <p><strong>Porte:</strong> {dog.size}</p> */}
                                            <p><strong>Raça:</strong> {dog.breed}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="carousel-indicators">
                            {Array.from({ length: Math.max(1, dogs.length - getItemsPerPage() + 1) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                ></button>
                            ))}
                        </div>

                        <div className="view-all-dogs">
                            <button className="view-all-btn" onClick={handleAllAdoptClick}>Ver Todos os Cães</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="process-section">
                <div className="process-container">
                    <div>
                        <h2>Como Adotar um Cão</h2>
                        <p className="section-subtitle">O processo de adoção é simples e seguro</p>
                    </div>

                    <div className="process-steps">
                        <div className="step">
                            <div className="step-icon">1</div>
                            <h3>Encontre seu amigo</h3>
                            <p>Navegue pelos nossos cães disponíveis e encontre aquele que mais combina com você.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">2</div>
                            <h3>Preencha o formulário</h3>
                            <p>Preencha nosso formulário de adoção para que possamos conhecer você melhor.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">3</div>
                            <h3>Entrevista e visita</h3>
                            <p>Realizamos uma entrevista e, se possível, uma visita ao local onde o cão viverá.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">4</div>
                            <h3>Adoção finalizada</h3>
                            <p>Após aprovação, você pode levar seu novo amigo para casa!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container-testimonials">
                    <div className='testimonials-text'>
                        <h2 className='font-title'>Histórias de Sucesso</h2>
                        <p>Veja o que as famílias adotantes têm a dizer</p>
                    </div>
                    <div className="testimonials">
                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>"Meus pets são a alegria da casa e parte essencial da nossa família! Cada um com sua personalidade. Eles me ensinam cada vez mais sobre o amor incondicional. São meu abrigo e minha paz. O carinho e a gratidão por termos acolhido-os é muito nítido nos olhares deles."</p>
                            </div>
                            <div className="testimonial-author">
                                <h4>Anna Vitória</h4>
                                <p>Relações públicas da associação</p>
                            </div>
                        </div>

                        <div className="testimonial">
                            <div className="testimonial-content">
                                <p>"Entre tantos resgates marcantes, um em especial ficou na memória da família. Durante um aniversário, um pequeno cachorro apareceu e ficou ao lado da tia de Anna, que logo se encantou por ele. Após esperarem para ver se o tutor aparecia, o cão acabou indo embora. Foram três dias de buscas, até que finalmente ele foi encontrado em um lixão. Hoje, ele vive em Ponta Grossa, com a tia de Anna, e leva uma verdadeira vida de príncipe."</p>
                            </div>
                            <div className="testimonial-author">
                                <h4>Anna Vitória</h4>
                                <p>Relações públicas da associação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="default-container">
                    <div className="cta-content">
                        <h2>Pronto para mudar uma vida?</h2>
                        <p>Adote um cão e ganhe um amigo leal para sempre</p>
                        <div className="cta-buttons">
                            <button className="primary-btn" onClick={handleAllAdoptClick}>Ver Cães para Adoção</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />                
        </div>
    );
};

export default Inicio;
