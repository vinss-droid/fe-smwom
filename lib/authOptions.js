import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('No credentials provided');
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data = await res.json();
                    console.log("Backend Response:", data);

                    if (res.ok && data.status) {
                        if (data.user.level === 'user') {
                            throw new Error(user.message || 'You don\'t have permission to access this page.');
                        } else {
                            return {
                                name: data.user.name,
                                role: data.user.role,
                                token: data.token,
                            };
                        }
                    } else {
                        throw new Error(user.message || 'Login failed');
                    }
                } catch (error) {
                    console.error('Error in credentials authorization:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.role = user.role;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    name: token.name,
                    role: token.role,
                    token: token.token,
                };
            }
            return session;
        },
    },
};