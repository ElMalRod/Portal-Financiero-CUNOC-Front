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
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border-b">{usuario.numero_tarjeta}</td>
                                        <td className="py-2 px-4 border-b">{usuario.nombre_usuario}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-4 px-4 text-center">
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
