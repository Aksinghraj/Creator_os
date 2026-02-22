import React from "react";
import { ScrollView, Text, View, FlatList, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface SavedItem {
  id: string;
  type: "hook" | "idea" | "script";
  title: string;
  content: string;
  date: string;
  score?: number;
}

const normalizeType = (kind: string): SavedItem["type"] => {
  if (kind === "hook_analysis") return "hook";
  if (kind === "script") return "script";
  return "idea";
};

export default function SavedScreen() {
  const colors = useColors();
  const artifactsQuery = trpc.creator.artifacts.useQuery({});
  const savedItems: SavedItem[] = (artifactsQuery.data || []).map((item) => ({
    id: String(item.id),
    type: normalizeType(item.kind),
    title: item.title ?? item.kind,
    content: typeof item.result === "string" ? item.result : JSON.stringify(item.result),
    date: new Date(item.createdAt ?? Date.now()).toLocaleDateString(),
    score: (item.result as any)?.score,
  }));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hook":
        return "sparkles";
      case "idea":
        return "pencil.and.scribble";
      case "script":
        return "waveform.circle.fill";
      default:
        return "star.fill";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hook":
        return "#0a7ea4";
      case "idea":
        return "#6366f1";
      case "script":
        return "#22c55e";
      default:
        return "#f59e0b";
    }
  };

  const renderSavedItem = ({ item }: { item: SavedItem }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        <View className="flex-row items-start gap-3">
          <View
            className="w-10 h-10 rounded-lg items-center justify-center flex-shrink-0"
            style={{ backgroundColor: getTypeColor(item.type) + "20" }}
          >
            <IconSymbol size={20} name={getTypeIcon(item.type) as any} color={getTypeColor(item.type)} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-semibold text-foreground capitalize">{item.type}</Text>
              {item.score && (
                <View className="bg-success bg-opacity-10 px-2 py-1 rounded">
                  <Text className="text-xs font-bold text-success">{item.score}/10</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-muted">{item.date}</Text>
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
            <Text className="text-3xl font-bold text-foreground">Saved</Text>
            <Text className="text-base text-muted">
              Your favorite analyses and creations
            </Text>
          </View>

          {/* Content */}
          {savedItems.length > 0 ? (
            <FlatList
              data={savedItems}
              renderItem={renderSavedItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="star.fill" color={colors.primary} />
              </View>
              <View className="gap-2 items-center">
                <Text className="text-lg font-semibold text-foreground">No Saved Items</Text>
                <Text className="text-center text-muted">
                  Save your favorite analyses and creations here
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
