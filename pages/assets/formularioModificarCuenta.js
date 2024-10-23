import React, { useState, useEffect } from 'react';

const FormularioModificarCuenta = ({ onSubmit, usuario }) => {
    const [nombreUsuario, setNombreUsuario] = useState(usuario.nombre_usuario);
    const [tipoCuenta, setTipoCuenta] = useState(usuario.tipo_cuenta);
    const [pin, setPin] = useState(usuario.pin);
    const [notify, setNotify] = useState(usuario.notifyme === 1); // Convierte a booleano

    useEffect(() => {
        setNombreUsuario(usuario.nombre_usuario);
        setTipoCuenta(usuario.tipo_cuenta);
        setPin(usuario.pin);
        setNotify(usuario.notifyme === 1);
    }, [usuario]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const datos = {
            id_usuario: usuario.id_usuario, // Asegúrate de enviar el ID de usuario
            nombre_usuario: nombreUsuario,
            id_tipo_cuenta: tipoCuenta === 'normal' ? 1 : 2, // Supón que 1 es normal y 2 es gold
            pin: pin,
            notifyme: notify,
        };
        onSubmit(datos);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Modificar Cuenta</h2>

            <div>
                <label className="block mb-2">Nombre de Usuario</label>
                <input
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Ingresa tu nombre"
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
                    <option value="normal">Normal</option>
                    <option value="gold">Gold</option>
                </select>
            </div>

            <div>
                <label className="block mb-2">PIN</label>
                <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="border rounded p-2 w-full"
                    placeholder="Ingresa el PIN"
                    required
                />
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={notify}
                    onChange={() => setNotify(!notify)}
                    className="mr-2"
                />
                <label>Notificarme</label>
            </div>

            <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
                Modificar Cuenta
            </button>
        </form>
    );
};

export default FormularioModificarCuenta;
