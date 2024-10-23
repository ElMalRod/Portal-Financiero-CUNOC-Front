import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Zona = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState('gold');
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [notify, setNotify] = useState(true);
    const [rol, setRol] = useState('admin');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [pin, setPin] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); 

    const generarNumeroTarjeta = () => {
        let numero = '';
        for (let i = 0; i < 16; i++) {
            numero += Math.floor(Math.random() * 10); 
        }
        return numero;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tarjetaGenerada = generarNumeroTarjeta();
        setNumeroTarjeta(tarjetaGenerada); 

        const datos = {
            nombre_usuario: nombreUsuario,
            tipo_cuenta: tipoCuenta,
            numero_tarjeta: tarjetaGenerada,
            notify,
            rol,
        };

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
            setPin(result.pin); 
            setError('');
        } catch (error) {
            setError(error.message);
            setMensaje('');
            setPin(null); 
        }
    };

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

                {modalVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Crear Cuenta</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block mb-2">Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        value={nombreUsuario}
                                        onChange={(e) => setNombreUsuario(e.target.value)}
                                        className="border rounded p-2 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Tipo de Cuenta</label>
                                    <select
                                        value={tipoCuenta}
                                        onChange={(e) => setTipoCuenta(e.target.value)}
                                        className="border rounded p-2 w-full"
                                    >
                                        <option value="gold">Gold</option>
                                        <option value="normal">Normal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2">Número de Tarjeta</label>
                                    <input
                                        type="text"
                                        defaultValue={numeroTarjeta}
                                        placeholder='Si esta vacío creará un número automáticamente'
                                        className="border rounded p-2 w-full bg-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Notificaciones</label>
                                    <input
                                        type="checkbox"
                                        checked={notify}
                                        onChange={() => setNotify(!notify)}
                                    />
                                    <span className="ml-2">Recibir notificaciones</span>
                                </div>
                                <div>
                                    <label className="block mb-2">Rol</label>
                                    <select
                                        value={rol}
                                        onChange={(e) => setRol(e.target.value)}
                                        className="border rounded p-2 w-full"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="cliente">Cliente</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded"
                                >
                                    Crear Cuenta
                                </button>
                            </form>

                            {mensaje && <div className="text-green-500 mt-4">{mensaje}</div>}
                            {pin && <div className="mt-2"><strong>PIN:</strong> {pin}</div>}
                            {error && <div className="text-red-500 mt-4">{error}</div>}

                            <button
                                onClick={() => {
                                    setModalVisible(false);
                                    window.location.reload(); 
                                }}
                                className="mt-4 bg-red-500 text-white p-2 rounded"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}

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
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <svg class="w-6 h-6 text-blue-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </a>
                                    </td>
                                    <td class="px-6 py-4">
                                        <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                            <svg class="w-6 h-6 text-red-600 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
