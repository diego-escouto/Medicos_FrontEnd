import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthFetch } from "../../auth/useAuthFetch";
import Toast from "../shared/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicoEdit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const authFetch = useAuthFetch();

	const [nome, setNome] = useState("");
	const [crm, setCrm] = useState("");
	const [especialidade, setEspecialidade] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const ac = new AbortController();
		const fetchMedico = async () => {
			try {
				setLoading(true);
				const res = await authFetch(`${API_BASE_URL}/medico/${id}`, {
					method: "GET",
					signal: ac.signal,
				});
				if (!res.ok) {
					const body = await res.json().catch(() => null);
					throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ""}`);
				}
				const data = await res.json();
				setNome(data.nome ?? "");
				setCrm(data.crm ?? "");
				setEspecialidade(data.especialidade ?? "");
			} catch (err) {
				if (err?.name === "AbortError") return;
				setError(err.message ?? String(err));
			} finally {
				setLoading(false);
			}
		};

		fetchMedico();
		return () => ac.abort();
	}, [id, authFetch]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			const payload = { nome, crm, especialidade };
			const res = await authFetch(`${API_BASE_URL}/medico/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ""}`);
			}
			// sucesso: volta para a lista
			navigate("/medico");
		} catch (err) {
			setError(err.message ?? String(err));
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <p>Carregando médico...</p>;

	return (
		<div className="container mt-3">
			{error && <Toast error={error} setError={setError} />}

			<h3>Editar Médico</h3>

			<form onSubmit={handleSubmit} className="mt-3" style={{ maxWidth: 600 }}>
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
						{saving ? "Salvando…" : "Salvar"}
					</button>
					<button className="btn btn-secondary" type="button" onClick={() => navigate("/medico")}>Cancelar</button>
				</div>
			</form>
		</div>
	);
};

export default MedicoEdit;

