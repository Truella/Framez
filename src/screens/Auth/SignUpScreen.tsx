import React, { use, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigation";

type SignUpScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	"SignUp"
>;

interface Props {
	navigation: SignUpScreenNavigationProp;
}

export default function SignUpScreen({ navigation }: Props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [username, setUsername] = useState("");
	const { signUp, loading } = useAuth();

	const handleSignUp = async () => {
		//Form Validation
		if (!email || !password || !fullName || !username) {
			alert("Please fill in all fields");
			return;
		}

		if (username.length < 3) {
			alert("Username must be at least 3 characters");
			return;
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			alert("Username can only contain letters, numbers, and underscores");
			return;
		}
		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			alert("Password must be at least 8 characters");
			return;
		}

		await signUp(email, password, username, fullName);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.content}>
					<Text style={styles.title}>Framez</Text>
					<Text style={styles.subtitle}>Create your account</Text>

					<TextInput
						style={styles.input}
						placeholder="Full Name"
						value={fullName}
						onChangeText={setFullName}
					/>
					<TextInput
						style={styles.input}
						placeholder="Username"
						value={username}
						onChangeText={(text) => setUsername(text.toLowerCase())}
                        autoCapitalize="none"
					/>

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

					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>

					<TouchableOpacity
						style={styles.button}
						onPress={handleSignUp}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Sign Up</Text>
						)}
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.navigate("Login")}>
						<Text style={styles.linkText}>
							Already have an account?{" "}
							<Text style={styles.linkBold}>Log In</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	scrollContent: {
		flexGrow: 1,
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
