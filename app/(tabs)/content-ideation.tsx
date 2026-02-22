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
import { trpc } from "@/lib/trpc";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  format: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function ContentIdeationScreen() {
  const colors = useColors();
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const ideasMutation = trpc.creator.contentIdeas.useMutation();

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) return;

    try {
      const generatedIdeas = await ideasMutation.mutateAsync({ topic });
      setIdeas(
        generatedIdeas.map((idea, index) => ({
          id: String(index + 1),
          ...idea,
        }))
      );
    } catch (error) {
      console.error("Error generating ideas:", error);
      alert("Failed to generate ideas. Please try again.");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#22c55e";
      case "Medium":
        return "#f59e0b";
      case "Hard":
        return "#ef4444";
      default:
        return colors.muted;
    }
  };

  const renderIdea = ({ item }: { item: ContentIdea }) => (
    <TouchableOpacity activeOpacity={0.7}>
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        <View className="gap-2">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            </View>
            <View
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: getDifficultyColor(item.difficulty) + "20" }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: getDifficultyColor(item.difficulty) }}
              >
                {item.difficulty}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-muted">{item.description}</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: colors.primary + "10" }}
            >
              <Text className="text-xs text-primary font-semibold">{item.format}</Text>
            </View>
          </View>
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
            <Text className="text-3xl font-bold text-foreground">Content Ideation</Text>
            <Text className="text-base text-muted">
              Generate fresh ideas for your content
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Your Topic or Niche</Text>
            <TextInput
              placeholder="e.g., productivity, fitness, cooking..."
              value={topic}
              onChangeText={setTopic}
              className="bg-surface border border-border rounded-xl p-4 text-foreground"
              placeholderTextColor={colors.muted}
              editable={!loading}
            />

            <TouchableOpacity
              onPress={handleGenerateIdeas}
              disabled={ideasMutation.isLoading || !topic.trim()}
              activeOpacity={0.7}
            >
              <View
                className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                  ideasMutation.isLoading || !topic.trim() ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                {ideasMutation.isLoading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-semibold">Generating...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol size={20} name="pencil.and.scribble" color="#ffffff" />
                    <Text className="text-white font-semibold">Generate Ideas</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Ideas List */}
          {ideas.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground">GENERATED IDEAS</Text>
              <FlatList
                data={ideas}
                renderItem={renderIdea}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Empty State */}
          {!ideas.length && !ideasMutation.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="pencil.and.scribble" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter a topic to generate fresh content ideas
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
