import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useIAP } from '@/hooks/useIAP';

export default function UpgradeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];
  const { loading, products, isProcessing, isPremium, error, buySubscription, restorePurchases } = useIAP();
  const priceText = products?.[0]?.price ?? '$10';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: Colors.light.surface, dark: Colors.dark.surface }}
      headerImage={
        <IconSymbol
          size={280}
          color={theme.muted}
          name="star.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Upgrade</ThemedText>
      </ThemedView>

      <ThemedText style={{ marginBottom: 16 }}>
        Go Premium for access to all features. One simple plan.
      </ThemedText>

      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: theme.inputBackground,
            borderColor: theme.border,
            shadowColor: theme.icon,
          },
        ]}
      >
        <ThemedText type="subtitle" style={styles.planTitle}>Premium Plan</ThemedText>
        <View style={styles.priceRow}>
          <ThemedText type="title" style={[styles.price, { color: theme.primary }]}>{priceText}</ThemedText>
          <ThemedText style={styles.perMonth}>/month</ThemedText>
        </View>

        <View style={styles.benefits}>
          <ThemedText style={styles.benefitItem}>• Unlimited habits</ThemedText>
          <ThemedText style={styles.benefitItem}>• Advanced insights</ThemedText>
          <ThemedText>• Priority support</ThemedText>
        </View>

        {isPremium ? (
          <ThemedView style={[styles.notice, { borderColor: theme.border }]}>
            <ThemedText type="defaultSemiBold">Premium is active 🎉</ThemedText>
            <ThemedText style={{ opacity: 0.7, marginTop: 4 }}>Thank you for supporting Habi!</ThemedText>
          </ThemedView>
        ) : (
          <>
            <TouchableOpacity
              onPress={buySubscription}
              disabled={loading || isProcessing}
              style={[
                styles.upgradeButton,
                { backgroundColor: theme.primary, opacity: loading || isProcessing ? 0.6 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Upgrade to premium for ${priceText} per month`}
            >
              <ThemedText style={[styles.upgradeText, { color: theme.primaryContrast }]}>
                {isProcessing ? 'Processing…' : `Upgrade for ${priceText}/month`}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={restorePurchases}
              disabled={isProcessing}
              style={[styles.restoreButton, { borderColor: theme.border }]}
              accessibilityRole="button"
              accessibilityLabel="Restore purchases"
            >
              <ThemedText style={[styles.restoreText, { color: theme.muted }]}>Restore Purchases</ThemedText>
            </TouchableOpacity>
          </>
        )}

        {error ? (
          <ThemedText style={[styles.errorText]}>{String(error)}</ThemedText>
        ) : null}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -80,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  planTitle: {
    marginBottom: 6,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    marginRight: 6,
  },
  perMonth: {
    opacity: 0.7,
    marginBottom: 6,
  },
  benefits: {
    marginBottom: 16,
  },
  benefitItem: {
    marginBottom: 6,
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  upgradeText: {
    fontWeight: '700',
    fontSize: 16,
  },
  restoreButton: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  restoreText: {
    fontWeight: '600',
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  errorText: {
    marginTop: 10,
    textAlign: 'center',
  },
});
