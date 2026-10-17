/** Languages available for personal wishes. Keep this list independent from the app UI locale. */
export const WISH_LANGUAGES = ["English","Marathi","Hindi","Gujarati","Telugu","Tamil","Kannada","Bengali","Punjabi","Bhojpuri","Malayalam","Odia","Assamese","Urdu","German","French","Japanese"] as const;
export type WishLanguage = typeof WISH_LANGUAGES[number];
export const WISH_LANGUAGE_LABELS: Record<WishLanguage, string> = {
  English: "English",
  Marathi: "मराठी",
  Hindi: "हिन्दी",
  Gujarati: "ગુજરાતી",
  Telugu: "తెలుగు",
  Tamil: "தமிழ்",
  Kannada: "ಕನ್ನಡ",
  Bengali: "বাংলা",
  Punjabi: "ਪੰਜਾਬੀ",
  Bhojpuri: "भोजपुरी",
  Malayalam: "മലയാളം",
  Odia: "ଓଡ଼ିଆ",
  Assamese: "অসমীয়া",
  Urdu: "اردو",
  German: "Deutsch",
  French: "Français",
  Japanese: "日本語",
};
