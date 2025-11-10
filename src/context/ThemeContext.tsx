import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, darkColors } from "../theme/colors";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
	theme: Theme;
	isDark: boolean;
	colors: typeof colors;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const systemColorScheme = useColorScheme();
	const [theme, setThemeState] = useState<Theme>("auto");

	const isDark =
		theme === "auto" ? systemColorScheme === "dark" : theme === "dark";

	const themeColors = isDark ? darkColors : colors;

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem("theme");
			if (savedTheme) {
				setThemeState(savedTheme as Theme);
			}
		} catch (error) {
			console.error("Error loading theme:", error);
		}
	};

	const setTheme = async (newTheme: Theme) => {
		try {
			await AsyncStorage.setItem("theme", newTheme);
			setThemeState(newTheme);
		} catch (error) {
			console.error("Error saving theme:", error);
		}
	};

	return (
		<ThemeContext.Provider
			value={{ theme, isDark, colors: themeColors, setTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
