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
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../components/Logo";
import { showToast } from "../../utils/toast";

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
	const { colors } = useTheme();
	const handleSignUp = async () => {
		//Form Validation
		if (!email || !password || !fullName || !username) {
			showToast.info("Please fill in all fields");
			return;
		}

		if (username.length < 3) {
			showToast.info("Username must be at least 3 characters");
			return;
		}

		if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			showToast.info("Username can only contain letters, numbers, and underscores");
			return;
		}
		if (password !== confirmPassword) {
			showToast.info("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			showToast.info("Password must be at least 8 characters");
			return;
		}

		await signUp(email, password, username, fullName);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.content}>
					<Logo/>
					<Text style={[styles.subtitle, {color:colors.textSecondary}]}>Create your account</Text>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								color: colors.textPrimary,
							},
						]}
						placeholder="Full Name"
						placeholderTextColor={colors.textTertiary}
						value={fullName}
						onChangeText={setFullName}
					/>
					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								color: colors.textPrimary,
							},
						]}
						placeholder="Username"
						placeholderTextColor={colors.textTertiary}
						value={username}
						onChangeText={(text) => setUsername(text.toLowerCase())}
						autoCapitalize="none"
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								color: colors.textPrimary,
							},
						]}
						placeholder="Email"
						placeholderTextColor={colors.textTertiary}
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
						keyboardType="email-address"
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								color: colors.textPrimary,
							},
						]}
						placeholder="Password"
						placeholderTextColor={colors.textTertiary}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>

					<TextInput
						style={[
							styles.input,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
								color: colors.textPrimary,
							},
						]}
						placeholder="Confirm Password"
						placeholderTextColor={colors.textTertiary}
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry
					/>

					<TouchableOpacity onPress={handleSignUp} disabled={loading}>
						<LinearGradient
							colors={[colors.gradientStart, colors.gradientEnd]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.button}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text style={styles.buttonText}>Sign Up</Text>
							)}
						</LinearGradient>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => navigation.navigate("Login")}>
						<Text style={[styles.linkText, {color:colors.textSecondary}]}>
							Already have an account? 
							<Text style={[styles.linkBold, { color: colors.primary }]}>
								 Log In
							</Text>
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
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	subtitle: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 40,
	},
	input: {
		borderWidth: 1,
		borderRadius: 5,
		padding: 15,
		marginBottom: 10,
		fontSize: 14,
	},
	button: {
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
	},
	linkBold: {
		fontWeight: "600",
	},
});
