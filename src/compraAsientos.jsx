import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./cssComponents/compraAsientos.css"
import { ReservarAsientos } from "./components/asientosReserva";

export const CompraAsientos = () => {
    const { idasientos } = useParams();
    const [peliculas, setPeliculas] = useState([]);

    return (
        <div id='container-asientosPeliculas'>
            <section id='section-header-compraAsientos'>
                <i className='bx bx-chevron-left'></i>
                <p>Choose Seat</p>
                <i className='bx bx-dots-vertical-rounded'></i>
            </section>
            <section id='section-title'>
                <div id='lineaRoja'></div>
                <p>Screen This Way</p>
            </section>
            <section id='section-asientos'>
                <ReservarAsientos peliculasId={idasientos} />
            </section>
        </div>
    )
}