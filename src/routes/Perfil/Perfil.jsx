import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { TiArrowBackOutline } from "react-icons/ti";
import logo from "../../assets/logo.png";
import "./Perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/pvt/adopters/profile");
        setUser(data);
      } catch (e) {
        console.error(e);
        alert("Não foi possível carregar o perfil.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout realizado com sucesso!");
    nav("/login", { replace: true });
  };

  const onDelete = async () => {
    if (!user?.id) return;
    const ok = window.confirm("Tem certeza que deseja excluir sua conta? Essa ação é irreversível.");
    if (!ok) return;
    try {
      await api.delete(`/api/pvt/adopters/${user.id}`);
      localStorage.removeItem("token");
      alert("Conta excluída com sucesso.");
      nav("/login", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Falha ao excluir a conta.");
    }
  };

  if (busy)
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    );

  if (!user)
    return (
      <div className="container">
        <p>Perfil não encontrado.</p>
      </div>
    );

  return (
    <div className="container">
      <a href="/" className="back-icon">
        <TiArrowBackOutline />
      </a>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <h1>Meu Perfil</h1>

      <div className="perfil-card">
        <p><strong>Nome:</strong> {user.name ?? user.nome}</p>
        <p><strong>E-mail:</strong> {user.email}</p>
      </div>

      <div className="perfil-actions">
        <button onClick={() => nav("/perfil/editar")}>Editar</button>
        <button className="danger" onClick={onDelete}>Excluir Conta</button>
        <button className="logout" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
