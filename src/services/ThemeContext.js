import React, { createContext, useState, useContext, useEffect } from "react";

// Create a theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved theme preference in localStorage
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // Track when theme changes to trigger animations
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Apply theme class to body
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";

    // Set transitioning state to true for animations
    setIsTransitioning(true);

    // Reset transitioning state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with CSS transition duration

    return () => clearTimeout(timer);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
