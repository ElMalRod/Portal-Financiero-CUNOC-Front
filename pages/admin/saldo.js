import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Saldo = () => {

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                Reducir saldo
            </div>
        </div>
    );
};

export default Saldo;
