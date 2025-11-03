import supabase from "./supabase.js";

export const signUp = async (username, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: "https://hackaton-esi.vercel.app/confirm-email",
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const SignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Signed out successfully" };
};

export const getUserRole = async (userId) => {
  const { data } = await supabase
    .from("user")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role;
};
