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
import { useFocusEffect } from "@react-navigation/native";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useTheme } from "../../context/ThemeContext";
import { usePosts } from "../../context/PostsContext";
import Logo from "../../components/Logo";

export default function FeedScreen() {
	const { allPosts, loadAllPosts, updatePostLike } = usePosts();
	const [refreshing, setRefreshing] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);

	const { colors } = useTheme();

	const loadPosts = async (showSpinner = false) => {
		try {
			if (showSpinner) setInitialLoading(true);
			await loadAllPosts();
		} catch (error) {
			console.error("Error loading posts:", error);
		} finally {
			setRefreshing(false);
			setInitialLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			const shouldShowSpinner = allPosts.length === 0;
			loadPosts(shouldShowSpinner);
		}, [])
	);
	const onRefresh = async () => {
		setRefreshing(true);
		await loadAllPosts();
	};
	const handleLikeUpdate = (postId: string, liked: boolean, count: number) => {
		updatePostLike(postId, liked, count);
	};
	if (initialLoading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#3897f0" />
			</View>
		);
	}
	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={[styles.header, {borderColor:colors.border}]}>
				<Logo/>
				<ThemeSwitcher />
			</View>
			{allPosts.length === 0 ? (
				<View style={styles.centerContainer}>
					<Text style={styles.emptyText}>No posts yet</Text>
					<Text style={styles.emptySubtext}>
						Be the first to share something!
					</Text>
				</View>
			) : (
				<FlatList
					data={allPosts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<PostCard post={item} onLikeUpdate={handleLikeUpdate} />
					)}
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
	},
	header: {
		borderBottomWidth: 1,
		paddingVertical: 10,
		paddingStart: 4,
		paddingEnd:24,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems:"center"
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
