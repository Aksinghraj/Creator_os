import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

const TOOLS: Tool[] = [
  {
    id: "ideation",
    title: "Content Ideation",
    description: "Generate fresh content ideas based on trends and your niche",
    icon: "pencil.and.scribble",
    color: "#6366f1",
    route: "/content-ideation",
  },
  {
    id: "script",
    title: "Script Writer",
    description: "Create engaging video scripts for any platform",
    icon: "waveform.circle.fill",
    color: "#22c55e",
    route: "/script-writer",
  },
  {
    id: "thumbnail",
    title: "Thumbnail Analyzer",
    description: "Optimize thumbnails for maximum CTR",
    icon: "photo.fill",
    color: "#f59e0b",
    route: "/thumbnail-analyzer",
  },
  {
    id: "repurpose",
    title: "Repurposing Tool",
    description: "Adapt content for multiple platforms instantly",
    icon: "arrow.2.squarepath",
    color: "#ef4444",
    route: "/repurposing",
  },
  {
    id: "monetization",
    title: "Monetization Modeler",
    description: "Calculate revenue potential and growth strategies",
    icon: "chart.bar.fill",
    color: "#8b5cf6",
    route: "/monetization",
  },
  {
    id: "sponsorship",
    title: "Sponsorship Pitch",
    description: "Generate compelling sponsorship pitch decks",
    icon: "envelope.open.fill",
    color: "#ec4899",
    route: "/sponsorship",
  },
];

export default function ToolsScreen() {
  const router = useRouter();

  const handleToolPress = (route: string) => {
    router.push(route as any);
  };

  const renderTool = ({ item }: { item: Tool }) => (
    <TouchableOpacity
      onPress={() => handleToolPress(item.route)}
      activeOpacity={0.7}
    >
      <View className="bg-surface rounded-2xl p-5 mb-3 border border-border">
        <View className="flex-row items-start gap-4">
          <View
            className="w-14 h-14 rounded-xl items-center justify-center flex-shrink-0"
            style={{ backgroundColor: item.color + "20" }}
          >
            <IconSymbol size={28} name={item.icon as any} color={item.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            <Text className="text-sm text-muted mt-1 leading-relaxed">{item.description}</Text>
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
            <Text className="text-3xl font-bold text-foreground">All Tools</Text>
            <Text className="text-base text-muted">
              Complete toolkit for content creators
            </Text>
          </View>

          {/* Tools List */}
          <FlatList
            data={TOOLS}
            renderItem={renderTool}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
