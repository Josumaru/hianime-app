import { Episodes } from "@/types/anime/episodes";
import { Hianime } from "@/types/anime/hianime";
import { Info } from "@/types/anime/info";
import { MangadexChapterImage } from "@/types/manga/chapter-image";
import { MangadexDetail } from "@/types/manga/detail";
import { MangadexFeed } from "@/types/manga/feed";
import { MangadexManga } from "@/types/manga/popular";
import { Servers } from "@/types/anime/servers";
import { Stream } from "@/types/anime/stream";
import { create } from "zustand";
import { Category } from "@/types/anime/category";

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
  tv: Category | null;
  setTv: (tv: Category) => void;
  movie: Category | null;
  setMovie: (movie: Category) => void;
  upcoming: Category | null;
  setUpcoming: (upcoming: Category) => void;
  topAiring: Category | null;
  setTopAiring: (topAiring: Category) => void;
  completed: Category | null;
  setCompleted: (completed: Category) => void;
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
  tv: null,
  setTv: (tv) => set({ tv }),
  movie: null,
  setMovie: (movie) => set({ movie }),
  upcoming: null,
  setUpcoming: (upcoming) => set({ upcoming }),
  topAiring: null,
  setTopAiring: (topAiring) => set({ topAiring }),
  completed: null,
  setCompleted: (completed) => set({ completed }),
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
  chapterImage: MangadexChapterImage | null;
  setChapterImage: (chapterImage: MangadexChapterImage) => void;
  selfPublished: MangadexManga | null;
  setSelfPublished: (selfPublished: MangadexManga) => void;
  staffPicks: MangadexManga | null;
  setStaffPicks: (staffPicks: MangadexManga) => void;
  featuredBySupporters: MangadexManga | null;
  setFeaturedBySupporters: (featuredBySupporters: MangadexManga) => void;
  seasonal: MangadexManga | null;
  setSeasonal: (seasonal: MangadexManga) => void;
  recentlyAdded: MangadexManga | null;
  setRecentlyAdded: (recentlyAdded: MangadexManga) => void;
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
  chapterImage: null,
  setChapterImage: (chapterImage) => set({ chapterImage }),
  selfPublished: null,
  setSelfPublished: (selfPublished) => set({ selfPublished }),
  staffPicks: null,
  setStaffPicks: (staffPicks) => set({ staffPicks }),
  featuredBySupporters: null,
  setFeaturedBySupporters: (featuredBySupporters) =>
    set({ featuredBySupporters }),
  seasonal: null,
  setSeasonal: (seasonal) => set({ seasonal }),
  recentlyAdded: null,
  setRecentlyAdded: (recentlyAdded) => set({ recentlyAdded }),
}));

interface SettingStore {
  isOpenSetting: boolean | null;
  setIsOpenSetting: (isOpenSetting: boolean) => void;
}

export const useSettingStore = create<SettingStore>((set) => ({
  isOpenSetting: null,
  setIsOpenSetting: (isOpenSetting) => set({ isOpenSetting }),
}));
