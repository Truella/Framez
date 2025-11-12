import { supabase } from "../config/supabase";

export const likesService = {
	// Toggle like on a post
	toggleLike: async (
		userId: string,
		postId: string
	): Promise<{ liked: boolean; count: number } | null> => {
		try {
			// Check if already liked
			const { data: existingLike } = await supabase
				.from("likes")
				.select("id")
				.eq("user_id", userId)
				.eq("post_id", postId)
				.maybeSingle();

			if (existingLike) {
				// Unlike
				const { error } = await supabase
					.from("likes")
					.delete()
					.eq("id", existingLike.id);

				if (error) throw error;

				// Get updated count
				const { count } = await supabase
					.from("likes")
					.select("*", { count: "exact", head: true })
					.eq("post_id", postId);

				return { liked: false, count: count || 0 };
			} else {
				// Like
				const { error } = await supabase.from("likes").insert({
					user_id: userId,
					post_id: postId,
				});

				if (error) throw error;

				// Get updated count
				const { count } = await supabase
					.from("likes")
					.select("*", { count: "exact", head: true })
					.eq("post_id", postId);

				return { liked: true, count: count || 0 };
			}
		} catch (error) {
			console.error("Toggle like error:", error);
			return null;
		}
	},

	// Get like count for a post
	getLikeCount: async (postId: string): Promise<number> => {
		try {
			const { count, error } = await supabase
				.from("likes")
				.select("*", { count: "exact", head: true })
				.eq("post_id", postId);

			if (error) throw error;
			return count || 0;
		} catch (error) {
			console.error("Get like count error:", error);
			return 0;
		}
	},

	// Check if user has liked a post
	hasUserLiked: async (userId: string, postId: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase
				.from("likes")
				.select("id")
				.eq("user_id", userId)
				.eq("post_id", postId)
				.maybeSingle();

			if (error) throw error;
			return !!data;
		} catch (error) {
			console.error("Check if liked error:", error);
			return false;
		}
	},

	// Get posts liked by a user
	getUserLikedPosts: async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("likes")
				.select(
					`
					post_id,
					posts (
						*,
						profiles (
							id,
							username,
							full_name,
							avatar_url
						)
					)
				`
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Transform the data structure
			return data?.map((item: any) => item.posts).filter(Boolean) || [];
		} catch (error) {
			console.error("Get user liked posts error:", error);
			return [];
		}
	},
};

export const savedPostsService = {
	// Toggle save on a post
	toggleSave: async (
		userId: string,
		postId: string
	): Promise<boolean | null> => {
		try {
			// Check if already saved
			const { data: existingSave } = await supabase
				.from("saved_posts")
				.select("id")
				.eq("user_id", userId)
				.eq("post_id", postId)
				.maybeSingle();

			if (existingSave) {
				// Unsave
				const { error } = await supabase
					.from("saved_posts")
					.delete()
					.eq("id", existingSave.id);

				if (error) throw error;
				return false;
			} else {
				// Save
				const { error } = await supabase.from("saved_posts").insert({
					user_id: userId,
					post_id: postId,
				});

				if (error) throw error;
				return true;
			}
		} catch (error) {
			console.error("Toggle save error:", error);
			return null;
		}
	},

	// Check if user has saved a post
	hasUserSaved: async (userId: string, postId: string): Promise<boolean> => {
		try {
			const { data, error } = await supabase
				.from("saved_posts")
				.select("id")
				.eq("user_id", userId)
				.eq("post_id", postId)
				.maybeSingle();

			if (error) throw error;
			return !!data;
		} catch (error) {
			console.error("Check if saved error:", error);
			return false;
		}
	},

	// Get saved posts by a user
	getUserSavedPosts: async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("saved_posts")
				.select(
					`
					post_id,
					posts (
						*,
						profiles (
							id,
							username,
							full_name,
							avatar_url
						),
						likes!left(user_id),
						saved_posts!left(user_id)
					)
				`
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			// Transform and add computed fields (consistent with fetchPosts)
			const posts = (data || [])
				.map((item: any) => item.posts)
				.filter(Boolean)
				.map((post: any) => ({
					...post,
					like_count: post.likes?.length || 0,
					is_liked:
						post.likes?.some((like: any) => like.user_id === userId) || false,
					is_saved: true, // All fetched saved posts are saved by definition
				}));

			return posts;
		} catch (error) {
			console.error("Get user saved posts error:", error);
			return [];
		}
	},
};
