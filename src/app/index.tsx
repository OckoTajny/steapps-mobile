import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api, type Post } from '@/lib/api';
import { Spacing } from '@/constants/theme';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setPosts(await api.feed());
    } catch {
      setError('Nepodařilo se načíst feed. Běží server? (steapps-server)');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

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
          SteApps
        </ThemedText>

        {error ? (
          <ThemedView type="backgroundElement" style={styles.errorBox}>
            <ThemedText type="small">{error}</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => <PostCard post={item} />}
            ListEmptyComponent={
              <ThemedText type="small" style={styles.empty}>
                Zatím tu nic není.
              </ThemedText>
            }
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardHeader}>
        <ThemedView
          style={[styles.avatar, { backgroundColor: post.avatarColor }]}
        />
        <ThemedText type="smallBold">{post.author}</ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.image, { backgroundColor: post.imageColor }]}
      />

      <ThemedView style={styles.cardBody}>
        <ThemedText type="small">♥ {post.likes}</ThemedText>
        <ThemedText type="small">
          <ThemedText type="smallBold">{post.author}</ThemedText>{' '}
          {post.caption}
        </ThemedText>
      </ThemedView>
    </ThemedView>
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
  list: { paddingBottom: Spacing.four },
  errorBox: {
    margin: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
  },
  empty: { textAlign: 'center', padding: Spacing.four },
  card: { marginBottom: Spacing.three },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  image: { width: '100%', aspectRatio: 1 },
  cardBody: { gap: Spacing.half, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
});
