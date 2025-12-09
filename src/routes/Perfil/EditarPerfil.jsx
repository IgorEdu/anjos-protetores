import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./EditarPerfil.css";

export default function EditarPerfil() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [id, setId] = useState(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);

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

        setId(data.id);
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? ""
        });
      } catch (e) {
        console.error(e);
        alert("Não foi possível carregar seus dados.");
        nav("/perfil");
      } finally {
        setBusy(false);
      }
    })();
  }, [nav]);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    try {
      await api.put(`/api/pvt/users/${id}`, form);

      alert("Dados atualizados com sucesso!");
      nav("/perfil");
    } catch (e) {
      console.error(e);
      alert("Falha ao atualizar os dados.");
    } finally {
      setSaving(false);
    }
  };

  if (busy)
    return (
      <div className="editar__container">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="editar__container">
      <h1>Editar Perfil</h1>

      <form onSubmit={onSubmit} className="editar__form">
        <label>
          Nome
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Telefone
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Endereço
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={onChange}
            required
          />
        </label>

        <div className="editar__actions">
          <button
            type="button"
            onClick={() => nav("/perfil")}
            disabled={saving}
          >
            Cancelar
          </button>

          <button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
