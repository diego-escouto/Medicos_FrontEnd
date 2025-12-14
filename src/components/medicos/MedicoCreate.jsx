import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";
import Navbar from "../shared/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicoCreate = () => {
    const [nome, setNome] = useState("");
    const [crm, setCrm] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const authFetch = useAuthFetch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const payload = { nome, crm, especialidade };
            const res = await authFetch(`${API_BASE_URL}/medico/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ""}`);
            }

            // criado com sucesso
            navigate("/medico");
        } catch (err) {
            setError(err.message ?? String(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="container mt-3" style={{ maxWidth: 700 }}>
                <h3>Novo Médico</h3>

                {error && <Toast error={error} setError={setError} />}

                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input
                            className="form-control"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">CRM</label>
                        <input
                            className="form-control"
                            value={crm}
                            onChange={(e) => setCrm(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Especialidade</label>
                        <input
                            className="form-control"
                            value={especialidade}
                            onChange={(e) => setEspecialidade(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" type="submit" disabled={saving}>
                            {saving ? "Salvando…" : "Criar Médico"}
                        </button>
                        <button className="btn btn-secondary" type="button" onClick={() => navigate("/medico")}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicoCreate;
