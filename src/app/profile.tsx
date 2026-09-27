import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const STATS = [
  { label: 'Příspěvky', value: '12' },
  { label: 'Sledující', value: '1 204' },
  { label: 'Sleduji', value: '318' },
];

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ThemedView style={styles.headerRow}>
          <ThemedView style={styles.avatar} />
          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <View key={stat.label} style={styles.stat}>
                <ThemedText type="smallBold">{stat.value}</ThemedText>
                <ThemedText type="small">{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={styles.bioSection}>
          <ThemedText type="smallBold">SteApps User</ThemedText>
          <ThemedText type="small">
            Demo profil – tady bude tvůj bio, odkazy a fotky. ☁️
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.grid}>
          {Array.from({ length: 9 }, (_, i) => (
            <ThemedView
              key={i}
              type="backgroundElement"
              style={styles.gridItem}
            />
          ))}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  bioSection: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.half,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#8884',
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
  },
});
