// components/MetaTags.tsx
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MetaTagsProps {
    title: string;
    description: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
    noindex?: boolean;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    canonical,
    noindex = false,
}) => {
    const location = useLocation(); // Gives you current path, e.g. "/about"
    const { i18n } = useTranslation(); // Gives you current locale, e.g. "ru" or "uz"

    const baseUrl = 'https://invin.uz';
    // Для русского языка (по умолчанию) URL без префикса
    const currentUrl =
        i18n.language === "ru"
            ? `${baseUrl}${location.pathname}`
            : `${baseUrl}/uz${location.pathname}`;

    return (
        <div>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Canonical */}
            <link rel="canonical" href={canonical || currentUrl} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={ogTitle || title} />
            <meta property="og:description" content={ogDescription || description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="Invest In" />
            <meta property="og:locale" content={i18n.language === 'uz' ? 'uz_UZ' : 'ru_RU'} />
            {ogImage && <meta property="og:image" content={`${baseUrl}${ogImage}`} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || title} />
            <meta name="twitter:description" content={ogDescription || description} />
            {ogImage && <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />}

            {/* hreflang Tags */}
            <link
                rel="alternate"
                hrefLang="ru"
                href={`${baseUrl}${location.pathname}`}
            />
            <link
                rel="alternate"
                hrefLang="uz"
                href={`${baseUrl}/uz${location.pathname}`}
            />
            <link
                rel="alternate"
                hrefLang="x-default"
                href={`${baseUrl}${location.pathname}`}
            />
        </div>
    );
};