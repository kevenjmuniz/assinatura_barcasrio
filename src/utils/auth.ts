
// Simple authentication utility for admin panel
interface User {
  username: string;
  password: string;
}

// Admin credentials
const ADMIN_CREDENTIALS: User = {
  username: "Administrator",
  password: "Barcas@2025*"
};

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("admin_authenticated") === "true";
};

// Login function
export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem("admin_authenticated", "true");
    return true;
  }
  return false;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem("admin_authenticated");
};
