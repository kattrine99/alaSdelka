import { useParams } from 'react-router-dom';
import { TempBusinessCardsMock } from '../../utils/TempBusinessCardsMock';
import { Breadcrumbs, Footer, Header } from '../../components/index';
import { useEffect, useState } from 'react';

export const CardDetailPage = () => {
    const { id, category } = useParams();
    const [card, setCard] = useState(() => TempBusinessCardsMock.find(c => c.id === Number(id)));

    useEffect(() => {
        setCard(TempBusinessCardsMock.find(c => c.id === Number(id)));
    }, [id]);

    if (!card) {
        return <div className="p-6">Карточка не найдена</div>;
    }

    return (
        <div className="w-screen">
            <Header />
            <div>
                <Breadcrumbs category={category} title={card.title} />
                <h1 className="text-2xl font-bold mb-2">{card.title}</h1>
                <p className="text-gray-500 mb-4">ID {card.id}</p>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <img src={card.image} alt={card.title} className="w-full h-96 object-cover rounded-md border mb-4" />
                        <p className="text-xl font-semibold mb-2">{card.price}</p>
                        <p className="mb-1">📍 Адрес: <strong>{card.address}</strong></p>
                        <p className="mb-4">📐 Площадь: {card.area}</p>
                    </div>

                    <div className="lg:w-80 w-full p-4 border rounded-md shadow-sm">
                        <p className="text-lg mb-2 font-semibold text-gray-800 text-right">{card.price}</p>
                        <button className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 mb-2">
                            Контакты продавца
                        </button>
                        <button className="w-full bg-gray-100 text-green-700 font-medium py-2 rounded-md hover:bg-gray-200">
                            Ссылки
                        </button>
                    </div>
                </div>
            </div>
            <Footer showSmallFooter={true} />
        </div>
    );
};
