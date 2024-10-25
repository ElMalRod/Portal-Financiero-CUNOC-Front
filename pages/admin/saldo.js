import React, { useEffect, useState } from 'react'; 
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Saldo = () => {
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [cliente, setCliente] = useState(null);
    const [monto, setMonto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [contador, setContador] = useState(0); // Estado para el contador

    // Función para buscar el cliente por número de tarjeta
    const buscarCliente = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/reportes/detalle-cuenta/${numeroTarjeta}`);
            const data = await response.json();
            if (data.length > 0) {
                setCliente(data[0]);
                setMensaje(''); // Limpiar el mensaje al buscar el cliente
            } else {
                setCliente(null);
                setMensaje('No se encontró información para esta tarjeta.');
            }
        } catch (error) {
            console.error('Error al buscar el cliente:', error);
        }
    };

    // Función para reducir el saldo del cliente
    const reducirSaldo = async () => {
        // Asegúrate de que el monto no sea vacío y sea un número válido
        if (!monto || parseFloat(monto) <= 0) {
            setMensaje('Por favor, ingresa un monto válido.');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/saldo/agregar-saldo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    numeroTarjeta: cliente.numero_tarjeta,
                    monto: Math.abs(parseFloat(monto)), 
                }),
            });
            
            const result = await response.json();
            setMensaje(result.message);

            // Actualizar el saldo del cliente después de la transacción
            setCliente((prev) => ({
                ...prev,
                saldo_actual: (parseFloat(prev.saldo_actual) - Math.abs(parseFloat(monto))).toFixed(2)
            }));

            // Iniciar cuenta regresiva
            let countdown = 3;
            setContador(countdown);
            const interval = setInterval(() => {
                countdown -= 1;
                setContador(countdown);
                if (countdown <= 0) {
                    clearInterval(interval);
                    // Limpiar datos del formulario y mensaje
                    setNumeroTarjeta('');
                    setMonto('');
                    setCliente(null);
                    setMensaje('');
                    setContador(0); // Resetear contador
                }
            }, 1000);
        } catch (error) {
            console.error('Error al actualizar el saldo:', error);
        }
    };

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">Reducir Saldo del Cliente</h1>
                
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Número de Tarjeta</label>
                    <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <button
                        onClick={buscarCliente}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                        Buscar Cliente
                    </button>
                </div>

                {cliente && (
                    <form className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    value={cliente.nombre_usuario}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Número de Tarjeta</label>
                                <input
                                    type="text"
                                    value={cliente.numero_tarjeta}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Fecha de Creación</label>
                                <input
                                    type="text"
                                    value={new Date(cliente.fecha_creacion).toLocaleString('es-ES')}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Saldo Actual</label>
                                <input
                                    type="text"
                                    value={cliente.saldo_actual}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Limite de Crédito</label>
                                <input
                                    type="text"
                                    value={cliente.limite_credito}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Monto a Reducir</label>
                            <input
                                type="number"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full"
                            />
                            <button
                                type="button"
                                onClick={reducirSaldo}
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                            >
                                Reducir Saldo
                            </button>
                        </div>
                    </form>
                )}

                {mensaje && (
                    <div className={`mt-4 p-2 rounded-md ${mensaje.includes('no encontrado') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {mensaje}
                    </div>
                )}

                {contador > 0 && <div className="mt-4 text-lg">Limpiando en {contador}...</div>} {/* Mostrar el contador */}
            </div>
        </div>
    );
};

export default Saldo;
