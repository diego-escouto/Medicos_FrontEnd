import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";

// Páginas e Layouts

import App from './pages/App.jsx'
import Sobre from './pages/Sobre.jsx'
import Contato from './pages/Contato.jsx';

// Usuários
import UsuariosLogin from './pages/usuarios/UsuariosLogin.jsx';
import UsuariosRegister from './pages/usuarios/UsuariosRegister.jsx';

// Médicos
import MedicosList from './pages/medicos/MedicosList.jsx';
import MedicoCreate from './pages/medicos/MedicoCreate.jsx';
import MedicoEdit from './components/medicos/MedicoEdit.jsx';

// Clínicas
// import ClinicaEdit from './pages/clinicas/ClinicaEdit.jsx';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"

const router = createHashRouter([
    { path: "/", element: <App /> },
    { path: "/sobre", element: <Sobre /> },
    { path: "/contato", element: <Contato /> },
    


    { path: "/medico", element: <MedicosList /> },
    { path: "/medico/:id/edit", element: <MedicoEdit /> },
    { path: "/medico/create", element: <MedicoCreate /> },
    // { path: "/clinica/:id/edit", element: <ClinicaEdit /> },

    { path: "/cliente/login", element: <UsuariosLogin /> },
    { path: "/cliente", element: <UsuariosRegister /> },
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)