import React, { useEffect, useState } from 'react';

const Movimientos = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [tarjetas, setTarjetas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTarjetas = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.usuario || !user.usuario.id) {
                setError('Usuario no encontrado.');
                setLoading(false);
                return;
            }

            const numerosTarjetas = user.usuario.numeros_tarjetas.split(', ');
            setTarjetas(numerosTarjetas);
            
            if (numerosTarjetas.length > 0) {
                setNumeroTarjeta(numerosTarjetas[0]); // Establecer el primer número de tarjeta
            } else {
                setError('No se encontraron tarjetas.');
            }
            setLoading(false); // Asegúrate de finalizar la carga
        };

        fetchTarjetas();
    }, []);

    useEffect(() => {
        if (numeroTarjeta) {
            fetchMovimientos(numeroTarjeta);
        }
    }, [numeroTarjeta]);

    const fetchMovimientos = async (tarjeta) => {
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
                body: JSON.stringify({ id_usuario, numero_tarjeta: tarjeta }),
            });

            if (!response.ok) {
                throw new Error('No hay movimientos disponibles.');
            }

            const data = await response.json();
            setMovimientos(data.movimientos); // Guardar los movimientos
            setError(null); // Resetear el error si la petición fue exitosa
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (event) => {
        const selectedNumeroTarjeta = event.target.value;
        setNumeroTarjeta(selectedNumeroTarjeta);
    };

    if (loading) {
        return <p>Cargando movimientos...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <>
            <h1 className='font-semibold text-2xl text-[#5E17EB]'>HISTORIAL</h1>

            {tarjetas.length > 0 && (
                <div className="mb-4">
                    <label htmlFor="numeroTarjeta" className="block mb-2">Selecciona una tarjeta:</label>
                    <select
                        id="numeroTarjeta"
                        value={numeroTarjeta}
                        onChange={handleSelectChange}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Seleccione una tarjeta</option>
                        {tarjetas.map((tarjeta, index) => (
                            <option key={index} value={tarjeta}>
                                {tarjeta}
                            </option>
                        ))}
                    </select>
                </div>
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
                    <p className="text-gray-500">No hay movimientos disponibles para esta tarjeta.</p>
                )}
            </ul>
        </>
    );
};

export default Movimientos;
