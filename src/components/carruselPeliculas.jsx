import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "../cssComponents/carruselPeliculas.css"

export const CarruselPeliculas = () => {
    const [peliculas, setPeliculas] = useState([]);
    const navigate = useNavigate();

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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
    };

    const handleClick = (id) => {
        navigate(`/movie/${id}`);
    };

    return (
        <div className='carrusel-container'>
            <Slider {...settings}>
                {peliculas.map(val => (
                    <div key={val._id} className='pelicula-slide' onClick={() => handleClick(val._id)}>
                        <img src={val.imagen} alt={val.titulo} className='imgCarrusel' />
                        <p>{val.titulo}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}