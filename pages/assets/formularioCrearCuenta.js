import React, { useState, useEffect } from 'react';

const FormularioCrearCuenta = ({ onSubmit }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('gold');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [notify, setNotify] = useState(true);
  const [rol, setRol] = useState('cliente');
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);

  const generarNumeroTarjeta = () => {
    let numero = '';
    for (let i = 0; i < 16; i++) {
      numero += Math.floor(Math.random() * 10);
    }
    return numero;
  };

  useEffect(() => {
    const numeroGenerado = generarNumeroTarjeta();
    setNumeroTarjeta(numeroGenerado);
  }, []);

  const handleRolChange = (e) => {
    const nuevoRol = e.target.value;
    setMostrarAdvertencia(nuevoRol === 'admin');
    setRol(nuevoRol);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rol === 'admin' && !window.confirm('Estás a punto de crear un administrador, ¿estás seguro?')) {
      return;
    }

    const datos = {
      nombre_usuario: nombreUsuario,
      tipo_cuenta: tipoCuenta,
      numero_tarjeta: numeroTarjeta,
      notify,
      rol,
    };

    onSubmit(datos);
    setNombreUsuario('');  // Limpiar el campo después de enviar
    setTipoCuenta('gold');  // Restablecer tipo de cuenta a 'gold'
    setNumeroTarjeta(generarNumeroTarjeta()); // Generar un nuevo número de tarjeta
    setNotify(true);
    setRol('cliente');  // Restablecer rol a 'cliente'
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#5E17EB]">Crear Nueva Cuenta</h2>
        
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
            <option value="gold">Gold</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Número de Tarjeta</label>
          <input
            type="text"
            value={numeroTarjeta}
            readOnly
            className="border rounded p-2 w-full bg-gray-100"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notify}
            onChange={() => setNotify(!notify)}
            className="mr-2"
          />
          <label>Recibir notificaciones (notifyme)</label>
        </div>

        <div>
          <label className="block mb-2">Rol</label>
          <select
            value={rol}
            onChange={handleRolChange}
            className="border rounded p-2 w-full"
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
          {mostrarAdvertencia && (
            <p className="text-red-600 mt-2">¡Atención! Estás creando un administrador.</p>
          )}
        </div>

        <button type="submit" className="bg-[#5E17EB] text-white p-2 rounded w-full">
          Confirmar
        </button>
      </form>
    </div>
  );
};

export default FormularioCrearCuenta;
