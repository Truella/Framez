import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "./src/context/ThemeContext";
import { PostsProvider } from "./src/context/PostsContext";

export default function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<PostsProvider>
					<AppNavigator />
					<StatusBar style="auto" />
					<Toast />
				</PostsProvider>
			</AuthProvider>
		</ThemeProvider>
	);
}
