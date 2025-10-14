import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";

type Lang = "ru" | "uz" | "kaa";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkVKK-oMzlSlAE5i60obixM6eK4LMpKzKhKYwMwWpoYgj_xAGvNKG0jjG_ZmkU-POBDe5EYKPGkmei/pub?gid=0&single=true&output=csv";

export const initI18n = async () => {
  try {
    const res = await axios.get(SHEET_URL);
    const parsed: ParseResult<Record<string, string>> = Papa.parse(res.data, {
      header: true,
    });
    const rows = parsed.data;

    const translations: Record<Lang, Record<string, string>> = {
      uz: {},
      ru: {},
      kaa: {},
    };

    rows.forEach((row) => {
      const key = row.key?.trim();
      if (!key) return;
      (["ru", "uz", "kaa"] as Lang[]).forEach((lang) => {
        const value = row[lang]?.trim();
        if (value) translations[lang][key] = value;
      });
    });

    const savedLang = (localStorage.getItem("lang") as Lang) || "uz";

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

    console.log("✅ i18n initialized with:", savedLang);
  } catch (err) {
    console.error("❌ Error initializing i18n:", err);
  }
};

export default i18n;
