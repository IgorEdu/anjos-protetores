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

  // Remove padding-top global enquanto esta tela estiver montada
  useEffect(() => {
    document.body.classList.add("no-navbar-padding");
    return () => {
      document.body.classList.remove("no-navbar-padding");
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/pvt/users/profile");
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
      await api.delete(`/api/pvt/users/${user.id}`);
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
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>E-mail:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.phone || "Não informado"}</p>
        <p><strong>Endereço:</strong> {user.address || "Não informado"}</p>
      </div>

      <div className="perfil-actions">
        <button onClick={() => nav("/perfil/editar")}>Editar</button>
        <button className="danger" onClick={onDelete}>Excluir Conta</button>
        <button className="logout" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
}
