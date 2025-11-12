import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import SignUpScreen from "../screens/Auth/SignUpScreen";
import { AuthStackParamList } from "../types/navigation";
import { useTheme } from "../context/ThemeContext";
import { View } from "react-native";

const Stack = createStackNavigator<AuthStackParamList>();
export default function AuthNavigator() {
	const { colors } = useTheme();
	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					cardStyle: {
						backgroundColor: colors.background,
					},
				}}
			>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="SignUp" component={SignUpScreen} />
			</Stack.Navigator>
		</View>
	);
}
