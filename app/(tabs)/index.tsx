import { ScrollView, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const FEATURES: FeatureCard[] = [
  {
    id: "hook-scorer",
    title: "Hook Scorer",
    description: "Analyze and improve your content hooks",
    icon: "sparkles",
    route: "/hook-scorer",
    color: "#0a7ea4",
  },
  {
    id: "ideation",
    title: "Content Ideation",
    description: "Generate fresh content ideas",
    icon: "pencil.and.scribble",
    route: "/tools",
    color: "#6366f1",
  },
  {
    id: "script",
    title: "Script Writer",
    description: "Create engaging video scripts",
    icon: "waveform.circle.fill",
    route: "/tools",
    color: "#22c55e",
  },
  {
    id: "thumbnail",
    title: "Thumbnail Analyzer",
    description: "Optimize your thumbnails",
    icon: "photo.fill",
    route: "/tools",
    color: "#f59e0b",
  },
  {
    id: "repurpose",
    title: "Repurposing Tool",
    description: "Adapt content for multiple platforms",
    icon: "arrow.2.squarepath",
    route: "/tools",
    color: "#ef4444",
  },
  {
    id: "monetization",
    title: "Monetization Modeler",
    description: "Calculate revenue potential",
    icon: "chart.bar.fill",
    route: "/tools",
    color: "#8b5cf6",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const statsQuery = trpc.creator.stats.useQuery(undefined, { refetchOnWindowFocus: false });
  const counts = statsQuery.data || {};

  const handleFeaturePress = (route: string) => {
    router.push(route as any);
  };

  const renderFeatureCard = ({ item }: { item: FeatureCard }) => (
    <TouchableOpacity
      onPress={() => handleFeaturePress(item.route)}
      activeOpacity={0.7}
    >
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        <View className="flex-row items-center gap-3">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: item.color + "20" }}
          >
            <IconSymbol size={24} name={item.icon as any} color={item.color} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            <Text className="text-sm text-muted mt-1">{item.description}</Text>
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
          {/* Hero Section */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Creator OS</Text>
            <Text className="text-base text-muted">
              Your AI-powered command center for content creation
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Analyses</Text>
              <Text className="text-2xl font-bold text-foreground">{counts.hook_analysis ?? 0}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Saved</Text>
              <Text className="text-2xl font-bold text-foreground">{Object.values(counts).reduce((acc, val) => acc + Number(val || 0), 0)}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Ideas</Text>
              <Text className="text-2xl font-bold text-foreground">{counts.content_idea ?? 0}</Text>
            </View>
          </View>

          {/* Featured Tool */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">Featured</Text>
            <TouchableOpacity
              onPress={() => handleFeaturePress("/hook-scorer")}
              activeOpacity={0.7}
            >
              <View className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 border border-primary">
                <View className="gap-3">
                  <View className="flex-row items-center gap-2">
                    <IconSymbol size={24} name="sparkles" color="#ffffff" />
                    <Text className="text-xl font-bold text-white">Hook Scorer</Text>
                  </View>
                  <Text className="text-sm text-white opacity-90">
                    Analyze your hooks for viral potential with AI-powered insights
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <Text className="text-white font-semibold">Get Started</Text>
                    <IconSymbol size={16} name="chevron.right" color="#ffffff" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* All Features */}
          <View className="gap-2">
            <Text className="text-lg font-semibold text-foreground">All Tools</Text>
            <FlatList
              data={FEATURES}
              renderItem={renderFeatureCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
