import supabase from "./supabase";

const adjectives = [
  "Hivernal",
  "Gélatineux",
  "Invisible",
  "Cyborg",
  "Automate",
  "Fractal",
  "Rouillé",
  "Cynique",
  "Surréaliste",
  "Ironique",
  "Égaré",
  "Spectral",
  "Minuscule",
  "Ténébreux",
  "Vibrant",
  "Volatile",
  "Brumeux",
  "Mutant",
  "Cosmique",
  "Délirant",
  "Sarcastique",
  "Fantomatique",
  "Chill",
  "Quantique",
  "Lunatique",
  "Bizarre",
  "Sismique",
  "Électrique",
  "Néon",
  "Céleste",
  "Sombre",
  "Douteux",
  "Fauve",
];

const nouns = [
  "Casserole",
  "Bibelot",
  "Narval",
  "Axolotl",
  "Pénombre",
  "Vortex",
  "Atome",
  "Hélice",
  "Cactus",
  "Escargot",
  "Troll",
  "Pigeon",
  "Philosophe",
  "Lapin",
  "Cyborg",
  "Rat",
  "Dragon",
  "Sorcier",
  "Panda",
  "Biscuit",
  "Crâne",
  "Nuage",
  "Robot",
  "Canard",
  "Alien",
  "Serveur",
  "Mutant",
  "Gaufre",
  "Gobelin",
  "Atomiseur",
  "Phénix",
  "Octopus",
];

const isUsernameAvailable = async (username) => {
  if (!username || username.trim().length < 3) {
    return false; // Invalid username
  }

  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("username", username.trim().toLowerCase()); // Case-insensitive

    if (error) throw error;

    return count === 0;
  } catch (error) {
    console.error("Username check failed:", error);
    return false; // On error, assume username is taken (safer)
  }
};

export const generateUsername = async () => {
  let username = "";
  let isAvailable = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isAvailable && attempts < maxAttempts) {
    const adj =
      adjectives[Math.floor(Math.random() * adjectives.length)].toLowerCase();
    const noun = nouns[Math.floor(Math.random() * nouns.length)].toLowerCase();
    const number = Math.floor(Math.random() * 99) + 1; // 1 à 99

    username = `${noun}_${adj}${number}`;

    isAvailable = await isUsernameAvailable(username);
    attempts++;
  }

  if (!isAvailable) {
    throw new Error(
      "Impossible de générer un pseudo unique après 10 tentatives.",
    );
  }

  return username;
};
