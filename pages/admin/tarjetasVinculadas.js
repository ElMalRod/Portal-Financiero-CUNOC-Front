import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const TarjetasVinculadas = () => {
    const [usuarios, setUsuarios] = useState([]);

    // Fetch para obtener los usuarios vinculados desde la API
    const fetchUsuariosVinculados = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saldo/obtener-vinculadas`);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saldo/desvincular-tarjeta`, {
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
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Usuarios Vinculados</h1>

                {/* Tabla de Usuarios Vinculados */}
                <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Número de Tarjeta</th>
                                <th className="px-6 py-3">Nombre del Usuario</th>
                                <th className="px-6 py-3">Correo</th>
                                <th className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{usuario.numero_tarjeta}</td>
                                        <td className="px-6 py-4">{usuario.nombre_usuario}</td>
                                        <td className="px-6 py-4">{usuario.correo}</td>
                                        <td className="px-6 py-4">
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
