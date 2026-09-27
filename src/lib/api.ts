/**
 * Typed API client for the SteApps Rust backend (steapps-server).
 *
 * Set EXPO_PUBLIC_API_URL to point at a deployed server, e.g.
 *   EXPO_PUBLIC_API_URL=https://api.steapps.me
 * Defaults to a local dev server on port 8080.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export type Profile = {
  id: number;
  name: string;
  age: number;
  bio: string;
  color: string;
  likesYou: boolean;
};

export type Post = {
  id: number;
  author: string;
  avatarColor: string;
  imageColor: string;
  caption: string;
  likes: number;
};

export type SwipeResult = {
  matched: boolean;
  profileId: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  feed: () => request<Post[]>('/api/feed'),

  profiles: () => request<Profile[]>('/api/profiles'),

  swipe: (profileId: number, liked: boolean) =>
    request<SwipeResult>('/api/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, liked }),
    }),
};
