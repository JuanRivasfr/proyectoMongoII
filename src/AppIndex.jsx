import './index.css'
import React, { useEffect, useRef } from 'react';
import { CarruselPeliculas } from "./components/carruselPeliculas";

export function AppIndex () {
  return(
    <>
      <Header />
      <Main />
      <Footer />
    </>
  )
}

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

export const Main = () => {
  return(
  <main>
    <div id="mainInfoPeliculas">
      <p>Now Playing</p>
      <p>See all</p>
    </div>
    <CarruselPeliculas />
  </main>)
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