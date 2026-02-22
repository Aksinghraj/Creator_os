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

interface ScriptSegment {
  time: string;
  text: string;
}

const PLATFORMS = [
  { id: "tiktok", name: "TikTok", icon: "waveform.circle.fill", duration: "15-60s" },
  { id: "youtube", name: "YouTube Shorts", icon: "waveform.circle.fill", duration: "15-60s" },
  { id: "instagram", name: "Instagram Reels", icon: "waveform.circle.fill", duration: "15-90s" },
  { id: "youtube-long", name: "YouTube Video", icon: "waveform.circle.fill", duration: "5-15min" },
];

export default function ScriptWriterScreen() {
  const colors = useColors();
  const [hook, setHook] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const [script, setScript] = useState<ScriptSegment[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scriptMutation = trpc.creator.script.useMutation();

  const handleGenerateScript = async () => {
    if (!hook.trim()) return;

    try {
      const platform = PLATFORMS.find((p) => p.id === selectedPlatform);
      const generatedScript = await scriptMutation.mutateAsync({
        hook,
        platform: platform?.name || "Video",
        duration: platform?.duration || "60s",
      });
      setScript(generatedScript);
    } catch (error) {
      console.error("Error generating script:", error);
      alert("Failed to generate script. Please try again.");
    }
  };

  const handleCopySegment = async (text: string, index: number) => {
    await Clipboard.setStringAsync(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderPlatform = (platform: any) => (
    <TouchableOpacity
      key={platform.id}
      onPress={() => setSelectedPlatform(platform.id)}
      activeOpacity={0.7}
    >
      <View
        className={`rounded-xl p-3 mb-2 border ${
          selectedPlatform === platform.id
            ? "border-primary bg-primary bg-opacity-10"
            : "border-border bg-surface"
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 flex-1">
            <IconSymbol
              size={20}
              name={platform.icon as any}
              color={selectedPlatform === platform.id ? colors.primary : colors.muted}
            />
            <View>
              <Text
                className={`text-sm font-semibold ${
                  selectedPlatform === platform.id ? "text-primary" : "text-foreground"
                }`}
              >
                {platform.name}
              </Text>
              <Text className="text-xs text-muted">{platform.duration}</Text>
            </View>
          </View>
          {selectedPlatform === platform.id && (
            <IconSymbol size={20} name="checkmark" color={colors.primary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderScriptSegment = ({ item, index }: { item: ScriptSegment; index: number }) => (
    <TouchableOpacity
      onPress={() => handleCopySegment(item.text, index)}
      activeOpacity={0.7}
    >
      <View className="bg-surface rounded-xl p-4 mb-2 border border-border">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-xs font-semibold text-primary mb-1">{item.time}</Text>
            <Text className="text-sm text-foreground leading-relaxed">{item.text}</Text>
          </View>
          <IconSymbol
            size={18}
            name={copiedIndex === index ? "checkmark" : "paperplane.fill"}
            color={copiedIndex === index ? "#22c55e" : colors.primary}
          />
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
            <Text className="text-3xl font-bold text-foreground">Script Writer</Text>
            <Text className="text-base text-muted">
              Create engaging video scripts instantly
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Your Hook</Text>
            <TextInput
              placeholder="Enter your hook or main idea..."
              value={hook}
              onChangeText={setHook}
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-xl p-4 text-foreground"
              placeholderTextColor={colors.muted}
              editable={!loading}
            />
          </View>

          {/* Platform Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Platform</Text>
            <View>{PLATFORMS.map((platform) => renderPlatform(platform))}</View>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerateScript}
            disabled={scriptMutation.isLoading || !hook.trim()}
            activeOpacity={0.7}
          >
            <View
              className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                scriptMutation.isLoading || !hook.trim() ? "opacity-50" : ""
              }`}
              style={{
                backgroundColor: colors.primary,
              }}
            >
              {scriptMutation.isLoading ? (
                <>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white font-semibold">Generating...</Text>
                </>
              ) : (
                <>
                  <IconSymbol size={20} name="waveform.circle.fill" color="#ffffff" />
                  <Text className="text-white font-semibold">Generate Script</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Script Output */}
          {script.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-foreground">YOUR SCRIPT</Text>
                <TouchableOpacity
                  onPress={async () => {
                    const fullScript = script.map((s) => `[${s.time}] ${s.text}`).join("\n\n");
                    await Clipboard.setStringAsync(fullScript);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-1">
                    <IconSymbol size={16} name="paperplane.fill" color={colors.primary} />
                    <Text className="text-xs font-semibold text-primary">Copy All</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={script}
                renderItem={renderScriptSegment}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Empty State */}
          {!script.length && !scriptMutation.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="waveform.circle.fill" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter a hook and select a platform to generate your script
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
