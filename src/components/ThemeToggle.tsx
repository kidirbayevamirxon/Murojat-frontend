import { useTheme } from "../context/theme-provider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      className="border p-2 rounded"
      value={theme}
      onChange={(e) => setTheme(e.target.value as any)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};
