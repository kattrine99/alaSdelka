import React, { createContext, useContext, useEffect, useState } from "react";

interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  content_top?: string;
  content_bottom?: string;
}

interface SeoData {
  seo: {
    home: PageSeo;
    business: PageSeo;
    franchise: PageSeo;
    investments: PageSeo;
    startups: PageSeo;
    google_analytics_id?: string;
    yandex_metrika_id?: string;
  };
}

const SeoContext = createContext<SeoData | null>(null);

export const SeoProvider: React.FC = ({ children }) => {
    const [seoData, setSeoData] = useState<SeoData | null>(null);

    useEffect(() => {

    }, [locale]);
}