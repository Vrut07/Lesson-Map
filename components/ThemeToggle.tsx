import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()
  return (
    <Button
      variant={"ghost"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors rounded-full"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;