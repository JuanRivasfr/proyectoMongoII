import React from 'react';
import { useParams } from 'react-router-dom';

export const MovieDetailasd = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalles de la película {id}</h1>
      {/* Aquí puedes agregar más detalles y lógica para obtener información específica de la película */}
    </div>
  );
}
