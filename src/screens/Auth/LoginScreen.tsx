import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigation";

type LoginScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	"Login"
>;

interface Props {
	navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { signIn, loading } = useAuth();

	const handleLogin = async () => {
		if (!email || !password) {
			alert("Please fill in all fields");
			return;
		}
		await signIn(email, password);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.content}>
				<Text style={styles.title}>Framez</Text>
				<Text style={styles.subtitle}>Share your moments</Text>

				<TextInput
					style={styles.input}
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
				/>

				<TextInput
					style={styles.input}
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>

				<TouchableOpacity
					style={styles.button}
					onPress={handleLogin}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.buttonText}>Log In</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
					<Text style={styles.linkText}>
						Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 48,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
		color: "#262626",
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 40,
		color: "#8e8e8e",
	},
	input: {
		backgroundColor: "#fafafa",
		borderWidth: 1,
		borderColor: "#dbdbdb",
		borderRadius: 5,
		padding: 15,
		marginBottom: 10,
		fontSize: 14,
	},
	button: {
		backgroundColor: "#3897f0",
		padding: 15,
		borderRadius: 5,
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	linkText: {
		textAlign: "center",
		marginTop: 20,
		color: "#8e8e8e",
	},
	linkBold: {
		color: "#3897f0",
		fontWeight: "600",
	},
});
