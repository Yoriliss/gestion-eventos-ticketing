import React, { useEffect, useState } from 'react';
import { ticketService } from '../services/api';

function MisTickets() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      const respuesta = await ticketService.misTickets();
      setTickets(respuesta.data);
    } catch (error) {
      console.error('Error al cargar tickets', error);
    } finally {
      setCargando(false);
    }
  };

  const confirmarPago = async (id) => {
    try {
      await ticketService.confirmarPago(id);
      cargarTickets();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al confirmar el pago');
    }
  };

  if (cargando) return <p>Cargando tus tickets...</p>;

  return (
    <div className="mis-tickets-container">
      <h2>Mis Tickets</h2>
      {tickets.length === 0 && <p>Aun no tienes tickets comprados.</p>}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.evento?.nombre}</strong> - Codigo: {ticket.codigo_unico} - Estado: {ticket.estado}
            {ticket.estado === 'reservado' && (
              <button onClick={() => confirmarPago(ticket.id)}>Confirmar pago</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisTickets;
