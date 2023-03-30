import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
    theme: {
        background: "",
        text: "",
        backgroundSelected: "",
        banner: "",
        userBackground: "",
        botBackground: "",
    },
    toggleTheme: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
    const colors = {
        blue: "#0088cc",
        gray: "#e4e4e4",
        lighterGray: "#eeeeee",
        dark: {
            blue: "#222222",
            gray: "#333333",
        },
    };
    const [themeName, setThemeName] = useState("light");
    const toggleTheme = () => {
        if (themeName === "light") {
            localStorage.setItem("theme", "dark");

            setThemeName("dark");
        } else {
            localStorage.setItem("theme", "light");

            setThemeName("light");
        }
    };

    useEffect(() => {
        if (themeName === "dark") {
            setTheme({
                background: colors.dark.gray,
                backgroundSelected: colors.dark.blue,
                text: colors.gray,
                banner: colors.dark.blue,
                userBackground: colors.dark.gray,
                botBackground: colors.dark.gray,
            });
        } else {
            setTheme({
                background: colors.lighterGray,
                backgroundSelected: colors.gray,
                text: colors.dark.gray,
                banner: colors.blue,
                userBackground: colors.lighterGray,
                botBackground: colors.gray,
            });
        }
    }, [themeName]);
    const [theme, setTheme] = useState({
        background: colors.gray,
        backgroundSelected: colors.blue,
        text: colors.dark.blue,
        banner: colors.blue,
        userBackground: colors.lighterGray,
        botBackground: colors.gray,
    });

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
