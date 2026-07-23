import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext();

const STORAGE_KEY = "skillsphere-theme";

export const ThemeProvider = ({ children }) => {
  // light | dark | system
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";

    return localStorage.getItem(STORAGE_KEY) || "system";
  });

  // actual applied theme
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = (selectedTheme) => {
      const dark =
        selectedTheme === "dark" ||
        (selectedTheme === "system" &&
          mediaQuery.matches);

      const html = document.documentElement;

      html.classList.add("theme-transition");

      if (dark) {
        html.classList.add("dark");
        html.style.colorScheme = "dark";
        setResolvedTheme("dark");
      } else {
        html.classList.remove("dark");
        html.style.colorScheme = "light";
        setResolvedTheme("light");
      }

      setTimeout(() => {
        html.classList.remove("theme-transition");
      }, 250);
    };

    applyTheme(theme);

    const handleSystemTheme = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        "change",
        handleSystemTheme
      );
    } else {
      mediaQuery.addListener(handleSystemTheme);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(
          "change",
          handleSystemTheme
        );
      } else {
        mediaQuery.removeListener(handleSystemTheme);
      }
    };
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  // Toggle only between light and dark
  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      isDark: resolvedTheme === "dark",
      isLight: resolvedTheme === "light",
    }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
};