import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../config/supabase";
import { User, AuthContextType } from "../types";
import { Alert } from "react-native";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check active session
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				fetchUserProfile(session.user.id);
			} else {
				setLoading(false);
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) {
				fetchUserProfile(session.user.id);
			} else {
				setUser(null);
				setLoading(false);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const fetchUserProfile = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.maybeSingle();

			if (error) throw error;

			if (!data) {
				Alert.alert("Error", "Profile not found. Please contact support.");
				await supabase.auth.signOut();
				return;
			}

			setUser(data);
		} catch (error: any) {
			console.error("Error fetching profile:", error.message);
			Alert.alert("Error", "Failed to load profile.");
			await supabase.auth.signOut();
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (
		email: string,
		password: string,
		username: string,
		fullName: string
	) => {
		try {
			setLoading(true);

			// Check if username is already taken
			const { data: existingUsername } = await supabase
				.from("profiles")
				.select("username")
				.eq("username", username.toLowerCase())
				.maybeSingle();

			if (existingUsername) {
				Alert.alert("Error", "Username is already taken");
				return;
			}

			// Sign up the user
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
			});

			if (authError) throw authError;
			if (!authData.user) throw new Error("No user returned from signup");

			// Wait for auth to settle
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Create profile
			const { error: profileError } = await supabase.from("profiles").insert({
				id: authData.user.id,
				email: email,
				username: username.toLowerCase(),
				full_name: fullName,
			});

			if (profileError) throw profileError;

			Alert.alert(
				"Success",
				"Account created successfully! You can now log in."
			);
		} catch (error: any) {
			console.error("Signup error:", error);
			Alert.alert("Signup Error", error.message || "Failed to create account");
		} finally {
			setLoading(false);
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			setLoading(true);

			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
		} catch (error: any) {
			Alert.alert("Login Error", error.message);
		} finally {
			setLoading(false);
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error: any) {
			Alert.alert("Error", error.message);
		}
	};

	return (
		<AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
