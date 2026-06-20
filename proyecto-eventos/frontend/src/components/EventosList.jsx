import React, { useEffect, useState } from 'react';
import { eventoService, ticketService } from '../services/api';

function EventosList({ usuarioAutenticado }) {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const respuesta = await eventoService.listar();
      setEventos(respuesta.data);
    } catch (error) {
      console.error('Error al cargar eventos', error);
    } finally {
      setCargando(false);
    }
  };

  const comprarTicket = async (eventoId) => {
    if (!usuarioAutenticado) {
      setMensaje('Debes iniciar sesion para comprar tickets');
      return;
    }

    try {
      const respuesta = await ticketService.comprar(eventoId);
      setMensaje(`Ticket reservado: ${respuesta.data.ticket.codigo_unico}. Confirma el pago antes de 10 minutos.`);
      cargarEventos(); // refresca disponibilidad
    } catch (error) {
      setMensaje(error.response?.data?.error || 'Error al comprar el ticket');
    }
  };

  if (cargando) return <p>Cargando eventos...</p>;

  return (
    <div className="eventos-container">
      <h2>Eventos Disponibles</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <div className="eventos-grid">
        {eventos.map((evento) => {
          const disponibles = evento.capacidad - evento.tickets_vendidos;
          return (
            <div key={evento.id} className="evento-card">
              <h3>{evento.nombre}</h3>
              <p>{evento.descripcion}</p>
              <p>Lugar: {evento.lugar}</p>
              <p>Fecha: {new Date(evento.fecha).toLocaleDateString()}</p>
              <p>Precio: ${evento.precio}</p>
              <p>Disponibles: {disponibles > 0 ? disponibles : 'Agotado'}</p>
              <button onClick={() => comprarTicket(evento.id)} disabled={disponibles <= 0}>
                Comprar Ticket
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventosList;
