import React, { useState, useEffect } from 'react';
import "../cssComponents/carruselComing.css";

export const CarruselPeliculasComingSoon = () => {
    const [peliculas, setPeliculas] = useState([]);

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await fetch('http://localhost:3002/peliculas/c1');
                const res = await response.json();
                setPeliculas(res.data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        }

        fetchPeliculas();
    }, []);
    
    return (
        <div className='carrusel-container-coming'>
                {peliculas.map(val => (
                    <div className='container-componentComing'>
                        <div className='containerImg'>
                            <img src={val.imagen} alt="" />
                        </div>
                        <div className='container-descripcion'>
                            <p>{val.titulo}</p>
                        </div>
                    </div>
                ))}
        </div>
    );
}