import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Cambio = () => {

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                Tipo de cambio
            </div>
        </div>
    );
};

export default Cambio;
