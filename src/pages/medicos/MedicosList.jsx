import { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthFetch } from "@/auth/useAuthFetch";
import Toast from "@/components/shared/Toast";
import Navbar from "@/components/shared/Navbar";
import MedicoDelete from "@/components/medicos/MedicoDelete";

// Pega a API_BASE_URL da variável de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicosList = () => {
	const [medicos, setMedicos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [expandedMedicoId, setExpandedMedicoId] = useState(null);
	const [editingClinicaId, setEditingClinicaId] = useState(null);
	const [editFormData, setEditFormData] = useState({});
	const [saving, setSaving] = useState(false);

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
										<tr key={`${m.id}-expanded`}>
											<td colSpan={5}>
												<div className="p-2 bg-dark">
													<h6>Clínicas de {m.nome}</h6>
													{Array.isArray(m.clinicas) && m.clinicas.length > 0 ? (
														<div className="list-group">
															{m.clinicas.map((c) => (
																<div key={c.id} className="list-group-item">
																	<div className="d-flex justify-content-between">
																		<div>
																			<strong>{c.razaoSocial}</strong>
																			<div className="text-muted">CEP: {c.cep} &nbsp; CNPJ: {c.cnpj}</div>
																		</div>
																		<div>
																			{editingClinicaId === c.id ? (
																				<>
																					<div className="mb-2">
																						<input className="form-control form-control-sm" value={editFormData.razaoSocial || ''} onChange={(e) => setEditFormData(prev => ({ ...prev, razaoSocial: e.target.value }))} />
																					</div>
																					<div className="mb-2">
																						<input className="form-control form-control-sm" value={editFormData.cep || ''} onChange={(e) => setEditFormData(prev => ({ ...prev, cep: e.target.value }))} />
																					</div>
																					<div className="mb-2">
																						<input className="form-control form-control-sm" value={editFormData.cnpj || ''} onChange={(e) => setEditFormData(prev => ({ ...prev, cnpj: e.target.value }))} />
																					</div>
																					<div className="d-flex gap-2">
																						<button className="btn btn-sm btn-primary" disabled={saving} onClick={async () => {
																							setSaving(true);
																							try {
																								const res = await authFetch(`${API_BASE_URL}/medico/${m.id}/clinica/${c.id}`, {
																									method: 'PUT',
																									headers: { 'Content-Type': 'application/json' },
																									body: JSON.stringify(editFormData),
																								});
																								if (!res.ok) {
																									const body = await res.json().catch(() => null);
																									throw new Error(`Erro HTTP: ${res.status}. ${body?.message ?? ''}`);
																								}
																								const updated = await res.json();
																								setMedicos(prev => prev.map(md => {
																									if (md.id !== m.id) return md;
																									return {
																										...md,
																										clinicas: md.clinicas.map(cl => cl.id === c.id ? updated : cl),
																									};
																								}));
																								setEditingClinicaId(null);
																								setError('Clínica atualizada com sucesso.');
																							} catch (err) {
																								setError(err.message ?? String(err));
																							} finally {
																								setSaving(false);
																							}
																						}}>
																							Salvar
																						</button>
																						<button className="btn btn-sm btn-secondary" disabled={saving} onClick={() => setEditingClinicaId(null)}>Cancelar</button>
																					</div>
																				</>
																			) : (
																				<button className="btn btn-sm btn-outline-secondary" onClick={(e) => { e.stopPropagation(); setEditingClinicaId(c.id); setEditFormData({ razaoSocial: c.razaoSocial, cep: c.cep, cnpj: c.cnpj }); }}>
																					Editar
																				</button>
																			)}
																		</div>
																	</div>
																</div>
															))}
														</div>
													) : (
														<p>Nenhuma clínica associada.</p>
													)}
												</div>
											</td>
										</tr>
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
