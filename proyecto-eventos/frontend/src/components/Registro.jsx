import React, { useState } from 'react';
import { authService } from '../services/api';

function Registro({ onRegistroExitoso }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      await authService.registrar(nombre, email, password);
      setMensaje('Cuenta creada correctamente, ya puedes iniciar sesion');
      onRegistroExitoso();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <div className="registro-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electronico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contrasena (minimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {mensaje && <p className="exito">{mensaje}</p>}
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}

export default Registro;
