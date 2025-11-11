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
import { showToast } from "../../utils/toast";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../components/Logo";

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
	const { colors } = useTheme();
	const handleLogin = async () => {
		if (!email || !password) {
			showToast.info("Please fill in all fields");
			return;
		}
		await signIn(email, password);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={styles.content}>
				<Logo/>
				<Text style={[styles.subtitle, {color:colors.textSecondary}]}>Share your moments</Text>
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
				<TouchableOpacity onPress={handleLogin} disabled={loading}>
					<LinearGradient
						colors={[colors.gradientStart, colors.gradientEnd]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.button}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<Text style={styles.buttonText}>Log In</Text>
						)}
					</LinearGradient>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
					<Text style={[styles.linkText, {color:colors.textSecondary}]}>
						Don't have an account? <Text style={[styles.linkBold, {color:colors.primary}]}>Sign Up</Text>
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		fontSize: 16,
		fontWeight: "600",
		color:"#fff"
	},
	linkText: {
		textAlign: "center",
		marginTop: 20,
	},
	linkBold: {
		fontWeight: "600",
	},
});
