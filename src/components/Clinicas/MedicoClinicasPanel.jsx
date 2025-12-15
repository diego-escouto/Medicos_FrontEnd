import { useState } from "react";

export default function MedicoClinicasPanel({ medico, authFetch, API_BASE_URL, onClinicaUpdated, onError }) {
	const [editingClinicaId, setEditingClinicaId] = useState(null);
	const [editFormData, setEditFormData] = useState({});
	const [saving, setSaving] = useState(false);
	const [creating, setCreating] = useState(false);
	const [createForm, setCreateForm] = useState({ razaoSocial: '', cep: '', cnpj: '' });

	const handleSave = async (c) => {
		setSaving(true);
		try {
			const res = await authFetch(`${API_BASE_URL}/medico/${medico.id}/clinica/${c.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(editFormData),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(`Erro HTTP: ${res.status}. ${body?.message ?? ""}`);
			}
			const updated = await res.json();
			if (onClinicaUpdated) onClinicaUpdated(updated);
			setEditingClinicaId(null);
		} catch (err) {
			if (onError) onError(err.message ?? String(err));
		} finally {
			setSaving(false);
		}
	};

	const handleCreate = async () => {
		setSaving(true);
		try {
			const res = await authFetch(`${API_BASE_URL}/medico/${medico.id}/clinica`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(createForm),
			});
			if (!res.ok) {
				const body = await res.json().catch(() => null);
				throw new Error(`Erro HTTP: ${res.status}. ${body?.message ?? ''}`);
			}
			const created = await res.json();
			// chama callback para que o pai atualize a lista (append)
			if (onClinicaUpdated) onClinicaUpdated(created, { created: true });
			setCreateForm({ razaoSocial: '', cep: '', cnpj: '' });
			setCreating(false);
		} catch (err) {
			if (onError) onError(err.message ?? String(err));
		} finally {
			setSaving(false);
		}
	};

	return (
		<tr key={`${medico.id}-expanded`}>
			<td colSpan={5}>
				<div className="p-2 bg-body">
					<h6>Clínicas de {medico.nome}</h6>
					{Array.isArray(medico.clinicas) && medico.clinicas.length > 0 ? (
						<div className="list-group">
							{medico.clinicas.map((c) => (
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
														<input className="form-control form-control-sm" value={editFormData.razaoSocial || ""} onChange={(e) => setEditFormData((p) => ({ ...p, razaoSocial: e.target.value }))} />
													</div>
													<div className="mb-2">
														<input className="form-control form-control-sm" value={editFormData.cep || ""} onChange={(e) => setEditFormData((p) => ({ ...p, cep: e.target.value }))} />
													</div>
													<div className="mb-2">
														<input className="form-control form-control-sm" value={editFormData.cnpj || ""} onChange={(e) => setEditFormData((p) => ({ ...p, cnpj: e.target.value }))} />
													</div>
													<div className="d-flex gap-2">
														<button className="btn btn-sm btn-primary" disabled={saving} onClick={() => handleSave(c)}>
															Salvar
														</button>
														<button className="btn btn-sm btn-secondary" disabled={saving} onClick={() => setEditingClinicaId(null)}>
															Cancelar
														</button>
													</div>
												</>
											) : (
												<button
													className="btn btn-sm btn-outline-primary"
													onClick={(e) => {
														e.stopPropagation();
														setEditingClinicaId(c.id);
														setEditFormData({ razaoSocial: c.razaoSocial, cep: c.cep, cnpj: c.cnpj });
													}}
												>
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

					{/* criação de nova clínica */}
					{creating ? (
						<div className="mt-3">
							<div className="mb-2">
								<input className="form-control form-control-sm" placeholder="Razão Social" value={createForm.razaoSocial} onChange={(e) => setCreateForm((p) => ({ ...p, razaoSocial: e.target.value }))} />
							</div>
							<div className="mb-2">
								<input className="form-control form-control-sm" placeholder="CEP" value={createForm.cep} onChange={(e) => setCreateForm((p) => ({ ...p, cep: e.target.value }))} />
							</div>
							<div className="mb-2">
								<input className="form-control form-control-sm" placeholder="CNPJ" value={createForm.cnpj} onChange={(e) => setCreateForm((p) => ({ ...p, cnpj: e.target.value }))} />
							</div>
							<div className="d-flex gap-2">
								<button className="btn btn-sm btn-primary" disabled={saving} onClick={handleCreate}>Criar</button>
								<button className="btn btn-sm btn-secondary" disabled={saving} onClick={() => setCreating(false)}>Cancelar</button>
							</div>
						</div>
					) : (
						<div className="mt-3">
							<button className="btn btn-sm btn-success" onClick={() => setCreating(true)}>Adicionar Clínica</button>
						</div>
					)}
				</div>
			</td>
		</tr>
	);
}