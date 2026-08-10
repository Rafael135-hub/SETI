"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface MusicContextValue {
  isSoundEnabled: boolean;
  volume: number;
  setVolume: (nextVolume: number) => void;
  toggleSound: () => void;
}

const MUSIC_PREFERENCE_KEY = "seti-sound-enabled";

const MusicContext = createContext<MusicContextValue>({
  isSoundEnabled: false,
  volume: 0.35,
  setVolume: () => {},
  toggleSound: () => {},
});

export function MusicProvider({ children }: PropsWithChildren) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.35);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadSoundPreference = window.setTimeout(() => {
      setIsSoundEnabled(window.localStorage.getItem(MUSIC_PREFERENCE_KEY) === "true");
    }, 0);

    return () => window.clearTimeout(loadSoundPreference);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;

    if (isSoundEnabled) {
      void audio.play().catch(() => setIsSoundEnabled(false));
    } else {
      audio.pause();
    }
  }, [isSoundEnabled, volume]);

  const setVolume = useCallback((nextVolume: number) => {
    setVolumeState(nextVolume);
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((currentSoundState) => {
      const nextSoundState = !currentSoundState;
      window.localStorage.setItem(MUSIC_PREFERENCE_KEY, String(nextSoundState));
      return nextSoundState;
    });
  }, []);

  const value = useMemo(
    () => ({ isSoundEnabled, volume, setVolume, toggleSound }),
    [isSoundEnabled, setVolume, toggleSound, volume],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src="/sb_electricdreams.mp3" loop preload="metadata" aria-hidden="true" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
