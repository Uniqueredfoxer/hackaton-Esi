// Minimal mock auth service. Replace with real backend calls (Supabase, Firebase, etc.).
// API:
// - signIn({email, password}) => resolves on success, rejects with Error on failure
// - signUp({name, email, password}) => resolves on success, rejects on failure
// - signOut() => resolves

const simulateNetwork = (result, ms = 700) =>
  new Promise((res) => setTimeout(() => res(result), ms));

export async function signIn({ email, password }) {
  // Basic client-side checks
  if (!email || !password) throw new Error("Email et mot de passe requis.");

  // TODO: Replace this simulation with real authentication (e.g., Supabase auth call)
  // Example with supabase-js: await supabase.auth.signInWithPassword({ email, password })

  // Very simple mocked logic for dev/demo: accept any password with '@' in email
  if (!email.includes("@")) {
    await simulateNetwork(null);
    throw new Error("Adresse e-mail invalide.");
  }

  // simulate wrong-password for password 'wrong'
  if (password === "wrong") {
    await simulateNetwork(null);
    throw new Error("Mot de passe incorrect.");
  }

  return simulateNetwork({ id: "user_mock_id", email });
}

export async function signUp({ name, email, password }) {
  if (!name || !email || !password) throw new Error("Tous les champs sont requis.");
  if (!email.includes("@")) throw new Error("Adresse e-mail invalide.");
  if (password.length < 6) throw new Error("Le mot de passe doit contenir au moins 6 caractères.");

  // TODO: Replace with real sign-up call to your backend
  // Example with supabase-js: await supabase.auth.signUp({ email, password }, { data: { name } })

  // Simulate existing user
  if (email === "already@taken.com") {
    await simulateNetwork(null);
    throw new Error("Un compte existe déjà pour cette adresse e-mail.");
  }

  return simulateNetwork({ id: "new_user_mock_id", email, name });
}

export async function signOut() {
  // TODO: call real signOut method on backend if needed
  return simulateNetwork(true, 300);
}

export default { signIn, signUp, signOut };
