import React, { createContext, useState, useContext, useCallback } from "react";
import { Post } from "../types";
import { postService } from "../services/posts";
import { savedPostsService } from "../services/likes";

interface PostsContextType {
	allPosts: Post[];
	userPosts: Post[];
	savedPosts: Post[];
	loading: boolean;
	loadAllPosts: () => Promise<void>;
	loadUserPosts: (userId: string) => Promise<void>;
	loadSavedPosts: (userId: string) => Promise<void>;
	updatePostLike: (postId: string, liked: boolean, count: number) => void;
	updatePostSave: (postId: string, saved: boolean) => void;
	removePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
	const [allPosts, setAllPosts] = useState<Post[]>([]);
	const [userPosts, setUserPosts] = useState<Post[]>([]);
	const [savedPosts, setSavedPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);

	const loadAllPosts = useCallback(async () => {
		try {
			setLoading(true);
			const posts = await postService.fetchPosts();
			setAllPosts(posts);
		} catch (error) {
			console.error("Error loading posts:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadUserPosts = useCallback(async (userId: string) => {
		try {
			setLoading(true);
			const posts = await postService.fetchUserPosts(userId);
			setUserPosts(posts);
		} catch (error) {
			console.error("Error loading user posts:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadSavedPosts = useCallback(async (userId: string) => {
		try {
			const posts = await savedPostsService.getUserSavedPosts(userId);
			setSavedPosts(posts);
		} catch (error) {
			console.error("Error loading saved posts:", error);
		}
	}, []);

	const updatePostLike = useCallback(
		(postId: string, liked: boolean, count: number) => {
			// Update in all posts
			setAllPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? { ...post, is_liked: liked, like_count: count }
						: post
				)
			);
			// Update in user posts
			setUserPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? { ...post, is_liked: liked, like_count: count }
						: post
				)
			);
			// Update in saved posts
			setSavedPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? { ...post, is_liked: liked, like_count: count }
						: post
				)
			);
		},
		[]
	);

	const updatePostSave = useCallback((postId: string, saved: boolean) => {
		// Update save status in all posts
		setAllPosts((prev) =>
			prev.map((post) =>
				post.id === postId ? { ...post, is_saved: saved } : post
			)
		);
		setUserPosts((prev) =>
			prev.map((post) =>
				post.id === postId ? { ...post, is_saved: saved } : post
			)
		);

		// Remove from saved posts if unsaved
		if (!saved) {
			setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
		}
	}, []);

	const removePost = useCallback((postId: string) => {
		setAllPosts((prev) => prev.filter((post) => post.id !== postId));
		setUserPosts((prev) => prev.filter((post) => post.id !== postId));
		setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
	}, []);

	return (
		<PostsContext.Provider
			value={{
				allPosts,
				userPosts,
				savedPosts,
				loading,
				loadAllPosts,
				loadUserPosts,
				loadSavedPosts,
				updatePostLike,
				updatePostSave,
				removePost,
			}}
		>
			{children}
		</PostsContext.Provider>
	);
}

export function usePosts() {
	const context = useContext(PostsContext);
	if (!context) {
		throw new Error("usePosts must be used within PostsProvider");
	}
	return context;
}
