import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { likeService } from "../services/likes";
const LikeButton = ({ post, user, onLikeToggle }) => {
	const [isLiked, setIsLiked] = useState(post.isLiked);
	const [likeCount, setLikeCount] = useState(post.likeCount);
	const [loading, setLoading] = useState(false);

	const handleLike = async () => {
		if (!user?.id || loading) return;

		setLoading(true);
		const newLikedState = !isLiked;

		// ✅ Optimistic update
		setIsLiked(newLikedState);
		setLikeCount((prev) => prev + (newLikedState ? 1 : -1));

		// ✅ Supabase request
		const { success, liked } = await likeService.toggleLike(user.id, post.id);

		if (!success) {
			// ❌ Revert if failed
			setIsLiked(!newLikedState);
			setLikeCount((prev) => prev + (newLikedState ? -1 : 1));
		} else {
			onLikeToggle?.(post.id, liked);
		}

		setLoading(false);
	};

	return (
		<button
			onClick={handleLike}
			disabled={loading}
			className="flex items-center gap-2"
		>
			<FontAwesome
				name="heart"
				size={24}
				fill={isLiked ? "red" : "none"}
				color={isLiked ? "red" : "gray"}
				className="transition-all duration-200 hover:scale-110"
			/>
			<span>{likeCount}</span>
		</button>
	);
};

export default LikeButton;
