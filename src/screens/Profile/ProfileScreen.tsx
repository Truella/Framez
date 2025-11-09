import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
	const { user, signOut } = useAuth();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
			</View>

			<View style={styles.content}>
				<View style={styles.profileInfo}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>
							{user?.username?.charAt(0).toUpperCase() || "U"}
						</Text>
					</View>
					<Text style={styles.username}>@{user?.username}</Text>
					<Text style={styles.name}>{user?.full_name || "User"}</Text>
					{user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
				</View>
				<View style={styles.stats}>
					<View style={styles.statItem}>
						<Text style={styles.statNumber}>0</Text>
						<Text style={styles.statLabel}>Posts</Text>
					</View>
				</View>

				<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
					<Text style={styles.logoutButtonText}>Log Out</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
		padding: 15,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#262626",
	},
	content: {
		flex: 1,
		alignItems: "center",
		padding: 20,
	},
	profileInfo: {
		alignItems: "center",
		marginTop: 20,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#3897f0",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	avatarText: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
	},
	email: {
		fontSize: 14,
		color: "#8e8e8e",
	},
	stats: {
		flexDirection: "row",
		marginTop: 30,
		paddingTop: 20,
		borderTopWidth: 1,
		borderTopColor: "#dbdbdb",
		width: "100%",
		justifyContent: "center",
	},
	statItem: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	statNumber: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#262626",
	},
	statLabel: {
		fontSize: 14,
		color: "#8e8e8e",
		marginTop: 5,
	},
	logoutButton: {
		marginTop: 40,
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderWidth: 1,
		borderColor: "#dbdbdb",
		borderRadius: 5,
	},
	logoutButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
	},
	username: {
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
		marginBottom: 5,
	},
	name: {
		fontSize: 14,
		color: "#8e8e8e",
		marginBottom: 5,
	},
	bio: {
		fontSize: 14,
		color: "#262626",
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
	},
});
