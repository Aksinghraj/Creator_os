import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Clipboard from "expo-clipboard";
import { trpc } from "@/lib/trpc";

interface SponsorshipPitch {
  title: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export default function SponsorshipScreen() {
  const colors = useColors();
  const [channelName, setChannelName] = useState("");
  const [subscribers, setSubscribers] = useState("");
  const [niche, setNiche] = useState("");
  const [pitch, setPitch] = useState<SponsorshipPitch | null>(null);
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const sponsorshipMutation = trpc.creator.sponsorship.useMutation();

  const handleGeneratePitch = async () => {
    if (!channelName || !subscribers || !niche) return;

    try {
      const result = await sponsorshipMutation.mutateAsync({
        channelName,
        subscribers: parseInt(subscribers),
        niche,
      });
      setPitch(result);
    } catch (error) {
      console.error("Error generating pitch:", error);
      alert("Failed to generate sponsorship pitch. Please try again.");
    }
  };

  const handleCopySection = async (content: string, index: number) => {
    await Clipboard.setStringAsync(content);
    setCopiedSection(index);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Sponsorship Pitch</Text>
            <Text className="text-base text-muted">
              Generate compelling pitch decks for brands
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-3">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Channel Name</Text>
              <TextInput
                placeholder="e.g., Tech Daily"
                value={channelName}
                onChangeText={setChannelName}
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Subscribers</Text>
              <TextInput
                placeholder="e.g., 100000"
                value={subscribers}
                onChangeText={setSubscribers}
                keyboardType="number-pad"
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Niche/Industry</Text>
              <TextInput
                placeholder="e.g., technology, fitness, beauty"
                value={niche}
                onChangeText={setNiche}
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              onPress={handleGeneratePitch}
              disabled={sponsorshipMutation.isLoading || !channelName || !subscribers || !niche}
              activeOpacity={0.7}
            >
              <View
                className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                  sponsorshipMutation.isLoading || !channelName || !subscribers || !niche ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                {sponsorshipMutation.isLoading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-semibold">Generating...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol size={20} name="envelope.open.fill" color="#ffffff" />
                    <Text className="text-white font-semibold">Generate Pitch</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Pitch Output */}
          {pitch && (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground">{pitch.title}</Text>
                <Text className="text-sm text-muted">
                  Customize this pitch and send to potential sponsors
                </Text>
              </View>

              {pitch.sections.map((section, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCopySection(section.content, index)}
                  activeOpacity={0.7}
                >
                  <View className="bg-surface rounded-xl p-4 border border-border gap-2">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm font-semibold text-foreground flex-1">
                        {section.title}
                      </Text>
                      <IconSymbol
                        size={18}
                        name={copiedSection === index ? "checkmark" : "paperplane.fill"}
                        color={copiedSection === index ? "#22c55e" : colors.primary}
                      />
                    </View>
                    <Text className="text-sm text-foreground leading-relaxed">
                      {section.content}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Download/Share Options */}
              <View className="gap-2">
                <TouchableOpacity
                  onPress={async () => {
                    const fullPitch = [
                      pitch.title,
                      "",
                      ...pitch.sections.map((s) => `${s.title}\n${s.content}`),
                    ].join("\n\n");
                    await Clipboard.setStringAsync(fullPitch);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="bg-primary bg-opacity-10 rounded-xl p-4 border border-primary border-opacity-30 flex-row items-center justify-center gap-2">
                    <IconSymbol size={20} name="paperplane.fill" color={colors.primary} />
                    <Text className="text-sm font-semibold text-primary">Copy Full Pitch</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Empty State */}
          {!pitch && !sponsorshipMutation.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="envelope.open.fill" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter your channel details to generate a sponsorship pitch
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
