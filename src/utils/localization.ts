/**
 * Вспомогательная функция для получения локализованного значения из API данных
 * @param item - объект с полями title_ru, title_uz (и опционально title_en)
 * @param lang - текущий язык
 * @param field - название поля (например, 'title', 'name', 'label')
 * @returns локализованное значение
 */
export function getLocalizedValue<T extends Record<string, any>>(
    item: T | null | undefined,
    lang: "ru" | "uz" | "en",
    field: string = "title"
): string {
    if (!item) return "";

    const ruField = `${field}_ru` as keyof T;
    const uzField = `${field}_uz` as keyof T;
    const enField = `${field}_en` as keyof T;

    if (lang === "uz" && item[uzField]) {
        return String(item[uzField]);
    } else if (lang === "en") {
        // Если есть английское поле, используем его, иначе используем русское как fallback
        if (item[enField]) {
            return String(item[enField]);
        }
        return String(item[ruField] || "");
    } else {
        // Для русского языка
        return String(item[ruField] || "");
    }
}

