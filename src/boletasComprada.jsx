import React from 'react';
import { useLocation } from 'react-router-dom';
import "./cssComponents/boletasCompradas.css"

export const BoletasComprada = () => {
    const location = useLocation();
    const { payload } = location.state || {};

    return (
        <div id='container-ticket'>
            <section id='section-header-compraAsientos'>
                <i className='bx bx-chevron-left'></i>
                <p>Ticket</p>
                <i className='bx bx-dots-vertical-rounded'></i>
            </section>
            <section id='section-ticket-compraAsientos'>
                <h1>Reserva Completada</h1>
                {payload ? (
                    <div id='section-info-boletas'>
                        <div>
                            <p className='container-boletas'>Pelicula ID</p>
                            <p>{payload.idPelicula}</p>
                        </div>
                        <div>
                            <p className='container-boletas'>Fecha de la Función</p>
                            <p>{payload.fechaFuncion}</p>
                        </div>
                        <div>
                            <p className='container-boletas'>Hora de Inicio</p>
                            <p>{payload.horaInicio}</p>
                        </div>
                        <div>
                            <p className='container-boletas'>Asientos Reservados</p>
                            <p>{payload.asientos.join(' ')}</p>
                        </div>  
                    </div>
                ) : (
                    <p>No se encontró información sobre la reserva.</p>
                )}
            </section>
        </div>
    );
};