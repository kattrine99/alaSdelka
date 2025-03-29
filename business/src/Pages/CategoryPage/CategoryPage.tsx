import { useParams } from "react-router-dom";
import { useState } from "react";
import { Breadcrumbs, CardSection, Header, Pagination } from "../../components";
import { ICard } from "../../components/Cards/Cards";
import { TempBusinessCardsMock } from "../../utils/TempBusinessCardsMock";
import { urlToTypeMap, typeToTitleMap } from "../../utils/categoryMap";
import { Footer } from "../../components/Footer/Footer";
// import { PopularSliderSection } from "../../components/PopularSection/PopularSliderSection";

export const CategoryPage = () => {
    const { category } = useParams();
    const type = urlToTypeMap[category || ""] as ICard["type"];
    const pageTitle = typeToTitleMap[type] || "Категория";

    const [selectedCity, setSelectedCity] = useState("");
    const [onlyPopular] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;

    const filteredCards = TempBusinessCardsMock
        .filter((card) => card.type.toLowerCase() === type.toLowerCase())
        .filter((card) => (selectedCity ? card.city === selectedCity : true))
        .filter((card) => (onlyPopular ? card.popular : true));

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <div className="mt-[30px] px-[192px]">
                <Breadcrumbs current={pageTitle} />
            </div>
            <div className="flex pt-[100px] px-[192px] pb-10 gap-10 items-start">

                <aside className="w-[280px] space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Город</h3>
                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            value={selectedCity}
                            onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setCurrentPage(1); // сбрасываем страницу при фильтрации
                            }}
                        >
                            <option value="">Все</option>
                            <option value="Ташкент">Ташкент</option>
                            <option value="Самарканд">Самарканд</option>
                            <option value="Бухара">Бухара</option>
                        </select>
                    </div>
                </aside>

                <main className="flex-1">
                    <CardSection
                        Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 transition duration-600"
                        title={pageTitle}
                        cards={paginatedCards as ICard[]}
                        to={`/${category}`}
                        hideViewAllButton
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                    {/* <PopularSliderSection cards={TempBusinessCardsMock as ICard[]} /> */}
                </main>

            </div>
            <Footer />
        </div>
    );
};
