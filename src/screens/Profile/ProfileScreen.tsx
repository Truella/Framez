import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { postService } from "../../services/posts";
import { Post } from "../../types";
import PostCard from "../../components/PostCard";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
	const { user, signOut } = useAuth();
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	const loadUserPosts = async () => {
		if (!user?.id) return;

		try {
			setLoading(true);
			const userPosts = await postService.fetchUserPosts(user.id);
			setPosts(userPosts);
		} catch (error) {
			console.error("Error loading user posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			loadUserPosts();
		}, [user?.id])
	);

	const handleDeletePost = async (postId: string) => {
		Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					const post = posts.find((p) => p.id === postId);
					const success = await postService.deletePost(postId, post?.image_url);

					if (success) {
						setPosts(posts.filter((p) => p.id !== postId));
						Alert.alert("Success", "Post deleted");
					} else {
						Alert.alert("Error", "Failed to delete post");
					}
				},
			},
		]);
	};

	const renderHeader = () => (
		<View>
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
					<Text style={styles.statNumber}>{posts.length}</Text>
					<Text style={styles.statLabel}>Posts</Text>
				</View>
			</View>

			<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
				<Text style={styles.logoutButtonText}>Log Out</Text>
			</TouchableOpacity>

			<View style={styles.postsHeader}>
				<Text style={styles.postsHeaderText}>Your Posts</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Profile</Text>
			</View>

			{loading ? (
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#3897f0" />
				</View>
			) : (
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<PostCard
							post={item}
							showDeleteButton
							onDelete={handleDeletePost}
						/>
					)}
					ListHeaderComponent={renderHeader}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>No posts yet</Text>
						</View>
					}
					showsVerticalScrollIndicator={false}
				/>
			)}
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
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	profileInfo: {
		alignItems: "center",
		marginTop: 20,
		paddingBottom: 20,
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
	username: {
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
		marginBottom: 5,
	},
	name: {
		fontSize: 14,
		color: "#8e8e8e",
		marginBottom: 10,
	},
	bio: {
		fontSize: 14,
		color: "#262626",
		textAlign: "center",
		paddingHorizontal: 40,
		marginTop: 10,
	},
	stats: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 15,
		borderTopWidth: 1,
		borderTopColor: "#dbdbdb",
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
	},
	statItem: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	statNumber: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#262626",
	},
	statLabel: {
		fontSize: 13,
		color: "#8e8e8e",
		marginTop: 4,
	},
	logoutButton: {
		marginHorizontal: 20,
		marginTop: 20,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: "#dbdbdb",
		borderRadius: 5,
		alignItems: "center",
	},
	logoutButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#262626",
	},
	postsHeader: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
		marginTop: 10,
	},
	postsHeaderText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
	},
	emptyContainer: {
		padding: 40,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 14,
		color: "#8e8e8e",
	},
});
