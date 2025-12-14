import Navbar from "../../components/shared/Navbar";
import MedicoCreateForm from "../../medicos/components/MedicoCreateForm";

const MedicoCreatePage = () => {
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

export default MedicoCreatePage;
