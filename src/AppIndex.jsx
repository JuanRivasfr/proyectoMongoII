import './index.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CarruselPeliculas } from "./components/carruselPeliculas";
import { DetallesPeliculas } from "./detalllesPeliculas"
import {CarruselPeliculasComingSoon} from "./components/carruselComing"
import { CompraAsientos } from "./compraAsientos"
export function AppIndex() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/movie/:id" element={<DetallesPeliculas />} /> 
        <Route path="/movie/boleto/:idasientos" element={<CompraAsientos />} /> 
      </Routes>
    </Router>
  );
}


export const Main = () => (
  <>
    <Header />
    <main>
      <div id="mainInfoPeliculas">
        <p>Now Playing</p>
        <p>See all</p>
      </div>
      <CarruselPeliculas />
      <div id='mainInfoPeliculas'>
        <p>Coming Soon</p>
        <p>See all</p>
      </div>
      <CarruselPeliculasComingSoon />
    </main>
    <Footer />
  </>
);

export const Header = () => {
    return (
      <header>
        <div id="headerInfoUsuario">
          <div id="headerInfoUsuarioFotoNombre">
            <img src="/png-transparent-default-avatar-thumbnail-removebg-preview.png" alt=""></img>
            <div id="fotoNombreSaludo">
              <small>Hi, Ferrucio Tuccine!</small>
              <p>Let's watch movie together!</p>
            </div>
          </div>
          <div id="headerInfoUsuarioNotificaciones">
            <div id="notificacionesIcono">
              <i className='bx bx-bell'></i>
            </div>
          </div>
        </div>
        <div id="headerBarraBusqueda">
          <i className='bx bx-search'></i>
          <input type="text" placeholder="Search movie, cinema, genre..."></input>
        </div>
      </header>
    )
}

export const Footer = () => {
    return(
        <footer>
      <div className="botonesIconos">
        <i className='bx bx-home'></i>
        <p>Home</p>
      </div>
      <div className="botonesIconos">
        <i className='bx bx-search'></i>
        <p>Browse</p>
      </div>
      <div className="botonesIconos">
        <i className='bx bx-movie'></i>
        <p>Tickets</p>
      </div>
      <div className="botonesIconos">
        <i className='bx bx-user'></i>
        <p>Profile</p>
      </div>
    </footer>
    )
}