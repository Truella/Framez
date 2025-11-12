// app.config.js
export default {
	expo: {
		name: "framez",
		slug: "framez",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		newArchEnabled: true,
		splash: {
			image: "./assets/Framez-Splash.png",
			resizeMode: "contain",
			backgroundColor: "#f4f5f7",
		},
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
		},
		web: {
			favicon: "./assets/favicon.png",
		},
		plugins: ["expo-secure-store"],
		extra: {
			supabaseUrl: process.env.SUPABASE_URL,
			supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
			eas: {
				projectId: "27e02d9e-bd3a-47fd-890b-af8231ebdb9c",
			},
		},
	},
};
