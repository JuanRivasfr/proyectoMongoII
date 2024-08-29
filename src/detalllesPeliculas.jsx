import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './cssComponents/detallesPeliculas.css';

export const DetallesPeliculas = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const response = await fetch(`http://localhost:3002/peliculas/c2?id=${id}`);
        const res = await response.json();
        setPeliculas(res.data[0]);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }

    fetchPeliculas();
  }, []);

  const handleClickMovies = (idasientos) =>{
    navigate(`/movie/boleto/${idasientos}`);
  }

  const Cast = () =>(
    <>
      <div className='container-componente-cast'>
        <div className='container-img'>
          <img src="../public/user.jpg" />
        </div>
        <div className='container-actores'>
          <p>Actor</p>
          <p>Pelicula</p>
        </div>
      </div>
    </>
  )


  return (
    <div id='container-detallesPeliculas'>
      <section id='section-header-detallesPeliculas'>
        <i className='bx bx-chevron-left'></i>
        <p>Cinema Selection</p>
        <i className='bx bx-dots-vertical-rounded'></i>
      </section>
      <section id='section-descripcion'>
        <div id='container-descripcion-img'>
          <img src={peliculas.imagen} alt="" />
        </div>
        <div id='container-titulo'>
          <div id='titulo-genero'>
            <p>{peliculas.titulo}</p>
            <p>{peliculas.genero}</p>
          </div>
          <div id='watch-trailer'>
            <i className='bx bx-play' ></i>
            <p>Watch trailer</p>
          </div>
        </div>
        <div id='container-descripcion'>
          <p>{peliculas.sinopsis}</p>
        </div>
        <div id='container-cast'>
          <p>Cast</p>
          <div id='container-cast-cast'>
            <Cast />
            <Cast />
            <Cast />
          </div>
        </div>
        <div id='container-cinema'>
          <p>Cinema</p>
          <div id='cinema-container-cinema'>
            <div id='container-cinemark'>
              <p>Cinemark</p>
              <p>Megamall, Cacique</p>
            </div>
            <div id='container-img-cinemark'>
              <img src="../public/cinemark.png"/>
            </div>
          </div>
        </div>
        <div id='container-booknow' onClick={() => handleClickMovies(peliculas._id)}>
          <p>Book Now</p>
        </div>
      </section>
    </div>
  );
}
