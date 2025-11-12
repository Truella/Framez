import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../config/supabase";
import { User, AuthContextType } from "../types";
import { showToast } from "../utils/toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticating, setIsAuthenticating] = useState(false);

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
				showToast.error("Error", "Profile not found. Please contact support.");
				await supabase.auth.signOut();
				return;
			}

			setUser(data);
		} catch (error: any) {
			showToast.error("Error", "Failed to load profile.");
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
			setIsAuthenticating(true);
			const { data: authData, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username: username.toLowerCase(),
						full_name: fullName,
					},
				},
			});

			if (authError) throw authError;
			if (!authData.user) throw new Error("No user returned from signup");
			showToast.success("Success", "Account created successfully!");
		} catch (error: any) {
			showToast.error("Signup error:", error);

			// Check for duplicate username/email errors
			if (
				error.message?.includes("duplicate") ||
				error.message?.includes("username") ||
				error.message?.includes("profiles_username_key")
			) {
				showToast.error("Error", "Username or email is already taken");
			} else {
				showToast.error(
					"Signup Error",
					error.message || "Failed to create account"
				);
			}
		} finally {
			setIsAuthenticating(false);
		}
	};
	const signIn = async (email: string, password: string) => {
		try {
			setIsAuthenticating(true);
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) throw error;
		} catch (error: any) {
			showToast.error("Login Error", error.message);
		} finally {
			setIsAuthenticating(false);
		}
	};

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			setUser(null);
		} catch (error: any) {
			showToast.error("Error", error.message);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, userId: user?.id, loading, signUp, signIn, signOut , isAuthenticating}}
		>
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
