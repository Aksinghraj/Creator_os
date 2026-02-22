import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Clipboard from "expo-clipboard";
import { trpc } from "@/lib/trpc";

interface RepurposedContent {
  platform: string;
  content: string;
  icon: string;
  color: string;
}

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "waveform.circle.fill", color: "#000000" },
  { id: "instagram", name: "Instagram", icon: "photo.fill", color: "#E4405F" },
  { id: "youtube", name: "YouTube", icon: "waveform.circle.fill", color: "#FF0000" },
  { id: "twitter", name: "Twitter/X", icon: "paperplane.fill", color: "#000000" },
  { id: "linkedin", name: "LinkedIn", icon: "briefcase.fill", color: "#0A66C2" },
  { id: "email", name: "Email Newsletter", icon: "envelope.open.fill", color: "#0078D4" },
];

export default function RepurposingScreen() {
  const colors = useColors();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [repurposed, setRepurposed] = useState<RepurposedContent[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const repurposeMutation = trpc.creator.repurpose.useMutation();

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  const handleRepurpose = async () => {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    try {
      const platformNames = selectedPlatforms
        .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
        .filter(Boolean);
      const repurposedContent = await repurposeMutation.mutateAsync({
        content,
        platforms: platformNames as string[],
      });
      const repurposedWithDetails = repurposedContent.map((item) => {
        const platform = PLATFORMS.find((p) => p.name === item.platform);
        return {
          ...item,
          icon: platform?.icon || "",
          color: platform?.color || "",
        };
      });
      setRepurposed(repurposedWithDetails);
    } catch (error) {
      console.error("Error repurposing content:", error);
      alert("Failed to repurpose content. Please try again.");
    }
  };

  const handleCopyContent = async (text: string, index: number) => {
    await Clipboard.setStringAsync(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Repurposing Tool</Text>
            <Text className="text-base text-muted">
              Adapt content for multiple platforms
            </Text>
          </View>

          {/* Content Input */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Original Content</Text>
            <TextInput
              placeholder="Paste your content here..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={5}
              className="bg-surface border border-border rounded-xl p-4 text-foreground"
              placeholderTextColor={colors.muted}
              editable={!loading}
            />
            <Text className="text-xs text-muted">{content.length} characters</Text>
          </View>

          {/* Platform Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Target Platforms</Text>
            <View className="gap-2">
              {PLATFORMS.map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  onPress={() => togglePlatform(platform.id)}
                  activeOpacity={0.7}
                >
                  <View
                    className={`rounded-xl p-3 border flex-row items-center gap-3 ${
                      selectedPlatforms.includes(platform.id)
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-border bg-surface"
                    }`}
                  >
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: selectedPlatforms.includes(platform.id)
                          ? colors.primary + "20"
                          : colors.border,
                      }}
                    >
                      <IconSymbol
                        size={16}
                        name={platform.icon as any}
                        color={
                          selectedPlatforms.includes(platform.id) ? colors.primary : colors.muted
                        }
                      />
                    </View>
                    <Text
                      className={`flex-1 font-semibold ${
                        selectedPlatforms.includes(platform.id)
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {platform.name}
                    </Text>
                    {selectedPlatforms.includes(platform.id) && (
                      <IconSymbol size={20} name="checkmark" color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Repurpose Button */}
          <TouchableOpacity
            onPress={handleRepurpose}
            disabled={repurposeMutation.isLoading || !content.trim() || selectedPlatforms.length === 0}
            activeOpacity={0.7}
          >
            <View
              className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                repurposeMutation.isLoading || !content.trim() || selectedPlatforms.length === 0 ? "opacity-50" : ""
              }`}
              style={{
                backgroundColor: colors.primary,
              }}
            >
              {repurposeMutation.isLoading ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white font-semibold">Repurposing...</Text>
                </>
              ) : (
                <>
                  <IconSymbol size={20} name="arrow.2.squarepath" color="#ffffff" />
                  <Text className="text-white font-semibold">Repurpose Content</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Repurposed Content */}
          {repurposed.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">ADAPTED CONTENT</Text>
              <FlatList
                data={repurposed}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => handleCopyContent(item.content, index)}
                    activeOpacity={0.7}
                    key={index}
                  >
                    <View className="bg-surface rounded-xl p-4 mb-2 border border-border">
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                          <View
                            className="w-8 h-8 rounded-lg items-center justify-center"
                            style={{ backgroundColor: item.color + "20" }}
                          >
                            <IconSymbol size={16} name={item.icon as any} color={item.color} />
                          </View>
                          <Text className="font-semibold text-foreground">{item.platform}</Text>
                        </View>
                        <IconSymbol
                          size={18}
                          name={copiedIndex === index ? "checkmark" : "paperplane.fill"}
                          color={copiedIndex === index ? "#22c55e" : colors.primary}
                        />
                      </View>
                      <Text className="text-sm text-foreground leading-relaxed">{item.content}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Empty State */}
          {!repurposed.length && !repurposeMutation.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="arrow.2.squarepath" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter content and select platforms to repurpose
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
