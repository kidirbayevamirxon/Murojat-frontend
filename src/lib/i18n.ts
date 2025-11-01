import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

type Lang = "ru" | "uz" | "kaa";

export const initI18n = async () => {
  try {
    // 👇 Fetch CSV from public folder
    const res = await fetch("/translations.csv");
    const csvText = await res.text();

    // 👇 Parse CSV
    const parsed: ParseResult<Record<string, string>> = Papa.parse(csvText, {
      header: true,
    });
    const rows = parsed.data;

    const translations: Record<Lang, Record<string, string>> = {
      uz: {},
      ru: {},
      kaa: {},
    };

    // 👇 Convert rows to JSON object
    rows.forEach((row) => {
      const key = row.key?.trim();
      if (!key) return;
      (["ru", "uz", "kaa"] as Lang[]).forEach((lang) => {
        const value = row[lang]?.trim();
        if (value) translations[lang][key] = value;
      });
    });

    const savedLang = (localStorage.getItem("lang") as Lang) || "uz";

    // 👇 Initialize i18next
    await i18n.use(initReactI18next).init({
      resources: {
        uz: { translation: translations.uz },
        ru: { translation: translations.ru },
        kaa: { translation: translations.kaa },
      },
      lng: savedLang,
      fallbackLng: "uz",
      interpolation: { escapeValue: false },
    });

    console.log("✅ i18n initialized with local CSV:", savedLang);
  } catch (err) {
    console.error("❌ Error initializing i18n:", err);
  }
};

export default i18n;
