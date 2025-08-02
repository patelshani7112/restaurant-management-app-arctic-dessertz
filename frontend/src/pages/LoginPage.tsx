// frontend/src/pages/LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../services/auth";
import { supabase } from "../supabaseClient";

function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          view="sign_in" // <-- This explicitly forces the 'Sign In' view
          onlyThirdPartyProviders={false} // <-- Ensures email/password form is shown
          localization={{
            variables: {
              sign_in: {
                email_label: "Staff Email",
                password_label: "Staff Password",
                button_label: "Sign In",
                email_input_placeholder: "Your Email",
                password_input_placeholder: "Your Password",
                link_text: "Already have an account? Sign In",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default LoginPage;
