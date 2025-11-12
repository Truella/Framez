import React, {
	createContext,
	useState,
	useContext,
	useCallback,
	useMemo,
	useEffect,
	useRef, // Used for stable caching check
} from "react";
import { Post } from "../types";
import { postService } from "../services/posts";
import { savedPostsService } from "../services/likes";
import { useAuth } from "./AuthContext";
// Assuming showToast is available from utils/toast

interface PostsContextType {
	allPosts: Post[];
	userPosts: Post[];
	savedPosts: Post[];
	loading: boolean;
	lastFetchedAt: number | null;
	loadAllPosts: (userId?: string, force?: boolean) => Promise<void>;
	loadUserPosts: (userId: string, currentUserId?: string) => Promise<void>;
	loadSavedPosts: (userId: string) => Promise<void>;
	addPost: (post: Post) => void;
	updatePostLike: (postId: string, liked: boolean, count: number) => void;
	updatePostSave: (postId: string, saved: boolean, post?: Post) => void;
	removePost: (postId: string) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
	const { user, loading: authLoading } = useAuth();
	const [allPosts, setAllPosts] = useState<Post[]>([]);
	const [userPosts, setUserPosts] = useState<Post[]>([]);
	const [savedPosts, setSavedPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

	// Ref to hold the mutable lastFetchedAt value for stable caching checks
	const lastFetchedAtRef = useRef<number | null>(null);

	// Sync the state value into the ref whenever it changes
	useEffect(() => {
		lastFetchedAtRef.current = lastFetchedAt;
	}, [lastFetchedAt]);

	// --- Core Fetching Functions ---

	const loadAllPosts = useCallback(
		async (currentUserId?: string, force = false) => {
			// Caching logic
			const MIN_TIME_BETWEEN_FETCHES = 1000 * 60; // 1 minute
			const currentLastFetchedAt = lastFetchedAtRef.current;

			if (
				!force &&
				currentLastFetchedAt &&
				Date.now() - currentLastFetchedAt < MIN_TIME_BETWEEN_FETCHES
			) {
				return;
			}


			setLoading(true);

			try {
				const posts = await postService.fetchPosts(currentUserId);
				setAllPosts(posts);
				setLastFetchedAt(Date.now());
			} catch (error) {
				console.error("Error loading all posts:", error);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const loadUserPosts = useCallback(
		async (userId: string, currentUserId?: string) => {
			setLoading(true);
			try {
				const posts = await postService.fetchUserPosts(userId, currentUserId);
				setUserPosts(posts);
			} catch (error) {
				console.error("Error loading user posts:", error);
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	const loadSavedPosts = useCallback(async (userId: string) => {
		setLoading(true);
		try {
			const posts = await savedPostsService.getUserSavedPosts(userId);
			setSavedPosts(posts);
		} catch (error) {
			console.error("Error loading saved posts:", error);
			setSavedPosts([]); // Set empty on error
		} finally {
			setLoading(false);
		}
	}, []);
	useEffect(() => {
		if (!authLoading) {
			

			// Clear stale data and show loading
			setAllPosts([]);
			setUserPosts([]);
			setSavedPosts([]);
			setLastFetchedAt(null);
			setLoading(true);

			// Fetch new data
			loadAllPosts(user?.id, true).finally(() => {
				setLoading(false); 
			});
		}
	}, [authLoading, user?.id, loadAllPosts]);
	
	const addPost = useCallback((post: Post) => {
		setAllPosts((prev) => [post, ...prev]);
		setUserPosts((prev) => [post, ...prev]);
	}, []);

	const updatePostLike = useCallback(
		(postId: string, liked: boolean, count: number) => {
			const updateFn = (p: Post) =>
				p.id === postId ? { ...p, is_liked: liked, like_count: count } : p;

			setAllPosts((prev) => prev.map(updateFn));
			setUserPosts((prev) => prev.map(updateFn));
			setSavedPosts((prev) => prev.map(updateFn));
		},
		[]
	);

	const updatePostSave = useCallback(
		(postId: string, saved: boolean, post?: Post) => {
			const updateFn = (p: Post) =>
				p.id === postId ? { ...p, is_saved: saved } : p;

			setAllPosts((prev) => prev.map(updateFn));
			setUserPosts((prev) => prev.map(updateFn));

			if (saved && post) {
				setSavedPosts((prev) => {
					// Prevent duplicates
					if (prev.some((p) => p.id === postId)) return prev;
					return [{ ...post, is_saved: true }, ...prev];
				});
			} else if (!saved) {
				// Remove from saved posts when unsaving
				setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
			}
		},
		[]
	);

	const removePost = useCallback((postId: string) => {
		setAllPosts((prev) => prev.filter((post) => post.id !== postId));
		setUserPosts((prev) => prev.filter((post) => post.id !== postId));
		setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
	}, []);

	const value = useMemo(
		() => ({
			allPosts,
			userPosts,
			savedPosts,
			loading,
			lastFetchedAt,
			loadAllPosts,
			loadUserPosts,
			loadSavedPosts,
			addPost,
			updatePostLike,
			updatePostSave,
			removePost,
		}),
		[
			allPosts,
			userPosts,
			savedPosts,
			loading,
			lastFetchedAt,
			loadAllPosts,
			loadUserPosts,
			loadSavedPosts,
			addPost,
			updatePostLike,
			updatePostSave,
			removePost,
		]
	);

	return (
		<PostsContext.Provider value={value}>{children}</PostsContext.Provider>
	);
}

export const usePosts = () => {
	const context = useContext(PostsContext);
	if (!context) {
		throw new Error("usePosts must be used within a PostsProvider");
	}
	return context;
};
