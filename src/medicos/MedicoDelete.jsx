import { useState } from "react";
import { useAuthFetch } from "../auth/useAuthFetch";
import Toast from "../components/shared/Toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MedicoDelete = ({ id, onDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const authFetch = useAuthFetch();

    const handleDelete = async () => {
        const ok = window.confirm("Confirma exclusão deste médico?");
        if (!ok) return;
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`${API_BASE_URL}/medico/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(`Erro HTTP: ${res.status}. ${body?.erro ?? ""}`);
            }
            if (typeof onDeleted === "function") onDeleted(id);
        } catch (err) {
            setError(err.message ?? String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <Toast error={error} setError={setError} />}
            <button
                className="btn btn-sm btn-outline-danger mx-1"
                onClick={handleDelete}
                disabled={loading}
                aria-label="Excluir médico"
            >
                {loading ? "…" : "Excluir"}
            </button>
        </>
    );
};

export default MedicoDelete;
