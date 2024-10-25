import React, { useEffect, useState } from 'react';

const Movimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovimientos = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.usuario || !user.usuario.id) {
                setError('Usuario no encontrado.');
                setLoading(false);
                return;
            }

            const id_usuario = user.usuario.id;

            try {
                const response = await fetch('http://localhost:3000/api/movimientos/movimientos-usuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_usuario }),
                });

                if (!response.ok) {
                    throw new Error('No hay movimientos disponibles.');
                }

                const data = await response.json();
                setNumeroTarjeta(data.data.numero_tarjeta); // Guardar el número de tarjeta
                setMovimientos(data.movimientos); // Guardar los movimientos
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovimientos();
    }, []);

    if (loading) {
        return <p>Cargando movimientos...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <>
            
            {numeroTarjeta && (
                <p className="text-gray-700 mb-4 m-12">Número de Tarjeta: **** **** **** {numeroTarjeta.slice(-4)}</p>
            )}
            <ul className="space-y-4">
                {movimientos.length > 0 ? (
                    movimientos.map((movimiento, index) => (
                        <li key={index} className="border p-4 rounded-md shadow-sm">
                            <p className="font-semibold">Tipo de Movimiento: {movimiento.tipo_movimiento}</p>
                            <p className="text-gray-700">Monto: {movimiento.monto}</p>
                            <p className="text-gray-500">Fecha: {new Date(movimiento.fecha_movimiento).toLocaleString()}</p>
                        </li>
                    ))
                ) : (
                    <div>
                        <h1 className='font-semibold text-2xl text-[#5E17EB]'>HISTORIAL</h1>
                        <p className="text-gray-500">No hay movimientos disponibles.</p>
                    </div>
                )}
            </ul>
        </>
    );
};

export default Movimientos;
