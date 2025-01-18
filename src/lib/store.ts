import { Episodes } from "@/types/episodes";
import { Hianime } from "@/types/hianime";
import { Info } from "@/types/info";
import { MangadexDetail } from "@/types/manga/detail";
import { MangadexFeed } from "@/types/manga/feed";
import { MangadexManga } from "@/types/manga/popular";
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

interface MangadexStore {
  popularManga: MangadexManga | null;
  setPopularManga: (popularManga: MangadexManga) => void;
  latestUpdate: MangadexManga | null;
  setLatestUpdate: (latestUpdate: MangadexManga) => void;
  detailManga: MangadexDetail | null;
  setDetailManga: (detailManga: MangadexDetail) => void;
  feedManga: MangadexFeed | null;
  setFeedManga: (feedManga: MangadexFeed) => void;
}

export const useMangadexStore = create<MangadexStore>((set) => ({
  popularManga: null,
  setPopularManga: (popularManga) => set({ popularManga }),
  latestUpdate: null,
  setLatestUpdate: (latestUpdate) => set({ latestUpdate }),
  detailManga: null,
  setDetailManga: (detailManga) => set({ detailManga }),
  feedManga: null,
  setFeedManga: (feedManga) => set({ feedManga }),
}));
