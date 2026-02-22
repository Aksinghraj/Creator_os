import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { trpc } from "@/lib/trpc";

interface ThumbnailAnalysis {
  ctrScore: number;
  colorScore: number;
  textScore: number;
  faceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

export default function ThumbnailAnalyzerScreen() {
  const colors = useColors();
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ThumbnailAnalysis | null>(null);
  const analyzeThumbnail = trpc.creator.thumbnail.useMutation();

  const handlePickImage = async () => {
    // In lieu of an image picker, use placeholder and ask backend for analysis based on a short description.
    setImage("https://via.placeholder.com/300x200?text=Thumbnail");
    try {
      const result = await analyzeThumbnail.mutateAsync({
        description: "Sample thumbnail with bright colors and bold text",
      });
      setAnalysis(result as ThumbnailAnalysis);
    } catch (error) {
      console.error("Thumbnail analysis failed", error);
      alert("Failed to analyze thumbnail. Please try again.");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#f59e0b";
    return "#ef4444";
  };

  const renderScoreCard = (label: string, score: number) => (
    <View key={label} className="flex-1 bg-surface rounded-xl p-3 border border-border">
      <Text className="text-xs text-muted mb-2">{label}</Text>
      <View className="gap-1">
        <Text className="text-2xl font-bold text-foreground">{score}</Text>
        <View className="h-1.5 bg-border rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${(score / 10) * 100}%`,
              backgroundColor: getScoreColor(score),
            }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Thumbnail Analyzer</Text>
            <Text className="text-base text-muted">
              Optimize your thumbnails for maximum CTR
            </Text>
          </View>

          {/* Image Upload */}
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={analyzeThumbnail.isLoading}
            activeOpacity={0.7}
          >
            <View className="bg-surface rounded-2xl p-6 border-2 border-dashed border-border items-center justify-center gap-3">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: "100%", height: 200, borderRadius: 12 }}
                />
              ) : (
                <>
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: colors.primary + "20" }}
                  >
                    <IconSymbol size={24} name={analyzeThumbnail.isLoading ? "hourglass" : "photo.fill"} color={colors.primary} />
                  </View>
                  <View className="items-center gap-1">
                    <Text className="text-base font-semibold text-foreground">
                      Upload Thumbnail
                    </Text>
                    <Text className="text-sm text-muted">PNG, JPG up to 10MB</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Analysis Results */}
          {analysis && (
            <View className="gap-6">
              {/* Overall Score */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-muted font-semibold">OVERALL CTR SCORE</Text>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: getScoreColor(analysis.overallScore) + "20" }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: getScoreColor(analysis.overallScore) }}
                    >
                      {analysis.overallScore >= 8 ? "Excellent" : analysis.overallScore >= 6 ? "Good" : "Fair"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  <Text className="text-5xl font-bold text-foreground">{analysis.overallScore}</Text>
                  <Text className="text-2xl text-muted">/10</Text>
                </View>
              </View>

              {/* Score Breakdown */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">BREAKDOWN</Text>
                <View className="gap-2">
                  {renderScoreCard("Color Impact", analysis.colorScore)}
                  {renderScoreCard("Text Clarity", analysis.textScore)}
                  {renderScoreCard("Face/Emotion", analysis.faceScore)}
                </View>
              </View>

              {/* Strengths */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">STRENGTHS</Text>
                {analysis.strengths.map((strength, index) => (
                  <View key={index} className="flex-row gap-3 items-start">
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#22c55e" + "20" }}
                    >
                      <Text className="text-xs font-bold text-success">✓</Text>
                    </View>
                    <Text className="text-sm text-foreground flex-1 leading-relaxed">{strength}</Text>
                  </View>
                ))}
              </View>

              {/* Improvements */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">IMPROVEMENTS</Text>
                {analysis.improvements.map((improvement, index) => (
                  <View key={index} className="flex-row gap-3 items-start">
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: "#f59e0b" + "20" }}
                    >
                      <Text className="text-xs font-bold text-warning">!</Text>
                    </View>
                    <Text className="text-sm text-foreground flex-1 leading-relaxed">{improvement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {!analysis && !analyzeThumbnail.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="photo.fill" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Upload a thumbnail to get AI-powered optimization suggestions
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
