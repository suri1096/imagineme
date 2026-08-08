import { create } from "zustand";
import { persist } from "zustand/middleware";

export const AVATAR_EMOJIS = ["🐱","🐶","🦊","🐸","🦋","🐝","🐢","🦕","🌟","🌈","🍄","🌸"];

interface AuthState {
  userName: string | null;
  userEmoji: string;
  setProfile: (name: string, emoji: string) => void;
  clearProfile: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: null,
      userEmoji: AVATAR_EMOJIS[0],
      setProfile: (name, emoji) => set({ userName: name.trim(), userEmoji: emoji }),
      clearProfile: () => set({ userName: null }),
    }),
    { name: "imagineme-auth" }
  )
);
