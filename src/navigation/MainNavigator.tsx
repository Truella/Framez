import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '../types/navigation';
import FeedScreen from '../screens/Feed/FeedScreen';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from '../context/ThemeContext';
const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainNavigator() {
	const {colors} = useTheme()
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.textTertiary,
				tabBarShowLabel: true,
				tabBarStyle: {
					borderTopWidth: 1,
					borderTopColor: colors.border,
					paddingBottom: 5,
					paddingTop: 5,
					height: 80,
					backgroundColor: colors.background
				},
			}}
		>
			<Tab.Screen
				name="Feed"
				component={FeedScreen}
				options={{
					tabBarLabel: "Feed",
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="CreatePost"
				component={CreatePostScreen}
				options={{
					tabBarLabel: "Create",
					tabBarIcon: ({ color, size }) => (
						<AntDesign name="plus-circle" size={size} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					tabBarLabel: "Profile",
					tabBarIcon: ({ color, size }) => (
						<AntDesign name="user" size={size} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}