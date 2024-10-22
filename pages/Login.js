import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const [recordatorioMessage, setRecordatorioMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [correoRecordatorio, setCorreoRecordatorio] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/comentarios/ultimos-comentarios');
                if (!response.ok) {
                    throw new Error('Error al obtener comentarios');
                }
                const data = await response.json();
                setComentarios(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchComentarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, pin }),
            });

            if (!response.ok) {
                throw new Error('Error en la autenticación');
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            console.log('Datos almacenados en localStorage:', data);

            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRecordatorio = async () => {
        setError(null);
        setRecordatorioMessage(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/recordatorio-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: correoRecordatorio }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar recordatorio de PIN');
            }

            setRecordatorioMessage('Por favor, revisa tu bandeja de entrada para recuperar tu PIN.');
            setIsModalOpen(false); // Cierra el modal al enviar el correo
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <section className="bg-gray-50 dark:bg-gray-900 w-full md:w-1/2">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2" src="/images/1.png" alt="logo" />
                        Portal Financiero
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Inicia Sesión
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">PIN</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                    >
                                        ¿Olvidaste tu PIN?
                                    </button>
                                </div>
                                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Ingresar
                                </button>
                                {error && <p className="text-sm text-red-500">{error}</p>}
                                {recordatorioMessage && <p className="text-sm text-green-500">{recordatorioMessage}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Últimos Comentarios</h2>
                <ul className="space-y-4">
                    {comentarios.length > 0 ? (
                        comentarios.map((comentario, index) => (
                            <li key={index} className="border p-4 rounded-md shadow-sm">
                                <p className="font-semibold text-gray-800">{comentario.nombre_usuario}</p>
                                <p className="text-gray-700">{comentario.comentario}</p>
                                <p className="text-sm text-gray-500">{new Date(comentario.fecha_comentario).toLocaleString()}</p>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay comentarios disponibles.</p>
                    )}
                </ul>
            </section>

            {/* Modal para enviar recordatorio de PIN */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Recuperar PIN</h2>
                        <label htmlFor="recordatorioEmail" className="block mb-2 text-sm font-medium text-gray-900">Ingresa tu correo</label>
                        <input
                            type="email"
                            id="recordatorioEmail"
                            value={correoRecordatorio}
                            onChange={(e) => setCorreoRecordatorio(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                            placeholder="name@company.com"
                            required
                        />
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleRecordatorio}
                                className={`bg-blue-600 text-white rounded-lg px-4 py-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
