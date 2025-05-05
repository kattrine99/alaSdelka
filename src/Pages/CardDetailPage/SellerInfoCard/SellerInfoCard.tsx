import { useState, useEffect } from "react";
import { ModalBase, Button, Paragraph } from "../../../components";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { OfferDetail } from "../../../Store/api/types";
import { Link } from "react-router-dom";

export const SellerInfoCard = ({ card, offer_type, userId }: { card: OfferDetail, userId: number, offer_type?: string }) => {
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [isLinksModalOpen, setLinksModalOpen] = useState(false);
    const [isFavorite, setFavorite] = useState(false);


    useEffect(() => {
        console.log("userId from URL:", userId); // Для отладки
        console.log("category from URL:", offer_type); // Для отладки
    }, [userId, offer_type]);

    return (
        <div className="lg:w-113 w-full h-full p-4 rounded-md shadow-md shadow-[#2EAA7B2E] flex flex-col gap-4 relative">
            <button
                onClick={() => setFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-1 border rounded-full border-green-500 text-green-500"
            >
                {isFavorite ? (
                    <BiSolidHeart className="w-5 h-5 text-red-500" />
                ) : (
                    <BiHeart className="w-5 h-5" />
                )}
            </button>
            <Paragraph className="text-[22px] font-bold text-[#101828] text-left">
                {card.data.price?.toLocaleString()} сум
            </Paragraph>
            <div className="flex items-center bg-[#E9F7F1] rounded-md p-3 gap-3">
                <Link to={`/users/${userId}/offers`} className="flex gap-5 items-center">
                    <div className="rounded-full">
                        <img
                            src={`${card.data.user_photo || "../../../../images/profile.png"}`}
                            className="w-10 h-10"
                            alt="User photo"
                        />
                    </div>
                    <Paragraph className="text-[#101828] font-semibold">
                        {card.data.user_name || "Имя продавца"}
                    </Paragraph>
                </Link>
            </div>
            <Button
                className="w-full bg-[#2EAA7B] text-white font-semibold py-2 rounded-md hover:bg-[#31B683] transition"
                onClick={() => setContactModalOpen(true)}
            >
                Контакты продавца
            </Button>
            <Button
                className="w-full bg-[#E9F7F1] text-[#2EAA7B] font-semibold py-2 rounded-md hover:bg-[#d1f0e3] transition"
                onClick={() => setLinksModalOpen(true)}
            >
                Ссылки
            </Button>

            {isContactModalOpen && (
                <ModalBase
                    title="Контакты продавца"
                    message={card.data.user_phone || "Номер не указан"}
                    onClose={() => setContactModalOpen(false)}
                    showCloseButton={true}
                />
            )}

            {isLinksModalOpen && (
                <ModalBase
                    title="Ссылки"
                    message={
                        card.data.communication_channels?.length ? (
                            <div className="flex flex-col gap-2">
                                {card.data.communication_channels.map((channel, idx) => (
                                    <a
                                        key={idx}
                                        href={channel.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#2EAA7B] underline"
                                    >
                                        {channel.channel_name}
                                    </a>
                                ))}
                            </div>
                        ) : (
                            "Ссылки отсутствуют"
                        )
                    }
                    onClose={() => setLinksModalOpen(false)}
                    showCloseButton={true}
                />
            )}
        </div>
    );
};
