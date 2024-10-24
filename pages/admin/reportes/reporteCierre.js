import React, { useEffect, useState } from 'react';
import Topbar from '../../topbar';
import Sidebar from '../../sidebar';

const ReporteCierre = () => {

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                Reporte de Cierre
            </div>
        </div>
    );
};

export default ReporteCierre;
