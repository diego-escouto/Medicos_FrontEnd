import { Link } from "react-router-dom"
import Navbar from "../components/shared/Navbar"
import { useAuth } from "../auth/useAuth";


// src/App.jsx
const App = () => {
    const { user, authLoading } = useAuth();

    // Enquanto ainda está carregando o estado de auth, não decide redirecionar
    if (authLoading) {
        return <p>Carregando usuário...</p>; // ou um spinner bonitinho
    }

    return (
        <div>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="container-sm border rounded-2 m-2 p-3" style={{ maxWidth: '420px' }}>
                    <div className="d-grid gap-2">
                        {!user && <Link to="/cliente/login" className="btn btn-primary w-100 p-2 mb-2">Faça seu login</Link>}
                        {!user && <Link to="/cliente" className="btn btn-primary w-100">Faça seu cadastro</Link>}
                        {user && <Link to="/medico" className="btn btn-primary w-100">Médicos</Link>}
                        {user && <Link to="/medico/create" className="btn btn-primary w-100">Cadastrar um Médico</Link>}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default App