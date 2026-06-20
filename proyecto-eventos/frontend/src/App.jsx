import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import EventosList from './components/EventosList';
import MisTickets from './components/MisTickets';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('eventos'); // eventos | login | registro | mis-tickets

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    setVista('eventos');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Gestion de Eventos</h1>
        <nav>
          <button onClick={() => setVista('eventos')}>Eventos</button>
          {usuario ? (
            <>
              <button onClick={() => setVista('mis-tickets')}>Mis Tickets</button>
              <span>Hola, {usuario.nombre}</span>
              <button onClick={cerrarSesion}>Cerrar sesion</button>
            </>
          ) : (
            <>
              <button onClick={() => setVista('login')}>Iniciar sesion</button>
              <button onClick={() => setVista('registro')}>Registrarme</button>
            </>
          )}
        </nav>
      </header>

      <main>
        {vista === 'eventos' && <EventosList usuarioAutenticado={usuario} />}
        {vista === 'login' && (
          <Login
            onLoginExitoso={(u) => {
              setUsuario(u);
              setVista('eventos');
            }}
          />
        )}
        {vista === 'registro' && <Registro onRegistroExitoso={() => setVista('login')} />}
        {vista === 'mis-tickets' && usuario && <MisTickets />}
      </main>
    </div>
  );
}

export default App;
