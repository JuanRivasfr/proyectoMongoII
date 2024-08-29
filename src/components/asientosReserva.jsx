import React, { useState, useEffect } from 'react';
import "../cssComponents/carruselComing.css";

export const ReservarAsientos = (id) => {
    const {peliculasId} = id
    const [todasPeliculas, setTodasPeliculas] = useState([]);

    useEffect(() => {
        const fetchAsientos = async () => {
            try {
                const response = await fetch('http://localhost:3002/peliculas/c1');
                const res = await response.json();
                setTodasPeliculas(res.data);
            } catch (error) {
                console.error("Error fetching seats:", error);
            }
        }

        fetchAsientos();
    }, []);
    
    console.log(todasPeliculas);

    const objFunciones = []
    const auxObj = {}
    
    for (let i = 0; i < todasPeliculas.length; i++) {

        if(peliculasId === todasPeliculas[i]._id){
            const auxObj = {
                funciones : todasPeliculas[i].funciones
            }
            objFunciones.push(auxObj)
        }       
    }
    let objFuncionesPelicula = null
    objFuncionesPelicula = objFunciones[0].funciones

    // for (let i = 0; i < array.objFuncionesPelicula; i++) {
    //     console.log("hola");
        
    // }

    console.log(objFunciones);
    

    return(
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid hic, non voluptatibus porro incidunt earum possimus nihil soluta, cumque illum nobis distinctio voluptatem dolor quam optio ipsa. Eos, minima ea.</p>
    )

}