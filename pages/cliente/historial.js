import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';
import Movimientos from '../movimientos';

const Historial = () => {

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <Movimientos/>
            </div>
        </div>
    );
};

export default Historial;
