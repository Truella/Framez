import { supabase } from "../config/supabase";
import * as FileSystem from "expo-file-system/legacy";

import * as ImageManipulator from "expo-image-manipulator";
import { Post } from "../types";

export const postService = {
	// Upload image to Supabase Storage
	uploadImage: async (uri: string, userId: string): Promise<string | null> => {
		try {
			console.log("🔵 Starting image upload...");

			// Compress image first
			const manipulatedImage = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 1080 } }], // Max width like Instagram
				{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
			);

			// Read file as base64
			const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
				encoding: "base64", // Changed from FileSystem.EncodingType.Base64
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
				console.error("❌ Upload error:", error);
				throw error;
			}

			// Get public URL
			const {
				data: { publicUrl },
			} = supabase.storage.from("post-images").getPublicUrl(fileName);

			console.log("✅ Image uploaded:", publicUrl);
			return publicUrl;
		} catch (error) {
			console.error("Image upload error:", error);
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
			const { data, error } = await supabase
				.from("posts")
				.insert({
					user_id: userId,
					content,
					image_url: imageUrl,
				})
				.select(
					`
          *,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `
				)
				.single();

			if (error) throw error;

			console.log("✅ Post created:", data);
			return data as Post;
		} catch (error) {
			console.error("Create post error:", error);
			return null;
		}
	},

	// Fetch all posts (feed)
	fetchPosts: async (): Promise<Post[]> => {
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
          )
        `
				)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return (data as Post[]) || [];
		} catch (error) {
			console.error("Fetch posts error:", error);
			return [];
		}
	},

	// Fetch posts by specific user
	fetchUserPosts: async (userId: string): Promise<Post[]> => {
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
          )
        `
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return (data as Post[]) || [];
		} catch (error) {
			console.error("Fetch user posts error:", error);
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
			console.error("Delete post error:", error);
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
