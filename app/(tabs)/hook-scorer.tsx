import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Clipboard from "expo-clipboard";
import { trpc } from "@/lib/trpc";

interface HookAnalysis {
  score: number;
  type: string;
  breakdown: {
    curiosity: number;
    clarity: number;
    emotionalTrigger: number;
    specificity: number;
    scrollStoppingPower: number;
  };
  mainWeakness: string;
  improvedHooks: string[];
  viralityConfidence: "Low" | "Medium" | "High";
}

export default function HookScorerScreen() {
  const colors = useColors();
  const [hook, setHook] = useState("");
  const [analysis, setAnalysis] = useState<HookAnalysis | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const hookAnalyze = trpc.creator.hookAnalyze.useMutation();

  const handleAnalyze = async () => {
    if (!hook.trim()) return;
    try {
      const result = await hookAnalyze.mutateAsync({ hook });
      setAnalysis(result as HookAnalysis);
    } catch (error) {
      console.error("Error analyzing hook:", error);
      alert("Failed to analyze hook. Please try again.");
    }
  };

  const handleCopyHook = async (text: string, index: number) => {
    await Clipboard.setStringAsync(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#f59e0b";
    return "#ef4444";
  };

  const getViralityColor = (confidence: string) => {
    if (confidence === "High") return "#22c55e";
    if (confidence === "Medium") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Hook Scorer</Text>
            <Text className="text-base text-muted">
              Analyze your hooks for viral potential
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Your Hook</Text>
            <TextInput
              placeholder="Paste your hook here..."
              value={hook}
              onChangeText={setHook}
              multiline
              numberOfLines={4}
              className="bg-surface border border-border rounded-xl p-4 text-foreground"
              placeholderTextColor={colors.muted}
              editable={!loading}
            />
            <Text className="text-xs text-muted">{hook.length} characters</Text>

            <TouchableOpacity
              onPress={handleAnalyze}
              disabled={hookAnalyze.isLoading || !hook.trim()}
              activeOpacity={0.7}
            >
              <View
                className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                  hookAnalyze.isLoading || !hook.trim() ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                {hookAnalyze.isLoading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-semibold">Analyzing...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol size={20} name="sparkles" color="#ffffff" />
                    <Text className="text-white font-semibold">Analyze Hook</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Results Section */}
          {analysis && (
            <View className="gap-6 mt-4">
              {/* Score Card */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted font-semibold">HOOK SCORE</Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getScoreColor(analysis.score) + "20" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: getScoreColor(analysis.score) }}
                    >
                      {analysis.viralityConfidence}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="text-5xl font-bold text-foreground">{analysis.score}</Text>
                  <Text className="text-2xl text-muted">/10</Text>
                </View>
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Type</Text>
                  <Text className="text-base text-primary font-semibold">{analysis.type}</Text>
                </View>
              </View>

              {/* Breakdown */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">BREAKDOWN</Text>
                <View className="gap-2">
                  {Object.entries(analysis.breakdown).map(([key, value]) => (
                    <View key={key} className="gap-1">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-muted capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Text>
                        <Text className="text-sm font-semibold text-foreground">{value}/10</Text>
                      </View>
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${(value / 10) * 100}%`,
                            backgroundColor: getScoreColor(value),
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Main Weakness */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">MAIN WEAKNESS</Text>
                <View className="bg-error bg-opacity-10 rounded-xl p-4 border border-error border-opacity-30">
                  <Text className="text-sm text-foreground">{analysis.mainWeakness}</Text>
                </View>
              </View>

              {/* Improved Hooks */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">IMPROVED HOOKS</Text>
                <FlatList
                  data={analysis.improvedHooks}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => handleCopyHook(item, index)}
                      activeOpacity={0.7}
                      key={index}
                    >
                      <View className="bg-surface rounded-xl p-4 mb-2 border border-border flex-row items-start gap-3">
                        <View className="flex-1">
                          <Text className="text-sm text-foreground leading-relaxed">{item}</Text>
                        </View>
                        <IconSymbol
                          size={20}
                          name={copiedIndex === index ? "checkmark" : "paperplane.fill"}
                          color={copiedIndex === index ? "#22c55e" : colors.primary}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  scrollEnabled={false}
                />
              </View>
            </View>
          )}

          {/* Empty State */}
          {!analysis && !hookAnalyze.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="sparkles" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter a hook above to get started with AI analysis
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
