// Map Country Names (from your DB/Navigator) to ISO 639-1 Language Codes
// Used by TranslatorPage.jsx for auto-selection

export const countryToLanguage = {
    // 🌍 ASIA & MIDDLE EAST
    "Afghanistan": "ps", // Pashto (or 'fa' for Dari)
    "Bangladesh": "bn",
    "China": "zh",
    "India": "hi", // Hindi (Default)
    "Indonesia": "id",
    "Iran": "fa",
    "Iraq": "ar",
    "Israel": "he",
    "Japan": "ja",
    "Jordan": "ar",
    "Korea": "ko",
    "South Korea": "ko",
    "Malaysia": "ms",
    "Nepal": "ne",
    "Pakistan": "ur",
    "Philippines": "tl",
    "Saudi Arabia": "ar",
    "Singapore": "zh", // Simplified Chinese (or 'ms'/'ta')
    "Sri Lanka": "si",
    "Taiwan": "zh-TW",
    "Thailand": "th",
    "Turkey": "tr",
    "United Arab Emirates": "ar",
    "Vietnam": "vi",
    "Viet Nam": "vi",

    // 🇪🇺 EUROPE
    "Albania": "sq",
    "Austria": "de",
    "Belgium": "nl", // or 'fr'
    "Croatia": "hr",
    "Czech Republic": "cs",
    "Denmark": "da",
    "Finland": "fi",
    "France": "fr",
    "Germany": "de",
    "Greece": "el",
    "Hungary": "hu",
    "Iceland": "is",
    "Ireland": "ga",
    "Italy": "it",
    "Netherlands": "nl",
    "Norway": "no",
    "Poland": "pl",
    "Portugal": "pt",
    "Romania": "ro",
    "Russia": "ru",
    "Russian Federation": "ru",
    "Spain": "es",
    "Sweden": "sv",
    "Switzerland": "de", // or 'fr'/'it'
    "Ukraine": "uk",
    "United Kingdom": "en",

    // 🌎 AMERICAS
    "Argentina": "es",
    "Brazil": "pt",
    "Canada": "en", // or 'fr'
    "Chile": "es",
    "Colombia": "es",
    "Mexico": "es",
    "Peru": "es",
    "United States": "en",
    "Venezuela": "es",

    // 🌍 AFRICA
    "Egypt": "ar",
    "Ethiopia": "am",
    "Kenya": "sw",
    "Morocco": "ar",
    "Nigeria": "en", // Official
    "South Africa": "en", // One of many
    "Tanzania": "sw",

    // 🌏 OCEANIA
    "Australia": "en",
    "New Zealand": "en",
    "Fiji": "fj"
};

// Common Language List for the Dropdown (Sorted)
export const supportedLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "gu", name: "Gujarati" },
    { code: "zh", name: "Chinese (Simplified)" },
    { code: "ar", name: "Arabic" },
    { code: "bn", name: "Bengali" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "pt", name: "Portuguese" },
    { code: "it", name: "Italian" },
    { code: "ko", name: "Korean" },
    { code: "tr", name: "Turkish" },
    { code: "vi", name: "Vietnamese" },
    { code: "th", name: "Thai" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "id", name: "Indonesian" }
];
