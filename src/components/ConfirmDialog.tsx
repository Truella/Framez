import React from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Pressable,
	ActivityIndicator,
} from "react-native";
import { colors } from "../theme/colors";

interface ConfirmDialogProps {
	visible: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void | Promise<void>;
	onCancel: () => void;
	destructive?: boolean;
	loading?: boolean;
}

export default function ConfirmDialog({
	visible,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
	destructive = false,
	loading = false,
}: ConfirmDialogProps) {
	const handleConfirm = async () => {
		await onConfirm();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
			statusBarTranslucent
		>
			<Pressable
				style={styles.backdrop}
				onPress={loading ? undefined : onCancel}
			>
				<Pressable
					style={styles.container}
					onPress={(e) => e.stopPropagation()}
				>
					<View style={styles.dialog}>
						<Text style={styles.title}>{title}</Text>
						<Text style={styles.message}>{message}</Text>

						<View style={styles.buttons}>
							<TouchableOpacity
								style={[styles.button, styles.cancelButton]}
								onPress={onCancel}
								disabled={loading}
							>
								<Text
									style={[styles.cancelText, loading && styles.disabledText]}
								>
									{cancelText}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.button,
									destructive ? styles.destructiveButton : styles.confirmButton,
									loading && styles.disabledButton,
								]}
								onPress={handleConfirm}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator color="#fff" size="small" />
								) : (
									<Text style={styles.confirmText}>{confirmText}</Text>
								)}
							</TouchableOpacity>
						</View>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		width: "85%",
		maxWidth: 360,
	},
	dialog: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: colors.textPrimary,
		marginBottom: 12,
		textAlign: "center",
	},
	message: {
		fontSize: 15,
		color: colors.textSecondary,
		lineHeight: 22,
		marginBottom: 24,
		textAlign: "center",
	},
	buttons: {
		flexDirection: "row",
		gap: 12,
	},
	button: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		minHeight: 48,
	},
	cancelButton: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
	confirmButton: {
		backgroundColor: colors.primary,
	},
	destructiveButton: {
		backgroundColor: colors.error,
	},
	disabledButton: {
		opacity: 0.6,
	},
	cancelText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	confirmText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
	},
	disabledText: {
		opacity: 0.5,
	},
});
