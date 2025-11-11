import { TextInput } from "react-native";
export const handleInputNext = (inputRef: React.RefObject<TextInput | null>) => {
	setTimeout(() => {
		inputRef.current?.focus();
	}, 100);
};