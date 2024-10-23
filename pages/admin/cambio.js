import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Cambio = () => {
    const [tipoCambio, setTipoCambio] = useState({ valor_cambio: '', fecha_cambio: '' });
    const [nuevoValor, setNuevoValor] = useState('');
    const [montoDolares, setMontoDolares] = useState('');
    const [montoQuetzales, setMontoQuetzales] = useState('');

    // Obtener tipo de cambio
    const fetchTipoCambio = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tipo-cambio');
            const data = await response.json();
            setTipoCambio(data);
        } catch (error) {
            console.error('Error al obtener el tipo de cambio:', error);
        }
    };

    // Actualizar tipo de cambio
    const actualizarTipoCambio = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tipo-cambio', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nuevoValor }),
            });

            if (response.ok) {
                fetchTipoCambio(); // Refrescar el tipo de cambio
                setNuevoValor(''); // Limpiar el input
            } else {
                console.error('Error al actualizar el tipo de cambio');
            }
        } catch (error) {
            console.error('Error en la actualización:', error);
        }
    };

    // Calcular el monto en quetzales
    const calcularCambio = () => {
        if (montoDolares && tipoCambio.valor_cambio) {
            const valorEnQuetzales = (montoDolares * tipoCambio.valor_cambio).toFixed(2);
            setMontoQuetzales(valorEnQuetzales);
        } else {
            setMontoQuetzales('');
        }
    };

    useEffect(() => {
        fetchTipoCambio();
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">Tipo de Cambio</h1>
                <div className="mb-4">
                    <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
                        {/* Icono de Dólar */}
                        <svg class="w-[24px] h-[24px] text-gray-800 dark:text-green" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                        </svg>

                        <div>
                            <p className="text-lg font-semibold">Valor: {tipoCambio.valor_cambio}</p>
                            <p className="text-sm text-gray-600">Fecha de cambio: {new Date(tipoCambio.fecha_cambio).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="number"
                        placeholder="Nuevo Valor"
                        value={nuevoValor}
                        onChange={(e) => setNuevoValor(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        onClick={actualizarTipoCambio}
                        className="flex items-center bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                    >
                        {/* Icono de Lápiz */}
                        <svg class="w-[24px] h-[24px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                        </svg>

                        Actualizar
                    </button>
                </div>
                <h2 className="text-lg font-semibold mb-2">Convertidor de Cambio</h2>
                <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow mb-4">
                    <img src="/images/TipoCambio.png" alt="Tipo de Cambio" className="h-48 w-48 mx-auto mb-4" />
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="relative w-full">
                            <input
                                type="number"
                                placeholder="Monto en Dólares"
                                value={montoDolares}
                                onChange={(e) => {
                                    setMontoDolares(e.target.value);
                                    calcularCambio(); // Calcular cambio al ingresar monto
                                }}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full pr-10" // Añadido pr-10 para espacio del ícono
                            />
                        </div>
                        <button
                            onClick={calcularCambio}
                            className="flex items-center bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                        >
                            Convertir
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="relative w-full">
                            <input
                                type="number"
                                placeholder="Monto en Quetzales"
                                value={montoQuetzales}
                                onChange={(e) => {
                                    setMontoQuetzales(e.target.value);
                                    if (tipoCambio.valor_cambio) {
                                        const valorEnDolares = (e.target.value / tipoCambio.valor_cambio).toFixed(2);
                                        setMontoDolares(valorEnDolares);
                                    } else {
                                        setMontoDolares('');
                                    }
                                }}
                                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full pr-10" // Añadido pr-10 para espacio del ícono
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (montoQuetzales && tipoCambio.valor_cambio) {
                                    const valorEnDolares = (montoQuetzales / tipoCambio.valor_cambio).toFixed(2);
                                    setMontoDolares(valorEnDolares);
                                }
                            }}
                            className="flex items-center bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
                        >
                            Convertir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cambio;
