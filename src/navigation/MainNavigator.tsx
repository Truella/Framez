import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabsParamList } from "../types/navigation";
import { View, Text } from "react-native";
import ProfileScreen from "../screens/Profile/ProfileScreen";

// Temporary placeholder screens
const FeedScreen = () => (
	<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
		<Text>Feed Screen</Text>
	</View>
);

const CreatePostScreen = () => (
	<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
		<Text>Create Post Screen</Text>
	</View>
);

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainNavigator() {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Feed" component={FeedScreen} />
			<Tab.Screen name="CreatePost" component={CreatePostScreen} />
			<Tab.Screen name="Profile" component={ProfileScreen} />
		</Tab.Navigator>
	);
}
