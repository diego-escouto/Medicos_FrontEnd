import MedicoCreateForm from "@/components/medicos/MedicoCreateForm";
import Navbar from "../../components/shared/Navbar";

const MedicoCreate = () => {
    return (
        <div>
            <Navbar />
            <div className="container mt-3" style={{ maxWidth: 700 }}>
                <h3>Novo Médico</h3>
                <MedicoCreateForm />
            </div>
        </div>
    );
};

export default MedicoCreate;
