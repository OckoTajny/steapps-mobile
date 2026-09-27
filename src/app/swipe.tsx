import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api, type Profile } from '@/lib/api';
import { Spacing } from '@/constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

export default function SwipeScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Profile | null>(null);

  const load = useCallback(async () => {
    try {
      setProfiles(await api.profiles());
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const top = profiles[0];

  const handleSwipe = useCallback(
    async (liked: boolean) => {
      if (!top) return;
      setProfiles((prev) => prev.slice(1));
      try {
        const result = await api.swipe(top.id, liked);
        if (result.matched) setMatch(top);
      } catch {
        // offline / server down – swipe is just discarded for now
      }
    },
    [top],
  );

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ThemedText type="subtitle" style={styles.header}>
          Objevuj
        </ThemedText>

        <View style={styles.deck}>
          {profiles.slice(0, 3).map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              isTop={index === 0}
              onSwipe={handleSwipe}
            />
          ))}
          {profiles.length === 0 && (
            <ThemedView type="backgroundElement" style={styles.empty}>
              <ThemedText type="small">
                Nikdo další tu není. Zkus to později.
              </ThemedText>
            </ThemedView>
          )}
        </View>

        {match && (
          <ThemedView type="backgroundElement" style={styles.matchBanner}>
            <ThemedText type="smallBold">
              It&apos;s a match s {match.name}! 🎉
            </ThemedText>
          </ThemedView>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function SwipeCard({
  profile,
  isTop,
  onSwipe,
}: {
  profile: Profile;
  isTop: boolean;
  onSwipe: (liked: boolean) => void;
}) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${(translateX.value / SCREEN_WIDTH) * 25}deg` },
    ],
  }));

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const liked = event.translationX > 0;
        translateX.value = withSpring(
          liked ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5,
          { velocity: 2 },
        );
        runOnJS(onSwipe)(liked);
      } else {
        translateX.value = withSpring(0);
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.card, { backgroundColor: profile.color }, animatedStyle]}>
        <View style={styles.likeBadgeLeft}>
          <Text style={styles.badgeText}>LIKE</Text>
        </View>
        <View style={styles.likeBadgeRight}>
          <Text style={styles.badgeText}>NOPE</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  deck: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: '85%',
    borderRadius: 24,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardInfo: {
    padding: Spacing.four,
    gap: Spacing.one,
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  bio: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
  },
  likeBadgeLeft: {
    position: 'absolute',
    top: 24,
    left: 24,
    borderWidth: 3,
    borderColor: '#3cf26b',
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    transform: [{ rotate: '-15deg' }],
  },
  likeBadgeRight: {
    position: 'absolute',
    top: 24,
    right: 24,
    borderWidth: 3,
    borderColor: '#ff4f6d',
    borderRadius: 8,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    transform: [{ rotate: '15deg' }],
  },
  badgeText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  empty: {
    padding: Spacing.four,
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },
  matchBanner: {
    margin: Spacing.three,
    padding: Spacing.three,
    borderRadius: 16,
    alignItems: 'center',
  },
});
