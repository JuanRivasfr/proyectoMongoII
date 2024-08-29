import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReservarAsientos = (id) => {
    const { peliculasId } = id
    const [todasPeliculas, setTodasPeliculas] = useState([]);
    const [salaPeliculas, setSalaPeliculas] = useState([]);
    const [todosAsientos, setTodosAsientos] = useState({});
    const [funcionSeleccionada, setFuncionSeleccionada] = useState(null);
    const [asientosDisponibles, setAsientosDisponibles] = useState([]);
    const [funcionHora, setFuncionHora] =  useState([]);
    const [funcionFecha, setFuncionFecha] =  useState([]);
    const navigate = useNavigate();

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
    ;

    const objFunciones = []
    const auxObj = {}


    for (let i = 0; i < todasPeliculas.length; i++) {

        if (peliculasId === todasPeliculas[i]._id) {
            const auxObj = {
                funciones: todasPeliculas[i].funciones
            }
            objFunciones.push(auxObj)
        }
    };

    const funciones = objFunciones.length > 0 ? objFunciones[0].funciones[0].sala_id : [];

    const arrayFunciones = objFunciones.length > 0 ? objFunciones[0].funciones : [];

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const diaSemana = diasSemana[fecha.getUTCDay()];
        const diaMes = fecha.getUTCDate().toString().padStart(2, '0');
        return `${diaSemana} ${diaMes}`;
    }

    const arrayFuncionesFormateado = arrayFunciones.map(funcion => {
        return {
            ...funcion,
            fecha: formatearFecha(funcion.fecha)
        };
    });

    useEffect(() => {
        if (funciones) {
            const fetchSalas = async () => {
                try {
                    const responseSalas = await fetch(`http://localhost:3002/peliculas/c13?id=${funciones}`);
                    if (responseSalas.ok) {

                        const resSalas = await responseSalas.json();
                        setSalaPeliculas(resSalas.data);

                        const asientosIniciales = resSalas.data[0].asientos.reduce((acc, seat) => {
                            acc[seat] = "disponible";
                            return acc;
                        }, {});
                        setTodosAsientos(asientosIniciales);

                    } else {
                        console.error("Failed to fetch salas:", responseSalas.status);
                    }
                } catch (error) {
                    console.error("Error fetching seats:", error);
                }
            };

            fetchSalas();
        }
    }, [funciones]);

    const asientos = salaPeliculas && salaPeliculas.length > 0 ? salaPeliculas[0].asientos : [];

    useEffect(() => {
        if (funcionSeleccionada) {
            const fetchAsientosDisponibles = async () => {
                try {
                    const responseAsientos = await fetch(`http://localhost:3002/peliculas/c4?id=${funcionSeleccionada}`);
                    if (responseAsientos.ok) {

                        const resAsientos = await responseAsientos.json();
                        setAsientosDisponibles(resAsientos.data);           
                        setTodosAsientos(prevAsientos => {
                            const nuevosAsientos = { ...prevAsientos };
                            for (let asiento in nuevosAsientos) {
                                nuevosAsientos[asiento] = "reservado";
                            }
                            resAsientos.data.forEach(asiento => {
                                if (nuevosAsientos[asiento]) {
                                    nuevosAsientos[asiento] = "disponible";
                                }
                            });
                            return nuevosAsientos;
                        });
                    } else {
                        console.error("Failed to fetch salas:", responseAsientos.status);
                    }
                } catch (error) {
                    console.error("Error fetching seats:", error);
                }
            };
            fetchAsientosDisponibles();
        }
    }, [funcionSeleccionada]);

    useEffect(() => {
        if (funcionSeleccionada) {
            const fetchObtenerHora = async () => {
                try {
                    const responseFuncion = await fetch(`http://localhost:3002/peliculas/c14?id=${funcionSeleccionada}`);
                    if (responseFuncion.ok) {

                        const resFuncion = await responseFuncion.json();
                        setFuncionHora(resFuncion.data[0].hora_inicio); 
                        setFuncionFecha(resFuncion.data[0].fecha)            
                        
                    } else {
                        console.error("Failed to fetch salas:", responseFuncion.status);
                    }
                } catch (error) {
                    console.error("Error fetching seats:", error);
                }
            };
            fetchObtenerHora();
        }
    }, [funcionSeleccionada]);

    
    const handleAsientoClick = (seat) => {
        setTodosAsientos(val => {
            let nuevoEstado;
    

            switch (val[seat]) {
                case "disponible":
                    nuevoEstado = "no-disponible";
                    break;
                case "no-disponible":
                    nuevoEstado = "disponible";
                    break;
                case "reservado":
                    return val;
                default:
                    nuevoEstado = "disponible";
            }
    
            return {
                ...val,
                [seat]: nuevoEstado
            };
        });
    };

    function formatearFechaISO(fechaISO) {
        const fecha = new Date(fechaISO);
        const año = fecha.getUTCFullYear(); 
        const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getUTCDate().toString().padStart(2, '0');
        
        return `${año}-${mes}-${dia}`;
    }

    const handleFuncionClick = (funcionId) => {
        setFuncionSeleccionada(funcionId);
    };

    const handleBuyClick = async () => {
        const asientosNoDisponibles = Object.keys(todosAsientos).filter(asiento => todosAsientos[asiento] === "no-disponible");
        const fechaFormateada = formatearFechaISO(funcionFecha);
        console.log(fechaFormateada);
        console.log(funcionFecha);
        
        
        const payload = {
            idPelicula: peliculasId,
            fechaFuncion: fechaFormateada,
            horaInicio: funcionHora,
            asientos: asientosNoDisponibles,
            idUsuario: "66a55b542de7f97b635de2c4"
        };

        console.log(payload);
        
    
        try {
            const response = await fetch('http://localhost:3002/peliculas/c3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload) 
            });

            console.log(response);
            
    
            if (response.ok) {
                const result = await response.json();
                console.log("Reserva guardada con éxito:", result);
                 navigate('/compra-completada', { state: { payload } });
            } else {
                console.error("Error al guardar la reserva:", response.status);
            }
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
        }
    };

    return (
        <div id='container-asientos-funciones'>
            <div id='container-asientos'>
                {asientos.map(val => (
                    <div key={val} className={`containerAsientos ${todosAsientos[val]}`}
                        onClick={() => handleAsientoClick(val)}>
                        {val}
                    </div>
                ))}
            </div>
            <div id='container-funciones'>
                {arrayFuncionesFormateado.map(val => (
                    <div key={val._id} className='funciones-tarjeta'
                        onClick={() => handleFuncionClick(val._id)}>
                        <p>{val.fecha}</p>
                    </div>
                ))}
            </div>
            <div id='container-buy' onClick={handleBuyClick}>
                <p>Buy  ticket</p>
            </div>
        </div>
    )
}