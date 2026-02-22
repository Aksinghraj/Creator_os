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
import { trpc } from "@/lib/trpc";

interface MonetizationData {
  subscribers: number;
  monthlyViews: number;
  engagementRate: number;
  adRevenue: number;
  sponsorshipPotential: number;
  affiliateRevenue: number;
  totalMonthly: number;
  annualProjection: number;
}

export default function MonetizationScreen() {
  const colors = useColors();
  const [subscribers, setSubscribers] = useState("");
  const [monthlyViews, setMonthlyViews] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [data, setData] = useState<MonetizationData | null>(null);
  const monetizationMutation = trpc.creator.monetization.useMutation();

  const handleCalculate = async () => {
    if (!subscribers || !monthlyViews || !engagementRate) return;

    try {
      const subs = parseInt(subscribers);
      const views = parseInt(monthlyViews);
      const engagement = parseFloat(engagementRate);
      const result = await monetizationMutation.mutateAsync({
        subscribers: subs,
        monthlyViews: views,
        engagementRate: engagement,
      });
      setData(result);
    } catch (error) {
      console.error("Error calculating monetization:", error);
      alert("Failed to calculate monetization. Please try again.");
    }
  };

  const renderRevenueCard = (label: string, amount: number, icon: string) => (
    <View key={label} className="bg-surface rounded-xl p-4 border border-border gap-2">
      <View className="flex-row items-center gap-2">
        <View
          className="w-8 h-8 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <IconSymbol size={16} name={icon as any} color={colors.primary} />
        </View>
        <Text className="text-sm text-muted flex-1">{label}</Text>
      </View>
      <Text className="text-2xl font-bold text-foreground">${amount}</Text>
      <Text className="text-xs text-muted">per month</Text>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Monetization Modeler</Text>
            <Text className="text-base text-muted">
              Calculate your revenue potential
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-3">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Subscribers</Text>
              <TextInput
                placeholder="e.g., 50000"
                value={subscribers}
                onChangeText={setSubscribers}
                keyboardType="number-pad"
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Monthly Views</Text>
              <TextInput
                placeholder="e.g., 1000000"
                value={monthlyViews}
                onChangeText={setMonthlyViews}
                keyboardType="number-pad"
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Engagement Rate (%)</Text>
              <TextInput
                placeholder="e.g., 5.2"
                value={engagementRate}
                onChangeText={setEngagementRate}
                keyboardType="decimal-pad"
                className="bg-surface border border-border rounded-xl p-4 text-foreground"
                placeholderTextColor={colors.muted}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              onPress={handleCalculate}
              disabled={monetizationMutation.isLoading || !subscribers || !monthlyViews || !engagementRate}
              activeOpacity={0.7}
            >
              <View
                className={`rounded-xl py-3 items-center justify-center flex-row gap-2 ${
                  monetizationMutation.isLoading || !subscribers || !monthlyViews || !engagementRate ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor: colors.primary,
                }}
              >
                {monetizationMutation.isLoading ? (
                  <>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-semibold">Calculating...</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol size={20} name="chart.bar.fill" color="#ffffff" />
                    <Text className="text-white font-semibold">Calculate Revenue</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Results */}
          {data && (
            <View className="gap-6">
              {/* Total Revenue */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
                <Text className="text-sm text-muted font-semibold">MONTHLY REVENUE</Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-5xl font-bold text-foreground">${data.totalMonthly}</Text>
                  <Text className="text-lg text-muted">/month</Text>
                </View>
                <View className="pt-4 border-t border-border">
                  <Text className="text-sm text-muted mb-1">Annual Projection</Text>
                  <Text className="text-2xl font-bold text-success">${data.annualProjection}</Text>
                </View>
              </View>

              {/* Revenue Breakdown */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">REVENUE BREAKDOWN</Text>
                {renderRevenueCard("Ad Revenue", data.adRevenue, "chart.bar.fill")}
                {renderRevenueCard("Sponsorships", data.sponsorshipPotential, "envelope.open.fill")}
                {renderRevenueCard("Affiliate", data.affiliateRevenue, "link")}
              </View>

              {/* Channel Metrics */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground">YOUR METRICS</Text>
                <View className="gap-2">
                  <View className="flex-row items-center justify-between bg-surface rounded-xl p-4 border border-border">
                    <Text className="text-sm text-muted">Subscribers</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {data.subscribers.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between bg-surface rounded-xl p-4 border border-border">
                    <Text className="text-sm text-muted">Monthly Views</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {(data.monthlyViews / 1000000).toFixed(1)}M
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between bg-surface rounded-xl p-4 border border-border">
                    <Text className="text-sm text-muted">Engagement Rate</Text>
                    <Text className="text-lg font-bold text-foreground">{data.engagementRate}%</Text>
                  </View>
                </View>
              </View>

              {/* Recommendations */}
              <View className="gap-3 bg-primary bg-opacity-10 rounded-2xl p-4 border border-primary border-opacity-30">
                <View className="flex-row items-center gap-2">
                  <IconSymbol size={20} name="sparkles" color={colors.primary} />
                  <Text className="text-sm font-semibold text-primary flex-1">Growth Tip</Text>
                </View>
                <Text className="text-sm text-foreground leading-relaxed">
                  Focus on increasing engagement rate to unlock higher sponsorship deals. Even a 1% increase can add $500+ monthly.
                </Text>
              </View>
            </View>
          )}

          {/* Empty State */}
          {!data && !monetizationMutation.isLoading && (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{ backgroundColor: colors.primary + "20" }}
              >
                <IconSymbol size={32} name="chart.bar.fill" color={colors.primary} />
              </View>
              <Text className="text-center text-muted">
                Enter your channel metrics to calculate revenue potential
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
