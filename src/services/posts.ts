import { supabase } from "../config/supabase";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import { Post } from "../types";
import { showToast } from "../utils/toast";

export const postService = {
	// Upload image to Supabase Storage
	uploadImage: async (uri: string, userId: string): Promise<string | null> => {
		try {
			// Compress image first
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 1080 } }],
				{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
			);

			// Read file as base64
			const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
				encoding: "base64",
			});

			// Create unique filename
			const fileExt = "jpg";
			const fileName = `${userId}/${Date.now()}.${fileExt}`;

			// Convert base64 to ArrayBuffer
			const arrayBuffer = decode(base64);

			// Upload to Supabase
			const { data, error } = await supabase.storage
				.from("post-images")
				.upload(fileName, arrayBuffer, {
					contentType: "image/jpeg",
					upsert: false,
				});

			if (error) {
				showToast.error(`Upload error ${error}`);
				throw error;
			}

			// Get public URL
			const {
				data: { publicUrl },
			} = supabase.storage.from("post-images").getPublicUrl(fileName);

			return publicUrl;
		} catch (error) {
			return null;
		}
	},

	// Create a new post
	createPost: async (
		userId: string,
		content: string,
		imageUri?: string
	): Promise<Post | null> => {
		try {
			let imageUrl: string | null = null;

			// Upload image if provided
			if (imageUri) {
				imageUrl = await postService.uploadImage(imageUri, userId);
				if (!imageUrl) {
					throw new Error("Failed to upload image");
				}
			}

			// Insert post into database
			const { data: insertedPost, error: insertError } = await supabase
				.from("posts")
				.insert({
					user_id: userId,
					content,
					image_url: imageUrl,
				})
				.select("id")
				.single();

			if (insertError) throw insertError;
			const { data, error } = await supabase
				.from("posts")
				.select(
					`
					*,
					profiles (
						id,
						username,
						full_name,
						avatar_url
					),
					likes!left(user_id),
					saved_posts!left(user_id)
				`
				)
				.eq("id", insertedPost.id)
				.single();

			if (error) throw error;
			const post: Post = {
				...data,
				like_count: data.likes?.length || 0,
				is_liked:
					data.likes?.some((like: any) => like.user_id === userId) || false,
				is_saved:
					data.saved_posts?.some((save: any) => save.user_id === userId) ||
					false,
			};

			return post;
		} catch (error) {
			showToast.error(`Create post error: ${error}`);
			return null;
		}
	},

	// Fetch all posts (feed)
	fetchPosts: async (userId?: string): Promise<Post[]> => {
		try {
			let query = supabase
				.from("posts")
				.select(
					`
					*,
					profiles (
						id,
						username,
						full_name,
						avatar_url
					),
					likes!left(user_id),
					saved_posts!left(user_id)
				`
				)
				.order("created_at", { ascending: false });

			const { data, error } = await query;

			if (error) throw error;

			// Process the data to add computed fields
			const posts = (data || []).map((post: any) => {
				const isLiked = userId
					? post.likes?.some((like: any) => like.user_id === userId)
					: false;
				return {
					...post,
					like_count: post.likes?.length || 0,
					is_liked: isLiked,
					is_saved: userId
						? post.saved_posts?.some((save: any) => save.user_id === userId)
						: false,
				};
			});
			return posts as Post[];
		} catch (error) {
			showToast.error(`Fetch posts error: ${error}`);
			return [];
		}
	},

	// Fetch posts by specific user
	fetchUserPosts: async (
		userId: string,
		currentUserId?: string
	): Promise<Post[]> => {
		try {
			const { data, error } = await supabase
				.from("posts")
				.select(
					`
					*,
					profiles (
						id,
						username,
						full_name,
						avatar_url
					),
					likes!left(user_id),
					saved_posts!left(user_id)
				`
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			const posts = (data || []).map((post: any) => ({
				...post,
				like_count: post.likes?.length || 0,
				is_liked: currentUserId
					? post.likes?.some((like: any) => like.user_id === currentUserId)
					: false,
				is_saved: currentUserId
					? post.saved_posts?.some(
							(save: any) => save.user_id === currentUserId
					  )
					: false,
			}));

			return posts as Post[];
		} catch (error) {
			return [];
		}
	},

	// Delete a post
	deletePost: async (postId: string, imageUrl?: string): Promise<boolean> => {
		try {
			// Delete image from storage if exists
			if (imageUrl) {
				const path = imageUrl.split("/post-images/")[1];
				if (path) {
					await supabase.storage.from("post-images").remove([path]);
				}
			}

			// Delete post from database
			const { error } = await supabase.from("posts").delete().eq("id", postId);

			if (error) throw error;

			return true;
		} catch (error) {
			return false;
		}
	},
};

// Helper function to decode base64 to ArrayBuffer
function decode(base64: string): ArrayBuffer {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}
