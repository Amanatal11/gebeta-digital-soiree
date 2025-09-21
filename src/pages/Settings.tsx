import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

interface SettingsState {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  vibrationEnabled: boolean;
  autoSave: boolean;
  language: string;
  theme: string;
  animationsEnabled: boolean;
  hapticFeedback: boolean;
}

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsState>({
    soundEnabled: true,
    notificationsEnabled: true,
    vibrationEnabled: true,
    autoSave: true,
    language: "en",
    theme: theme || "light",
    animationsEnabled: true,
    hapticFeedback: true,
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("gebeta-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("gebeta-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle theme change
    if (key === "theme") {
      setTheme(value as string);
    }
  };

  const languages = [
    { value: "en", label: "English" },
    { value: "am", label: "አማርኛ (Amharic)" },
    { value: "or", label: "Afaan Oromoo (Oromo)" },
    { value: "ti", label: "ትግርኛ (Tigrinya)" },
    { value: "so", label: "Soomaali (Somali)" },
  ];

  // Use different background based on theme
  const backgroundClass = theme === "dark" 
    ? "min-h-screen bg-background" 
    : "ethiopian-pattern min-h-screen";

  return (
    <div className={backgroundClass}>
      <div className="relative flex h-auto min-h-screen w-full flex-col justify-between group/design-root overflow-x-hidden text-foreground">
        {/* Header */}
        <header className="sticky top-0 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-semibold">Back</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Settings</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 space-y-6">
          {/* Appearance Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">palette</span>
                Appearance
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize the look and feel of the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selector */}
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-foreground font-medium">
                  Theme
                </Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => updateSetting("theme", value)}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="animations" className="text-foreground font-medium">
                    Animations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth animations and transitions
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={settings.animationsEnabled}
                  onCheckedChange={(checked) => updateSetting("animationsEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio & Haptics Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">volume_up</span>
                Audio & Haptics
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Control sound effects and haptic feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sound" className="text-foreground font-medium">
                    Sound Effects
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound effects during gameplay
                  </p>
                </div>
                <Switch
                  id="sound"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
                />
              </div>

              <Separator className="bg-border" />

              {/* Vibration Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="vibration" className="text-foreground font-medium">
                    Vibration
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Vibrate on game events
                  </p>
                </div>
                <Switch
                  id="vibration"
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => updateSetting("vibrationEnabled", checked)}
                />
              </div>

              <Separator className="bg-border" />

              {/* Haptic Feedback Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="haptic" className="text-foreground font-medium">
                    Haptic Feedback
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tactile feedback for touch interactions
                  </p>
                </div>
                <Switch
                  id="haptic"
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => updateSetting("hapticFeedback", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">notifications</span>
                Notifications
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="text-foreground font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about game updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => updateSetting("notificationsEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">language</span>
                Language
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selector */}
              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground font-medium">
                  Language
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSetting("language", value)}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Game Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">sports_esports</span>
                Game
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Gameplay and save preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Save Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="autosave" className="text-foreground font-medium">
                    Auto Save
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save game progress
                  </p>
                </div>
                <Switch
                  id="autosave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card className="bg-card/90 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <span className="material-symbols-outlined">restore</span>
                Reset
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Reset all settings to default values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => {
                  const defaultSettings: SettingsState = {
                    soundEnabled: true,
                    notificationsEnabled: true,
                    vibrationEnabled: true,
                    autoSave: true,
                    language: "en",
                    theme: "light",
                    animationsEnabled: true,
                    hapticFeedback: true,
                  };
                  setSettings(defaultSettings);
                  setTheme("light");
                }}
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </main>

        {/* Footer Navigation */}
        <footer className="sticky bottom-0 bg-card/80 backdrop-blur-lg border-t border-gray-200/50 shadow-t-sm">
          <nav className="flex justify-around items-center px-4 py-2">
            <Link className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors" to="/">
              <span className="material-symbols-outlined">home</span>
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors" to="/game">
              <span className="material-symbols-outlined">add_box</span>
              <span className="text-xs font-medium">New Game</span>
            </Link>
            <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined">leaderboard</span>
              <span className="text-xs font-medium">Leaderboard</span>
            </a>
            <Link className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-primary" to="/settings">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
              <span className="text-xs font-semibold">Settings</span>
            </Link>
          </nav>
          <div className="h-safe-area-bottom bg-card/80"></div>
        </footer>
      </div>
    </div>
  );
};

export default Settings;
