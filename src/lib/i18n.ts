import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import axios from "axios";

type Lang = "ru" | "uz" | "kaa";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkVKK-oMzlSlAE5i60obixM6eK4LMpKzKhKYwMwWpoYgj_xAGvNKG0jjG_ZmkU-POBDe5EYKPGkmei/pub?gid=0&single=true&output=csv";

const loadTranslations = async () => {
  try {
    const res = await axios.get(SHEET_URL);
    const lines = res.data.split("\n").filter(Boolean);

    const [header, ...rows] = lines.map((l: string) =>
      l.split(",").map((s) => s.trim().replace(/^"|"$/g, ""))
    );

    const langs = header.slice(1) as Lang[]; // ['ru', 'uz', 'kaa']

    const translations: Record<Lang, Record<string, string>> = {
      ru: {},
      uz: {},
      kaa: {},
    };

    rows.forEach((row: string[]) => {
      const key = row[0];
      row.slice(1).forEach((value, i) => {
        const lang: Lang = langs[i];
        translations[lang][key] = value;
      });
    });

    i18n.use(initReactI18next).init({
      resources: Object.fromEntries(
        langs.map((lang) => [lang, { translation: translations[lang] }])
      ),
      lng: "uz", // boshlang‘ich til
      fallbackLng: "ru",
      interpolation: { escapeValue: false },
    });

    console.log("✅ Translations loaded:", translations);
  } catch (err) {
    console.error("❌ Error loading translations:", err);
  }
};

loadTranslations();

export default i18n;