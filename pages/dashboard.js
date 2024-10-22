import React, { useEffect, useState } from 'react';
import Topbar from './topbar';
import Sidebar from './sidebar';
import Movimientos from './movimientos';

const Dashboard = () => {
    const [isCliente, setIsCliente] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.usuario && user.usuario.rol === 'cliente') 
        {
            setIsCliente(true);
        }

        if (user && user.usuario && user.usuario.rol === 'admin') 
        {
            setIsAdmin(true);
        }
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    {isCliente ? (
                        <Movimientos />
                    ) : (
                        <p className="text-gray-500"></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
