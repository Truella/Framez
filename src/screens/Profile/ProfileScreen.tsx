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
import { useEffect } from "react";
import { usePosts } from "../../context/PostsContext";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { showToast } from "../../utils/toast";

type TabType = "posts" | "saved";

export default function ProfileScreen() {
	const { user, signOut } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("posts");
	const [initialLoading, setInitialLoading] = useState(true);
	const { colors } = useTheme();
	const { userPosts, savedPosts, loadUserPosts, loadSavedPosts, removePost } = usePosts();

	// Load data once on mount
	useEffect(() => {
		const loadData = async () => {
			if (!user?.id) return;

			try {
				setInitialLoading(true);
				await Promise.all([
					loadUserPosts(user.id, user.id),
					loadSavedPosts(user.id),
				]);
			} catch (error) {
				showToast.error("Error loading profile data");
			} finally {
				setInitialLoading(false);
			}
		};

		loadData();
	}, [user?.id]);
	const handleLogout = () => {};
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
						removePost(postId);
						Alert.alert("Success", "Post deleted");
					} else {
						Alert.alert("Error", "Failed to delete post");
					}
				},
			},
		]);
	};

	if (initialLoading) {
		return (
			<SafeAreaView
				style={[styles.container, { backgroundColor: colors.background }]}
			>
				<View style={[styles.header, { borderColor: colors.border }]}>
					<Text style={[styles.title, { color: colors.textPrimary }]}>
						{user?.username}
					</Text>
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

				<Text style={[styles.username, { color: colors.textPrimary }]}>
					@{user?.username}
				</Text>
				<Text style={[styles.name, { color: colors.textSecondary }]}>
					{user?.full_name || "User"}
				</Text>
				{user?.bio && (
					<Text style={[styles.bio, { color: colors.textPrimary }]}>
						{user?.bio}
					</Text>
				)}
			</View>

			<View style={[styles.stats, { borderColor: colors.border }]}>
				<View style={styles.statItem}>
					<Text style={[styles.statNumber, { color: colors.textPrimary }]}>
						{userPosts.length}
					</Text>
					<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
						Posts
					</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statNumber, { color: colors.textPrimary }]}>
						{savedPosts.length}
					</Text>
					<Text style={[styles.statLabel, { color: colors.textSecondary }]}>
						Saved
					</Text>
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
				<Text style={[styles.title, { color: colors.primary }]}>
					{user?.username}
				</Text>
				<TouchableOpacity
					onPress={signOut}
					style={styles.logoutButtonContainer}
				>
					<Text style={{ color: colors.primary }}>Logout</Text>
					<MaterialIcons name="logout" size={24} color={colors.primary} />
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
					/>
				)}
				ListHeaderComponent={renderHeader}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
							{activeTab === "posts" ? "No posts yet" : "No saved posts yet"}
						</Text>
						<Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
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
		paddingEnd: 24,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 20,
		fontStyle: "italic",
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
		borderBottomWidth: 1,
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
	logoutButtonContainer: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
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
