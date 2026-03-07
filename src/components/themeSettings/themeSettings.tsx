import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-base font-medium text-foreground">Theme</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="system">System (auto)</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <p className="text-sm text-muted-foreground">
        System will automatically match your device's theme.
      </p>
    </div>
  );
}
