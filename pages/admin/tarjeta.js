import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Tarjeta = () => {

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                Habilitar/Deshabilitar tarjeta
            </div>
        </div>
    );
};

export default Tarjeta;
