import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Post } from "../types";
import { useAuth } from "../context/AuthContext";
import { likesService, savedPostsService } from "../services/likes";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

interface PostCardProps {
	post: Post;
	onDelete?: (postId: string) => void;
	showDeleteButton?: boolean;
	onLikeUpdate?: (postId: string, liked: boolean, count: number) => void; // CHANGE THIS
	onSaveUpdate?: (postId: string, saved: boolean) => void; // ADD THIS
}

 function PostCard({
	post,
	onDelete,
	showDeleteButton = false,
	onLikeUpdate,
	onSaveUpdate,
}: PostCardProps) {
	const { user } = useAuth();
	const [postMenuIsOpen, setPostMenuIsOpen] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const { colors } = useTheme();
	useEffect(() => {
		loadPostStats();
	}, [post.id, user?.id]);

	const loadPostStats = async () => {
		if (!user?.id) return;

		try {
			const [liked, saved, count] = await Promise.all([
				likesService.hasUserLiked(user.id, post.id),
				savedPostsService.hasUserSaved(user.id, post.id),
				likesService.getLikeCount(post.id),
			]);

			setIsLiked(liked);
			setIsSaved(saved);
			setLikeCount(count);
		} catch (error) {
			console.error("Error loading post stats:", error);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;

		return date.toLocaleDateString();
	};

	const handleLike = async () => {
		if (!user?.id || loading) return;

		setLoading(true);
		try {
			const result = await likesService.toggleLike(user.id, post.id);
			if (result) {
				setIsLiked(result.liked);
				setLikeCount(result.count);
				onLikeUpdate?.(post.id, result.liked, result.count); // CHANGE THIS LINE
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setLoading(false);
		}
	};
	const handleSave = async () => {
		if (!user?.id || loading) return;

		setLoading(true);
		try {
			const result = await savedPostsService.toggleSave(user.id, post.id);
			if (result !== null) {
				setIsSaved(result);
				onSaveUpdate?.(post.id, result); // ADD THIS LINE
			}
		} catch (error) {
			console.error("Error toggling save:", error);
		} finally {
			setLoading(false);
		}
	};
	const renderHeader = () => (
		<View style={styles.header}>
			<View style={styles.userInfo}>
				<LinearGradient
					colors={[colors.gradientStart, colors.gradientEnd]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.avatar}
				>
					<Text style={styles.avatarText}>
						{post.profiles?.username?.charAt(0).toUpperCase() || "U"}
					</Text>
				</LinearGradient>
				<View>
					<Text style={[styles.username, { color: colors.textPrimary }]}>
						@{post.profiles?.username || "user"}
					</Text>
					<Text style={[styles.timestamp, { color: colors.textTertiary }]}>
						{formatDate(post.created_at)}
					</Text>
				</View>
			</View>
			<View style={styles.deleteBtnParent}>
				<TouchableOpacity onPress={() => setPostMenuIsOpen((prev) => !prev)}>
					<Entypo
						name="dots-three-horizontal"
						size={24}
						color={colors.primary}
					/>
				</TouchableOpacity>

				{showDeleteButton && onDelete && postMenuIsOpen && (
					<TouchableOpacity
						onPress={() => onDelete(post.id)}
						style={styles.deleteButton}
					>
						<Text style={styles.deleteText}>Delete</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);

	const renderIcons = () => (
		<View style={styles.iconsRow}>
			<View style={styles.iconRowChild}>
				<TouchableOpacity onPress={handleLike} disabled={loading}>
					<FontAwesome
						name={isLiked ? "heart" : "heart-o"}
						size={26}
						color={isLiked ? colors.like : colors.comment}
					/>
				</TouchableOpacity>
				{likeCount > 0 && (
					<Text style={[styles.likeCount, { color: colors.textPrimary }]}>
						{likeCount}
					</Text>
				)}
				<TouchableOpacity>
					<Ionicons
						name="chatbubble-outline"
						size={26}
						color={colors.comment}
					/>
				</TouchableOpacity>
				<TouchableOpacity>
					<Ionicons name="paper-plane-outline" size={26} color={colors.share} />
				</TouchableOpacity>
			</View>
			<View style={styles.iconRowChild}>
				<TouchableOpacity onPress={handleSave} disabled={loading}>
					<MaterialCommunityIcons
						name={isSaved ? "bookmark" : "bookmark-outline"}
						size={26}
						color={isSaved ? "#667eea" : colors.share}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);

	if (post.image_url) {
		return (
			<View style={[styles.container, { backgroundColor: colors.background }]}>
				{renderHeader()}
				<Image
					source={{ uri: post.image_url }}
					style={styles.postImage}
					resizeMode="cover"
				/>

				<Text style={[styles.content, { color: colors.textPrimary }]}>
					{post.content}
				</Text>
				{renderIcons()}
			</View>
		);
	}

	// Text-only post
	return (
		<View
			style={[
				styles.container,
				styles.textPostContainer,
				{ backgroundColor: colors.background },
			]}
		>
			{renderHeader()}

			<LinearGradient
				colors={[colors.surface, "rgba(102, 126, 234, 0.1)"]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<View style={[styles.textContentContainer]}>
					<Text style={[styles.content, { color: colors.textPrimary }]}>
						{post.content}
					</Text>
				</View>
			</LinearGradient>

			{renderIcons()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
	textPostContainer: {
		minHeight: 200,
		justifyContent: "space-between",
		paddingVertical: 15,
	},
	textContentContainer: {
		minHeight: 250,
		paddingVertical: 12,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	postImage: {
		width: "100%",
		height: 400,
		backgroundColor: "#f0f0f0",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		marginVertical: 10,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#3897f0",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	avatarText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	username: {
		fontSize: 14,
		fontWeight: "600",
		color: "#262626",
	},
	timestamp: {
		fontSize: 12,
		color: "#8e8e8e",
		marginTop: 2,
	},
	content: {
		fontSize: 14,
		color: "#262626",
		lineHeight: 20,
		paddingHorizontal: 15,
		marginBottom: 10,
	},
	iconsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	iconRowChild: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
	},
	likeCount: {
		fontSize: 14,
		fontWeight: "600",
		color: "#262626",
		marginLeft: -4,
	},
	deleteBtnParent: {
		position: "relative",
		width: 100,
		alignItems: "flex-end",
	},
	deleteButton: {
		position: "absolute",
		top: 30,
		right: 0,
		backgroundColor: "red",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
		zIndex: 10,
	},
	deleteText: {
		color: "#fff",
		fontWeight: "bold",
	},
});


export default React.memo(PostCard)