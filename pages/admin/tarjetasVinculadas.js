import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const TarjetasVinculadas = () => {
    const [usuarios, setUsuarios] = useState([]);

    // Fetch para obtener los usuarios vinculados desde la API
    const fetchUsuariosVinculados = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/saldo/obtener-vinculadas');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener usuarios vinculados:', error);
        }
    };

    // Función para manejar la desvinculación de una tarjeta
    const handleDesvincular = async (numeroTarjeta, nombreUsuario, correo) => {
        const confirmacion = window.confirm(`¿Seguro que quiere desvincular la tarjeta del usuario ${nombreUsuario}?`);
        if (!confirmacion) return;

        try {
            const response = await fetch('http://localhost:3000/api/saldo/desvincular-tarjeta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numeroTarjeta, nombreUsuario, correo }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchUsuariosVinculados(); // Actualiza la lista de usuarios vinculados
            } else {
                alert(data.error || 'Error al desvincular la tarjeta');
            }
        } catch (error) {
            console.error('Error al desvincular la tarjeta:', error);
            alert('Hubo un problema al intentar desvincular la tarjeta');
        }
    };

    // Fetch inicial
    useEffect(() => {
        fetchUsuariosVinculados();
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">Usuarios Vinculados</h1>

                {/* Tabla de Usuarios Vinculados */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">Número de Tarjeta</th>
                                <th className="py-2 px-4 border-b">Nombre del Usuario</th>
                                <th className="py-2 px-4 border-b">Correo</th>
                                <th className="py-2 px-4 border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border-b">{usuario.numero_tarjeta}</td>
                                        <td className="py-2 px-4 border-b">{usuario.nombre_usuario}</td>
                                        <td className="py-2 px-4 border-b">{usuario.correo}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                                                onClick={() => handleDesvincular(usuario.numero_tarjeta, usuario.nombre_usuario, usuario.correo)}
                                            >
                                                Desvincular
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-4 px-4 text-center">
                                        No hay usuarios vinculados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TarjetasVinculadas;
