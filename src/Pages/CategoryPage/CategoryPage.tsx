import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    Breadcrumbs,
    CardSection,
    Header,
    Pagination,
    PopularSliderSection,
    Footer,
    Heading,
    Button,
    Input,
    Paragraph,
    Filters
} from "../../components";
import { ICard } from "../../components/Cards/Interfaces";
import { TempBusinessCardsMock } from "../../utils/TempBusinessCardsMock";
import { typeToTitleMap } from "../../utils/categoryMap";
import { FiSearch } from "react-icons/fi";
import { FiltersState } from "../../utils/variables";

export const CategoryPage = () => {
    const { category } = useParams();

    const [filters, setFilters] = useState<FiltersState>({
        category: "",
        city: "",
        stage: "",
        priceMin: "",
        priceMax: "",
        investmentMin: "",
        investmentMax: "",
        profitabilityMin: "",
        profitabilityMax: ""
    });


    const type = category ?? "";
    const pageTitle = typeToTitleMap[type as ICard["type"]] ?? "Категория";
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredCards = TempBusinessCardsMock
        .filter((card) => card.type === type)
        .filter((card) => (filters.city ? card.city === filters.city : true))
        .filter((card) => (filters.category ? card.category === filters.category : true));

    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="font-openSans min-h-screen w-screen overflow-x-hidden">
            <Header />
            <div className="flex px-[192px] py-[30px] pb-10 gap-10 items-start">
                <aside className="flex flex-col mr-[60px]">
                    <Breadcrumbs category={type} title={""} />
                    <Heading text={pageTitle} level={2} className="text-[30px] font-bold text-black" />
                    <Paragraph className="text-[#787878] font-inter font-medium text-[14px] mt-3.5">
                        {filteredCards.length.toLocaleString("ru-RU")} объявлений
                    </Paragraph>

                    {type && <Filters category={type as ICard["type"]} filters={filters} setFilters={setFilters} />}
                </aside>

                <main className="flex-1 justify-end">
                    <div className="flex justify-end gap-x-4">
                        <Button className="px-5 py-3 bg-[#31B683] text-white rounded-[6px]">Добавить объявление</Button>
                        <div className="flex items-center border border-[#2EAA7B] rounded-xl pl-5 w-[450px] bg-white overflow-hidden">
                            <div className="text-[#2EAA7B]">
                                <FiSearch className="w-[24px] h-[24px]" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Поиск по названию или ID"
                                isError={false}
                                className="flex-1 w-full px-2.5 text-[#787878] placeholder-[#787878] bg-white outline-none"
                            />
                            <Button className="h-full bg-[#2EAA7B] text-white text-sm font-semibold px-5 hover:bg-green-600 transition rounded-none">
                                Поиск
                            </Button>
                        </div>
                    </div>

                    <CardSection
                        Class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 transition duration-600"
                        title={pageTitle}
                        ClassName="py-[39px]"
                        cards={paginatedCards as ICard[]}
                        hideViewAllButton
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </main>
            </div>
            <PopularSliderSection cards={TempBusinessCardsMock as ICard[]} />
            <Footer showSmallFooter={true} />
        </div>
    );
};
