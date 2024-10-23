import React from 'react';

const TarjetaCredito = ({ tipoCuenta, nombre_usuario, numeroTarjeta, correo, pin }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 mt-4">

            <div className="mt-4">
                <h4 className="text-md font-semibold">Información Importante</h4>
                <p>Correo: {correo}</p>
                <p>PIN: {pin}</p>
            </div>
        </div>
    );
};

export default TarjetaCredito;
