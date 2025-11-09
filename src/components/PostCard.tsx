import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Post } from "../types";

interface PostCardProps {
	post: Post;
	onDelete?: (postId: string) => void;
	showDeleteButton?: boolean;
}

export default function PostCard({
	post,
	onDelete,
	showDeleteButton = false,
}: PostCardProps) {
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

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.userInfo}>
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>
							{post.profiles?.username?.charAt(0).toUpperCase() || "U"}
						</Text>
					</View>
					<View>
						<Text style={styles.username}>
							@{post.profiles?.username || "user"}
						</Text>
						<Text style={styles.timestamp}>{formatDate(post.created_at)}</Text>
					</View>
				</View>
				{showDeleteButton && onDelete && (
					<TouchableOpacity
						onPress={() => onDelete(post.id)}
						style={styles.deleteButton}
					>
						<Text style={styles.deleteText}>Delete</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Content */}
			<Text style={styles.content}>{post.content}</Text>

			{/* Image */}
			{post.image_url && (
				<Image
					source={{ uri: post.image_url }}
					style={styles.image}
					resizeMode="cover"
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#dbdbdb",
		paddingVertical: 12,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		marginBottom: 10,
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
	deleteButton: {
		paddingVertical: 4,
		paddingHorizontal: 12,
		borderRadius: 4,
		backgroundColor: "#ff3b30",
	},
	deleteText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "600",
	},
	content: {
		fontSize: 14,
		color: "#262626",
		lineHeight: 20,
		paddingHorizontal: 15,
		marginBottom: 10,
	},
	image: {
		width: "100%",
		height: 400,
		backgroundColor: "#f0f0f0",
	},
});
