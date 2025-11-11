import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { postService } from "../../services/posts";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import { showToast } from "../../utils/toast";
import { useTheme } from "../../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

export default function CreatePostScreen() {
	const [content, setContent] = useState("");
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const navigation = useNavigation();
	const { colors } = useTheme();
	const pickImage = async () => {
		try {
			// Request permission
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status !== "granted") {
				showToast.info(
					"Permission needed",
					"Please allow access to your photos"
				);
				return;
			}

			// Launch image picker
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.8,
			});

			if (!result.canceled && result.assets?.[0]) {
				setImageUri(result.assets[0].uri);
			}
		} catch (error) {
			console.error("Error picking image:", error);
			showToast.error("Error", "Failed to pick image");
		}
	};

	const removeImage = () => {
		setImageUri(null);
	};

	const handleCreatePost = async () => {
		if (!content.trim() && !imageUri) {
			showToast.error("Error", "Please add some content or an image");
			return;
		}

		if (!user?.id) {
			showToast.error("Error", "You must be logged in to create a post");
			return;
		}

		try {
			setLoading(true);

			const post = await postService.createPost(
				user.id,
				content.trim(),
				imageUri || undefined
			);

			if (post) {
				showToast.success("Success", "Post created successfully!");
				setContent("");
				setImageUri(null);

				// Navigate back to feed
				navigation.navigate("Feed" as never);
			} else {
				showToast.error("Error", "Failed to create post");
			}
		} catch (error) {
			console.error("Create post error:", error);
			showToast.error("Error", "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.background }]}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				{/* Header */}
				<View style={[styles.header,{borderColor:colors.border}]}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Text style={[styles.cancelText, { color: colors.textSecondary }]}>
							Cancel
						</Text>
					</TouchableOpacity>
					<Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
						New Post
					</Text>
					<TouchableOpacity
						onPress={handleCreatePost}
						disabled={loading || (!content.trim() && !imageUri)}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#3897f0" />
						) : (
							<Text
								style={[
									styles.postText,
									!content.trim() && !imageUri && styles.postTextDisabled,
								]}
							>
								Post
							</Text>
						)}
					</TouchableOpacity>
				</View>

				<ScrollView style={styles.content}>
					{/* Text Input */}
					<TextInput
						style={[styles.input, { color: colors.textSecondary }]}
						placeholder="What's on your mind?"
						placeholderTextColor={colors.textTertiary}
						value={content}
						onChangeText={setContent}
						multiline
						maxLength={500}
						editable={!loading}
					/>

					{/* Image Preview */}
					{imageUri && (
						<View style={styles.imageContainer}>
							<Image source={{ uri: imageUri }} style={styles.image} />
							<TouchableOpacity
								style={styles.removeImageButton}
								onPress={removeImage}
							>
								<Text style={styles.removeImageText}>✕</Text>
							</TouchableOpacity>
						</View>
					)}

					{/* Add Image Button */}
					{!imageUri && (
						<TouchableOpacity onPress={pickImage} disabled={loading}>
							<LinearGradient
								colors={[colors.gradientStart, colors.gradientEnd]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								style={styles.addImageButton}
							>
								<Entypo name="image" size={24} color="#ffffff" />
								<Text
									style={[styles.addImageText, { color: "#ffffff"}]}
								>
									Add Photo
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					)}

					{/* Character Count */}
					<Text style={styles.charCount}>{content.length}/500</Text>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 12,
		borderBottomWidth: 1,
	},
	cancelText: {
		fontSize: 16,
	},
	headerTitle: {
		fontSize: 16,
		fontWeight: "600",
	},
	postText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#3897f0",
	},
	postTextDisabled: {
		color: "#b4d7f5",
	},
	content: {
		flex: 1,
		padding: 15,
	},
	input: {
		fontSize: 16,
		minHeight: 100,
		textAlignVertical: "top",
	},
	imageContainer: {
		marginTop: 20,
		position: "relative",
	},
	image: {
		width: "100%",
		height: 300,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	removeImageButton: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "rgba(0,0,0,0.6)",
		width: 30,
		height: 30,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	removeImageText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	addImageButton: {
		marginTop: 20,
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		gap: 4
	},
	addImageText: {
		fontSize: 16,
	},
	charCount: {
		marginTop: 20,
		textAlign: "right",
		fontSize: 12,
	},
});
