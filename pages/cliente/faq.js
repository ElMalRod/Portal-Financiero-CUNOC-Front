import React, { useEffect, useState } from 'react';
import Topbar from '../topbar';
import Sidebar from '../sidebar';

const Faq = () => {
    const [faqs, setFaqs] = useState([]);

    // Fetch FAQs from the API when the component mounts
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`);
                const data = await response.json();
                setFaqs(data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div>
            <Topbar />
            <Sidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4 text-[#5E17EB]">Preguntas Frecuentes (FAQ)</h1>
                
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
                            <h2 className="font-semibold text-lg">{faq.pregunta}</h2>
                            <p className="mt-2 text-gray-700">{faq.respuesta}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-4 border-t border-gray-300 text-center">
                    <h3 className="font-bold">¿Tienes más preguntas?</h3>
                    <p className="mt-2">Puedes contactar a nuestro soporte en:</p>
                    <a href="mailto:portalbancariocunoc@gmail.com" className="text-blue-600 underline">
                        portalbancariocunoc@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Faq;
