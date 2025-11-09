import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	FlatList,
	StyleSheet,
	RefreshControl,
	Text,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../../components/PostCard";
import { postService } from "../../services/posts";
import { Post } from "../../types";
import { useFocusEffect } from "@react-navigation/native";

export default function FeedScreen() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const loadPosts = async () => {
		try {
			const fetchedPosts = await postService.fetchPosts();
			setPosts(fetchedPosts);
		} catch (error) {
			console.error("Error loading posts:", error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	// Load posts when screen comes into focus
	useFocusEffect(
		useCallback(() => {
			loadPosts();
		}, [])
	);

	const onRefresh = () => {
		setRefreshing(true);
		loadPosts();
	};

	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#3897f0" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Framez</Text>
			</View>

			{posts.length === 0 ? (
				<View style={styles.centerContainer}>
					<Text style={styles.emptyText}>No posts yet</Text>
					<Text style={styles.emptySubtext}>
						Be the first to share something!
					</Text>
				</View>
			) : (
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <PostCard post={item} />}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#3897f0"
						/>
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
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#262626",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#262626",
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: "#8e8e8e",
	},
});
