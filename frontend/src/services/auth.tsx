// // frontend/src/services/auth.ts
// import {
//   useContext,
//   useState,
//   useEffect,
//   createContext,
//   ReactNode,
// } from "react";
// import { Session, User } from "@supabase/supabase-js";
// import { supabase } from "../supabaseClient"; // Ensure this path is correct

// interface AuthContextType {
//   session: Session | null;
//   user: User | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInitialSession = async () => {
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.getSession();
//       if (error) {
//         console.error("Error fetching session:", error);
//       }
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     };

//     fetchInitialSession();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, newSession) => {
//         setSession(newSession);
//         setUser(newSession?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => {
//       if (listener && listener.subscription) {
//         listener.subscription.unsubscribe();
//       }
//     };
//   }, []);

//   const value = {
//     session,
//     user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// frontend/src/services/auth.ts
import {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import apiClient from "./apiClient"; // Make sure this is imported

interface Profile {
  id: string;
  name: string;
  role_id: string;
  role: { name: string };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null; // ADDED: The user's profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null); // ADDED: Profile state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // ADDED: Fetch the user's profile with their role
        try {
          const { data, error } = await apiClient.get<Profile>(
            `/profiles/${session.user.id}`
          );
          if (error) throw error;
          setProfile(data);
        } catch (err: any) {
          console.error("Error fetching user profile:", err.message);
          setProfile(null);
        }
      }

      setLoading(false);
    };

    fetchAuthData();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      if (listener && listener.subscription) {
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  const value = {
    session,
    user,
    profile, // ADDED: Pass the profile to the context
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
