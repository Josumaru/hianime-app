import { Episodes } from "@/types/episodes";
import { Hianime } from "@/types/hianime";
import { Info } from "@/types/info";
import { Servers } from "@/types/servers";
import { Stream } from "@/types/stream";
import { create } from "zustand";

interface StreamProps {
  stream: Stream;
  servers: Servers;
}

interface HianimeStore {
  hianime: Hianime | null;
  setHianime: (hianime: Hianime) => void;
  episodes: Episodes | null;
  setEpisodes: (episodes: Episodes) => void;
  stream: StreamProps | null;
  setStream: (stream: StreamProps) => void;
  info: Info | null;
  setInfo: (info: Info) => void;
}

export const useHianimeStore = create<HianimeStore>((set) => ({
  hianime: null,
  setHianime: (hianime) => set({ hianime }),
  episodes: null,
  setEpisodes: (episodes) => set({ episodes }),
  stream: null,
  servers: null,
  setStream: (stream) => set({ stream }),
  info: null,
  setInfo: (info) => set({ info }),
}));
