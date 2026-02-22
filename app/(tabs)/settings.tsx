import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "toggle" | "action";
}

const SETTINGS: SettingItem[] = [
  {
    id: "notifications",
    title: "Push Notifications",
    description: "Get notified about new features and tips",
    icon: "bell.fill",
    type: "toggle",
  },
  {
    id: "darkmode",
    title: "Dark Mode",
    description: "Easy on the eyes in low light",
    icon: "moon.fill",
    type: "toggle",
  },
  {
    id: "analytics",
    title: "Usage Analytics",
    description: "Help us improve Creator OS",
    icon: "chart.bar.fill",
    type: "toggle",
  },
];

const ABOUT_ITEMS = [
  {
    id: "version",
    title: "Version",
    description: "1.0.0",
    icon: "info.circle.fill",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "Learn how we protect your data",
    icon: "lock.fill",
  },
  {
    id: "terms",
    title: "Terms of Service",
    description: "Our terms and conditions",
    icon: "doc.text.fill",
  },
];

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === "dark");

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.id} className="bg-surface rounded-2xl p-4 mb-3 border border-border">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <IconSymbol size={20} name={item.icon as any} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            <Text className="text-sm text-muted mt-1">{item.description}</Text>
          </View>
        </View>
        {item.type === "toggle" && (
          <Switch
            value={
              item.id === "notifications"
                ? notifications
                : item.id === "darkmode"
                  ? darkMode
                  : analytics
            }
            onValueChange={(value) => {
              if (item.id === "notifications") setNotifications(value);
              else if (item.id === "darkmode") setDarkMode(value);
              else if (item.id === "analytics") setAnalytics(value);
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        )}
      </View>
    </View>
  );

  const renderAboutItem = (item: any) => (
    <TouchableOpacity key={item.id} activeOpacity={0.7}>
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <IconSymbol size={20} name={item.icon as any} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">{item.title}</Text>
              <Text className="text-sm text-muted mt-1">{item.description}</Text>
            </View>
          </View>
          <IconSymbol size={20} name="chevron.right" color={colors.muted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-base text-muted">
              Customize your Creator OS experience
            </Text>
          </View>

          {/* Preferences */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">PREFERENCES</Text>
            {SETTINGS.map((item) => renderSettingItem(item))}
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">ABOUT</Text>
            {ABOUT_ITEMS.map((item) => renderAboutItem(item))}
          </View>

          {/* Logout */}
          <TouchableOpacity activeOpacity={0.7}>
            <View className="bg-error bg-opacity-10 rounded-2xl p-4 border border-error border-opacity-30 items-center">
              <Text className="text-base font-semibold text-error">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
