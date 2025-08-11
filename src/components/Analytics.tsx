import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

// components/Analytics.tsx
export const Analytics: React.FC = () => {
  const siteSettings = useSelector((state: RootState) => state.siteSettings.settings);
  
  if (!siteSettings) return null;
  
  const { google_analytics_id, yandex_metrika_id } = siteSettings.seo;
  
  return (
    <>
      {/* Google Analytics */}
      {google_analytics_id && (
        <>
          <script
            src={`https://www.googletagmanager.com/gtag/js?id=${google_analytics_id}`}
          />
          <script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${google_analytics_id}');
            `}
          </script>
        </>
      )}
      
      {/* Yandex.Metrika */}
      {yandex_metrika_id && (
        <script id="yandex-metrika">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
            k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
            ym(${yandex_metrika_id}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `}
        </script>
      )}
    </>
  );
};