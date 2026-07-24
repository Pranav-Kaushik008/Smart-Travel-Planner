export const ACCENT_THEMES = {
  sky: {
    id: "sky",
    name: "Sky Blue",
    bg: "bg-sky-500",
    gradient: "bg-gradient-to-r from-sky-500 to-indigo-500",
    shadow: "shadow-sky-500/25",
    text: "text-sky-500 dark:text-sky-400",
    textBold: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500",
    ring: "ring-sky-500",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    activeTab: "bg-sky-500 text-white shadow-md shadow-sky-500/20"
  },
  indigo: {
    id: "indigo",
    name: "Indigo",
    bg: "bg-indigo-500",
    gradient: "bg-gradient-to-r from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/25",
    text: "text-indigo-500 dark:text-indigo-400",
    textBold: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500",
    ring: "ring-indigo-500",
    badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    activeTab: "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
  },
  emerald: {
    id: "emerald",
    name: "Emerald",
    bg: "bg-emerald-500",
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/25",
    text: "text-emerald-500 dark:text-emerald-400",
    textBold: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500",
    ring: "ring-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    activeTab: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
  },
  amber: {
    id: "amber",
    name: "Amber",
    bg: "bg-amber-500",
    gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
    text: "text-amber-500 dark:text-amber-400",
    textBold: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500",
    ring: "ring-amber-500",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    activeTab: "bg-amber-500 text-white shadow-md shadow-amber-500/20"
  },
  purple: {
    id: "purple",
    name: "Purple",
    bg: "bg-purple-500",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    text: "text-purple-500 dark:text-purple-400",
    textBold: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500",
    ring: "ring-purple-500",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    activeTab: "bg-purple-500 text-white shadow-md shadow-purple-500/20"
  },
  rose: {
    id: "rose",
    name: "Rose",
    bg: "bg-rose-500",
    gradient: "bg-gradient-to-r from-rose-500 to-red-500",
    shadow: "shadow-rose-500/25",
    text: "text-rose-500 dark:text-rose-400",
    textBold: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500",
    ring: "ring-rose-500",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    activeTab: "bg-rose-500 text-white shadow-md shadow-rose-500/20"
  }
};

export const getAccentTheme = (accentKey = "sky") => {
  return ACCENT_THEMES[accentKey] || ACCENT_THEMES.sky;
};
