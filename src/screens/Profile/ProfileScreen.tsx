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
import PostCard from "../../components/PostCard";
import { useFocusEffect } from "@react-navigation/native";
import { usePosts } from "../../context/PostsContext";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

type TabType = "posts" | "saved";

export default function ProfileScreen() {
	const { user, signOut } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("posts");
	const [initialLoading, setInitialLoading] = useState(true);
	const { colors } = useTheme();
	const {
		userPosts,
		savedPosts,
		loadUserPosts,
		loadSavedPosts,
		updatePostLike,
		updatePostSave,
		removePost,
	} = usePosts();

	const loadData = async (showSpinner = false) => {
		if (!user?.id) return;

		try {
			if (showSpinner) setInitialLoading(true);
			await Promise.all([loadUserPosts(user.id), loadSavedPosts(user.id)]);
		} catch (error) {
			console.error("Error loading profile data:", error);
		} finally {
			setInitialLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			if (user?.id) {
				// Always reload, but only show spinner if no data
				const shouldShowSpinner =
					userPosts.length === 0 && savedPosts.length === 0;
				loadData(shouldShowSpinner);
			}
		}, [user?.id])
	);

	const handleDeletePost = async (postId: string) => {
		Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: async () => {
					const post = userPosts.find((p) => p.id === postId);
					const success = await postService.deletePost(postId, post?.image_url);

					if (success) {
						removePost(postId); // CHANGE TO THIS
						Alert.alert("Success", "Post deleted");
					} else {
						Alert.alert("Error", "Failed to delete post");
					}
				},
			},
		]);
	};

	const handleLikeUpdate = (postId: string, liked: boolean, count: number) => {
		updatePostLike(postId, liked, count);
	};

	const handleSaveUpdate = (postId: string, saved: boolean) => {
		updatePostSave(postId, saved);
	};

	if (initialLoading) {
		return (
			<SafeAreaView
				style={[styles.container, { backgroundColor: colors.background }]}
			>
				<View style={[styles.header, {borderColor: colors.border}]}>
					<Text style={[styles.title, {color:colors.textPrimary}]}>{user?.username}</Text>
				</View>
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#3897f0" />
				</View>
			</SafeAreaView>
		);
	}
	const renderHeader = () => (
		<View>
			<View style={styles.profileInfo}>
					<LinearGradient
						colors={[colors.gradientStart, colors.gradientEnd]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.avatar}
					>
						<Text style={styles.avatarText}>
							{user?.username?.charAt(0).toUpperCase() || "U"}
						</Text>
					</LinearGradient>
	
				<Text style={styles.username}>@{user?.username}</Text>
				<Text style={styles.name}>{user?.full_name || "User"}</Text>
				{user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
			</View>

			<View style={styles.stats}>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{userPosts.length}</Text>
					<Text style={styles.statLabel}>Posts</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={styles.statNumber}>{savedPosts.length}</Text>
					<Text style={styles.statLabel}>Saved</Text>
				</View>
			</View>

			
			{/* Tabs */}
			<View style={[styles.tabs]}>
				<TouchableOpacity
					style={[styles.tab, activeTab === "posts" && styles.activeTab]}
					onPress={() => setActiveTab("posts")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "posts" && styles.activeTabText,
						]}
					>
						Your Posts
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab, activeTab === "saved" && styles.activeTab]}
					onPress={() => setActiveTab("saved")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "saved" && styles.activeTabText,
						]}
					>
						Saved
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const currentPosts = activeTab === "posts" ? userPosts : savedPosts;

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={[styles.header, { borderColor: colors.border }]}>
				<Text style={[styles.title, { color: colors.textPrimary }]}>
					{user?.username}
				</Text>
				<TouchableOpacity style={styles.logoutButton} onPress={signOut}>
					<Text style={styles.logoutButtonText}>Log Out</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={currentPosts}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<PostCard
						post={item}
						showDeleteButton={activeTab === "posts"}
						onDelete={handleDeletePost}
						onLikeUpdate={handleLikeUpdate}
						onSaveUpdate={handleSaveUpdate}
					/>
				)}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							{activeTab === "posts" ? "No posts yet" : "No saved posts yet"}
						</Text>
						<Text style={styles.emptySubtext}>
							{activeTab === "posts"
								? "Create your first post to get started!"
								: "Save posts to see them here"}
						</Text>
					</View>
				}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		borderBottomWidth: 1,
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
	tabs: {
		flexDirection: "row",
		marginTop: 10,
	},
	tab: {
		flex: 1,
		paddingVertical: 15,
		alignItems: "center",
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	activeTab: {
		borderBottomColor: "#3897f0",
	},
	tabText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#8e8e8e",
	},
	activeTabText: {
		color: "#3897f0",
	},
	emptyContainer: {
		padding: 40,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#262626",
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: "#8e8e8e",
		textAlign: "center",
	},
});
