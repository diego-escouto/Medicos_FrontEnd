import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../../components/shared/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicoCreateForm = ({ onCreated }) => {
    const [nome, setNome] = useState("");
    const [crm, setCrm] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [associateClinica, setAssociateClinica] = useState(false);
    const [razaoSocial, setRazaoSocial] = useState("");
    const [cep, setCep] = useState("");
    const [cnpj, setCnpj] = useState("");

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

            const created = await res.json().catch(() => null);
            // se usuário optou por associar/ criar uma clínica, chama endpoint de clinica
            if (associateClinica && (razaoSocial.trim() || cep.trim() || cnpj.trim())) {
                try {
                    const clinicaPayload = { razaoSocial, cep, cnpj };
                    const res2 = await authFetch(`${API_BASE_URL}/medico/${created.id}/clinica`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(clinicaPayload),
                    });
                    if (!res2.ok) {
                        const body2 = await res2.json().catch(() => null);
                        // mostra erro e interrompe a navegação para permitir correção
                        setError(`Erro ao criar clínica: ${res2.status}. ${body2?.message ?? ""}`);
                        return;
                    }
                } catch (err2) {
                    setError(err2.message ?? String(err2));
                    return;
                }
            }
            if (typeof onCreated === 'function') onCreated(created);
            navigate("/medico");
        } catch (err) {
            setError(err.message ?? String(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
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

                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="associateClinica" checked={associateClinica} onChange={(e) => setAssociateClinica(e.target.checked)} />
                    <label className="form-check-label" htmlFor="associateClinica">Criar e vincular uma clínica a este médico</label>
                </div>

                {associateClinica && (
                    <div className="border rounded p-3 mb-3">
                        <div className="mb-2">
                            <label className="form-label">Razão Social</label>
                            <input className="form-control" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">CEP</label>
                            <input className="form-control" value={cep} onChange={(e) => setCep(e.target.value)} />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">CNPJ</label>
                            <input className="form-control" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                        </div>
                    </div>
                )}

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
    );
};

export default MedicoCreateForm;
