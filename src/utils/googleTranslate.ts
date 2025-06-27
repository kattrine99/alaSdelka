class TranslationService {
    apiKey: string;
    cache: Map<string, string>;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.cache = new Map();
    }

    async translateText(text: string, targetLang: string, sourceLang: string = 'ru'): Promise<string | null | undefined> {
        const cacheKey = `${text}-${sourceLang}-${targetLang}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        try {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLang,
                    source: sourceLang,
                    format: 'text'
                })
            });

            const data = await response.json();
            console.log(data)
            const translatedText = data.data.translations[0].translatedText;

            this.cache.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation failed:', error);
            return text; // Return original text on error
        }
    }
}

export const translationService = new TranslationService('AIzaSyABYYPJVhLZ9C7RuR0OUKPfXz-P12ZPoPg');