import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from '../types/navigation';
import FeedScreen from '../screens/Feed/FeedScreen';
import CreatePostScreen from '../screens/Post/CreatePostScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from "@expo/vector-icons/AntDesign";
const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainNavigator() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#3897f0",
				tabBarInactiveTintColor: "#8e8e8e",
				tabBarShowLabel: true,
				tabBarStyle: {
					borderTopWidth: 1,
					borderTopColor: "#dbdbdb",
					paddingBottom: 5,
					paddingTop: 5,
					height: 60,
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