import React, { useState, useEffect } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';
import Modal from '../assets/modal';
import FormularioCrearCuenta from '../assets/formularioCrearCuenta';
import TarjetaCredito from '../assets/tarjetaCredito'; 

const Zona = () => {
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [cuentaCreada, setCuentaCreada] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [correo, setCorreo] = useState(''); // Estado para el correo
    const [pin, setPin] = useState(''); // Estado para el PIN

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/usuarios');
            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleCrearCuenta = async (datos) => {
        try {
            const response = await fetch('http://localhost:3000/api/cuentas/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });

            if (!response.ok) {
                throw new Error('Error en la creación de cuenta');
            }

            const result = await response.json();
            setMensaje(result.message);
            setNumeroTarjeta(datos.numero_tarjeta);
            setCorreo(result.correo); // Asigna el correo del resultado
            setPin(result.pin); // Asigna el PIN del resultado
            setCuentaCreada(true);
            setError('');

            // Llama a fetchUsuarios para actualizar la tabla después de crear la cuenta
            fetchUsuarios();
        } catch (error) {
            setError(error.message);
            setMensaje('');
            setCuentaCreada(false);
        }
    };

    // Función para limpiar los estados de la tarjeta al cerrar el modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setNumeroTarjeta('');
        setCorreo('');
        setPin('');
        setCuentaCreada(false); 
    };

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
                <button
                    onClick={() => setModalVisible(true)}
                    className="bg-blue-500 text-white p-2 rounded mb-4"
                >
                    Crear Cuenta
                </button>

                <Modal isVisible={modalVisible} onClose={handleCloseModal}>
                    <h2 className="text-xl font-semibold mb-4">Crear Cuenta</h2>
                    <FormularioCrearCuenta onSubmit={handleCrearCuenta} />

                    {error && <div className="text-red-500 mt-4">{error}</div>}

                    {/* Muestra la tarjeta de crédito si la cuenta ha sido creada */}
                    {cuentaCreada && (
                        <TarjetaCredito
                            tipoCuenta={'Gold'} // Cambia esto según el tipo de cuenta real
                            nombreUsuario={usuarios.find(usuario => usuario.numero_tarjeta === numeroTarjeta)?.nombre_usuario || 'Desconocido'}
                            numeroTarjeta={numeroTarjeta}
                            correo={correo}
                            pin={pin}
                        />
                    )}
                </Modal>
                {/* Tabla de usuarios */}
                <div className=" overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Tipo de Cuenta</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                                <th scope="col" class="px-6 py-3"></th>
                                <th scope="col" class="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{usuario.nombre_usuario}</td>
                                    <td className="px-6 py-4">{usuario.tipo_cuenta || 'N/A'}</td>
                                    <td className="px-6 py-4">{usuario.estado || 'N/A'}</td>
                                    {/* boton Edit */}
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <svg class="w-6 h-6 text-blue-700 dark:text-purple" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </a>
                                    </td>
                                     {/* boton Eliminar */}
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <svg class="w-6 h-6 text-red-600 dark:text-red" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>

                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Zona;
