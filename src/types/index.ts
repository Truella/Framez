export interface User {
	id: string;
	email: string;
    username: string;
	full_name?: string;
    bio?: string;
	avatar_url?: string;
	created_at: string;
    updated_at: string;
}

export interface Post {
	id: string;
	user_id: string;
	content: string;
	image_url?: string;
	created_at: string;
	profiles?: User; // For joined queries
}

export interface AuthContextType {
	user: User | null;
	loading: boolean;
	signUp: (email: string, password: string, username:string, fullName: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}
