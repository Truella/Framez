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
import ThemeSwitcher from "../../components/ThemeSwitcher";
import { useTheme } from "../../context/ThemeContext";
import { usePosts } from "../../context/PostsContext";
import Logo from "../../components/Logo";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

export default function FeedScreen() {
	const { user } = useAuth();
	const { allPosts, loadAllPosts, loading } = usePosts();
	const [refreshing, setRefreshing] = useState(false);
	const { colors } = useTheme();

	useEffect(() => {
		const loadInitialPosts = async () => {
			if (!user?.id) return;

			try {
				await loadAllPosts(user.id);
			} catch (error) {
				showToast.error("Error loading posts");
			}
		};

		loadInitialPosts();
	}, [user?.id]);

	const onRefresh = async () => {
		if (!user?.id) return;

		setRefreshing(true);
		try {
			await loadAllPosts(user.id, true);
		} catch (error) {
			showToast.error("Error refreshing");
		} finally {
			setRefreshing(false);
		}
	};

	// Show loading spinner when loading with no posts
	if (loading && allPosts.length === 0) {
		return (
			<SafeAreaView
				style={[styles.container, { backgroundColor: colors.background }]}
			>
				<View style={[styles.header, { borderColor: colors.border }]}>
					<Logo />
					<ThemeSwitcher />
				</View>
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color="#3897f0" />
					<Text style={[styles.loadingText, { color: colors.textSecondary }]}>
						Loading posts...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<View style={[styles.header, { borderColor: colors.border }]}>
				<Logo />
				<ThemeSwitcher />
			</View>
			{allPosts.length === 0 ? (
				<View style={styles.centerContainer}>
					<Text style={[styles.emptyText, { color: colors.textSecondary }]}>
						No posts yet
					</Text>
					<Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
						Be the first to share something!
					</Text>
				</View>
			) : (
				<FlatList
					data={allPosts}
					keyExtractor={(item) => `${user?.id}-${item.id}`}
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
	},
	header: {
		borderBottomWidth: 1,
		paddingVertical: 10,
		paddingStart: 4,
		paddingEnd: 24,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	loadingText: {
		fontSize: 16,
		marginTop: 12,
	},
});
