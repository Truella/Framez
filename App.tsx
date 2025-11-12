import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "./src/context/ThemeContext";
import { PostsProvider } from "./src/context/PostsContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<AuthProvider>
					<PostsProvider>
						<AppNavigator />
						<StatusBar style="auto" />
						<Toast />
					</PostsProvider>
				</AuthProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
