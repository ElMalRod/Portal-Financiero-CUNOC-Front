import React, { useState, useEffect } from 'react';

const Topbar = () => {
    const [userName, setUserName] = useState('');

    // Obtener el nombre del usuario desde el localStorage cuando el componente se monta
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserName(parsedUser.usuario.nombre);
        }
    }, []);

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.clear(); // Borra todo el localStorage
        window.location.href = '/'; // Redirige a la página de inicio de sesión (ajusta la ruta si es necesario)
    };

    return (
        <>
            <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Portal Financiero</span>
                    </a>
                    <div className="flex items-center md:space-x-8">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="h-[42px] w-[42px] shrink-0 rounded-full">
                                <img src="https://picsum.photos/700/800" className="h-full w-full rounded-full object-cover" alt="User" />
                            </div>
                            <span className="text-gray-900 dark:text-white hidden md:inline">{userName}</span>
                        </div>
                        <button onClick={handleLogout} className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-[#5E17EB] dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            <svg className="w-6 h-6 text-[#5E17EB] dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                            </svg>
                            <span className="hidden md:inline ml-2">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Topbar;