import React, { useState, useEffect } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';
import Modal from '../assets/modal';
import FormularioCrearCuenta from '../assets/formularioCrearCuenta';
import TarjetaCredito from '../assets/tarjetaCredito';

const Zona = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [modalVisibleCrear, setModalVisibleCrear] = useState(false); // Modal para crear cuenta
    const [modalVisibleModificar, setModalVisibleModificar] = useState(false); // Modal para modificar usuario
    const [cuentaCreada, setCuentaCreada] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Usuario a modificar
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [correo, setCorreo] = useState('');

    const [modalVisibleEliminar, setModalVisibleEliminar] = useState(false);
    const [motivoCierre, setMotivoCierre] = useState('');

    // Estados para modificar usuario
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState('');
    const [pin, setPin] = useState('');
    const [notifyme, setNotifyme] = useState(false);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/usuarios`);
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

    // para crear una nueva cuenta
    const handleCrearCuenta = async (datos) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cuentas/crear`, {
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
            setCorreo(result.correo);
            setPin(result.pin);
            setCuentaCreada(true);
            setError('');

            // llama a fetchUsuarios para actualizar la tabla después de crear la cuenta
            fetchUsuarios();
        } catch (error) {
            setError(error.message);
            setMensaje('');
            setCuentaCreada(false);
        }
    };

    // para limpiar los estados al cerrar el modal de crear cuenta
    const handleCloseModalCrear = () => {
        setModalVisibleCrear(false);
        setCuentaCreada(false);
    };

    // para abrir el modal de editar usuario
    const handleEditarUsuario = async (id_usuario) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/usuarios/${id_usuario}`);
            if (!response.ok) {
                throw new Error('Error al obtener usuario');
            }
            const usuario = await response.json();
            setUsuarioSeleccionado(usuario);

            // Establece los valores del usuario en los campos del modal
            setNombreUsuario(usuario.nombre_usuario);
            setTipoCuenta(usuario.tipo_cuenta === 'gold' ? '2' : '1');
            setPin(usuario.pin);
            setNotifyme(usuario.notifyme);
            setModalVisibleModificar(true);
        } catch (error) {
            console.error(error);
        }
    };

    // para enviar los datos modificados
    const handleModificarUsuario = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cuentas/modificar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: usuarioSeleccionado.id_usuario,
                    nombre_usuario: nombreUsuario,
                    id_tipo_cuenta: tipoCuenta,
                    pin: pin,
                    notifyme: notifyme,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al modificar usuario');
            }

            const result = await response.json();
            console.log(result.message); // Mostrar mensaje de éxito

            // Actualiza la lista de usuarios
            fetchUsuarios();
            setModalVisibleModificar(false);
        } catch (error) {
            console.error(error);
        }
    };
    // para abrir el modal de eliminar usuario
    const handleEliminarUsuario = (id_usuario) => {
        setUsuarioSeleccionado(id_usuario); // Establece el usuario que se va a eliminar
        setModalVisibleEliminar(true);
    };

    // para eliminar un usuario
    const handleConfirmarEliminar = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cuentas/eliminar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: usuarioSeleccionado,
                    motivo_cierre: motivoCierre,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            const result = await response.json();
            console.log(result.message);

            fetchUsuarios();
            setModalVisibleEliminar(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Topbar />
            <Sidebar />

            <div className="p-4 sm:ml-64">
                <h2 className="text-2xl font-bold mb-4 text-[#5E17EB]">Lista de Usuarios</h2>

                {/* Botón para abrir modal de crear cuenta */}
                <button
                    onClick={() => setModalVisibleCrear(true)}
                    className="bg-[#5E17EB] text-white p-2 rounded mb-4"
                >
                    Crear Cuenta
                </button>

                {/* Modal para crear cuenta */}
                <Modal isVisible={modalVisibleCrear} onClose={handleCloseModalCrear}>
                    <h2 className="text-xl font-semibold mb-4">Crear Cuenta</h2>
                    <FormularioCrearCuenta onSubmit={handleCrearCuenta} />

                    {error && <div className="text-red-500 mt-4">{error}</div>}

                    {/* Mostrar mensaje de éxito al crear cuenta */}
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
                <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Usuario</th>
                                <th className="px-6 py-3">Tipo de Cuenta</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3"></th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{usuario.nombre_usuario}</td>
                                    <td className="px-6 py-4">{usuario.tipo_cuenta || 'N/A'}</td>
                                    <td className="px-6 py-4">{usuario.estado || 'N/A'}</td>
                                    {/* boton Edit */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleEditarUsuario(usuario.id_usuario)}
                                            className="font-medium text-blue-600 dark:text-[#5E17EB] hover:underline"
                                        >
                                            <svg class="w-6 h-6 text-blue-700 dark:text-purple" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </button>
                                    </td>
                                    {/* boton Eliminar */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleEliminarUsuario(usuario.id_usuario)}
                                            className="ml-4 font-medium text-red-600 dark:text-red-500 hover:underline"
                                        >
                                            <svg class="w-6 h-6 text-red-600 dark:text-red" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para modificar usuario */}
            {modalVisibleModificar && (
                <Modal isVisible={modalVisibleModificar} onClose={() => setModalVisibleModificar(false)}>
                    <h2 className="text-xl font-semibold mb-4">Modificar Usuario</h2>
                    <form>
                        <label className="block mb-2">Nombre Usuario:</label>
                        <input
                            type="text"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />

                        <label className="block mb-2">Tipo de Cuenta:</label>
                        <select
                            value={tipoCuenta}
                            onChange={(e) => setTipoCuenta(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        >
                            <option value="1">Normal</option>
                            <option value="2">Gold</option>
                        </select>

                        <label className="block mb-2">PIN:</label>
                        <input
                            type="text"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="border p-2 mb-4 w-full"
                        />

                        <label className="block mb-2">Recibir notificaciones (notifyme)</label>
                        <input
                            type="checkbox"
                            checked={notifyme}
                            onChange={(e) => setNotifyme(e.target.checked)}
                            className="border p-2"
                        />

                        <button
                            type="button"
                            onClick={handleModificarUsuario}
                            className="bg-[#5E17EB] text-white p-2 w-full mt-8 rounded"
                        >
                            Guardar
                        </button>
                    </form>
                </Modal>
            )}

            {/* Modal para eliminar usuario */}
            {modalVisibleEliminar && (
                <Modal isVisible={modalVisibleEliminar} onClose={() => setModalVisibleEliminar(false)}>
                    <h2 className="text-xl font-semibold mb-4">Eliminar Usuario</h2>
                    <p>¿Estás seguro de que quieres eliminar este usuario?</p>

                    <label className="block mb-2 mt-4">Motivo de Cierre:</label>
                    <textarea
                        value={motivoCierre}
                        onChange={(e) => setMotivoCierre(e.target.value)}
                        className="border p-2 mb-4 w-full"
                    />

                    <div className="flex justify-end">
                        <button
                            onClick={handleConfirmarEliminar}
                            className="bg-red-500 text-white p-2 rounded mr-2"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => setModalVisibleEliminar(false)}
                            className="bg-gray-300 text-black p-2 rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Zona;
