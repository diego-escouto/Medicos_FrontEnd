import { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@/auth/useAuthFetch";
import Toast from "@/components/shared/Toast";
import Navbar from "@/components/shared/Navbar";
import MedicoDelete from "@/components/medicos/MedicoDelete";
import MedicoClinicasPanel from "@/components/Clinicas/MedicoClinicasPanel";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicosList = () => {
	const [medicos, setMedicos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [expandedMedicoId, setExpandedMedicoId] = useState(null);

	const authFetch = useAuthFetch();

	useEffect(() => {
		const ac = new AbortController();

		const fetchMedicos = async () => {
			try {
				const res = await authFetch(`${API_BASE_URL}/medico`, {
					method: "GET",
					signal: ac.signal,
				});

				if (!res.ok) {
					const body = await res.json().catch(() => null);
					throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ""}`);
				}

				const data = await res.json();
				setMedicos(data || []);
			} catch (err) {
				if (err?.name === "AbortError") return;
				setError(err.message ?? String(err));
			} finally {
				setLoading(false);
			}
		};

		fetchMedicos();

		return () => ac.abort();
	}, [authFetch]);

	if (loading) return <p>Carregando médicos...</p>;

	return (


		<div>
			<Navbar />

			{error && <Toast error={error} setError={setError} />}

			{medicos.length === 0 ? (
				<p className="mx-2">Nenhum médico encontrado.</p>
			) : (
				<div className="table-responsive">
					<table className="table table-striped ">
						<thead>
							<tr>
								<th>Nome</th>
								<th>CRM</th>
								<th>Especialidade</th>
								<th>Clínicas</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{medicos.map((m) => (
								<>
									<tr key={m.id} onClick={() => setExpandedMedicoId(prev => prev === m.id ? null : m.id)} style={{ cursor: 'pointer' }}>
										<td>{m.nome}</td>
										<td>{m.crm}</td>
										<td>{m.especialidade}</td>
										<td>
											{Array.isArray(m.clinicas) && m.clinicas.length > 0
												? m.clinicas.map((c) => c.razaoSocial).join(', ')
												: '—'}
										</td>
										<td className="text-end">
											<Link to={`/medico/${m.id}/edit`} className="btn btn-sm btn-outline-primary" onClick={(e) => e.stopPropagation()}>
												Editar
											</Link>
											<MedicoDelete id={m.id} onDeleted={(deletedId) => {
												setMedicos((prev) => prev.filter(p => p.id !== deletedId));
											}} onClick={(e) => e.stopPropagation()} />
										</td>
									</tr>

									{expandedMedicoId === m.id && (
										<MedicoClinicasPanel
											medico={m}
											authFetch={authFetch}
											API_BASE_URL={API_BASE_URL}
											onClinicaUpdated={(updated, opts) => {
												setMedicos(prev => prev.map(md => {
													if (md.id !== m.id) return md;
													const clinicas = Array.isArray(md.clinicas) ? [...md.clinicas] : [];
													if (opts && opts.created) {
														return { ...md, clinicas: [...clinicas, updated] };
													}
													return { ...md, clinicas: clinicas.map(cl => cl.id === updated.id ? updated : cl) };
												}));
											}}
											onError={setError}
										/>
									)}
								</>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default MedicosList;
