"use client";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Poster, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { Suspense, use, useEffect, useState } from "react";
import { Stream } from "@/types/stream";
import {
  Button,
  Column,
  Flex,
  Grid,
  Heading,
  LetterFx,
  Row,
  SegmentedControl,
  SmartImage,
  SmartLink,
  Spinner,
  Tag,
  Text,
  User,
  useToast,
} from "@/once-ui/components";
import { getEpisodes, getInfo, getStream } from "@/lib/hianime";
import { Servers } from "@/types/servers";
import { decrypt, encrypt } from "@/lib/crypto";
import { Episode, Episodes } from "@/types/episodes";
import { Info } from "@/types/info";
import Link from "next/link";

interface StreamProps {
  stream: Stream;
  servers: Servers;
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const constructOptions = (episodes: Episode[], rangeSize: number) => {
  const groupedOptions = [];

  for (let i = 0; i < episodes.length; i += rangeSize) {
    const rangeStart = episodes[i].episode_no;
    const rangeEnd =
      episodes[Math.min(i + rangeSize - 1, episodes.length - 1)].episode_no; // Correctly calculate the last episode number in range
    const label = `${rangeStart}-${rangeEnd}`;

    groupedOptions.push({
      label,
      prefixIcon: "",
      suffixIcon: "",
      value: label,
    });
  }

  return groupedOptions;
};

const Page: NextPage<Props> = ({ params }) => {
  const id = decrypt(use(params).id);
  const [episodes, setEpisodes] = useState<Episodes | null>(null);
  const [data, setData] = useState<StreamProps | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rangeSize, setRangeSize] = useState<number[]>([0, 24]);
  const [loading, setLoading] = useState<boolean>(true);
  const [changingEpisode, setChangingEpisode] = useState<boolean>(false);
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const { addToast } = useToast();
  const handleEpisodeChange = async (id: string) => {
    setChangingEpisode(true);
    try {
      const response = await getStream(id, id);
      setCurrentStream(response.stream.results.streamingLink.link.file);
      window.history.replaceState(null, "", `/anime/watch/${encrypt(id)}`);
    } catch (error: any) {
      addToast({
        message: error.message,
        variant: "danger",
      });
    } finally {
      setChangingEpisode(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Hmm..., You tried something ? (˶ᵔ ᵕ ᵔ˶)");
        }
        const response = await getStream(id);
        const episodesResponse = await getEpisodes(id);
        const infoResponse = await getInfo(id);
        if (
          response.stream.results.streamingLink.link &&
          episodesResponse.results.episodes.length > 0 &&
          infoResponse.results.data
        ) {
          setData(response);
          setCurrentStream(response.stream.results.streamingLink.link.file);
          setEpisodes(episodesResponse);
          setInfo(infoResponse);
          setError("");
          addToast({
            message: "Yeay, enjoy your anime... ( ˶ˆᗜˆ˵ )",
            variant: "success",
          });
        } else {
          throw new Error("Hmm..., You're overloading my server !!! •`_´•");
        }
      } catch (error: any) {
        setError(error.message);
        addToast({
          message: error.message,
          variant: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <Flex justifyContent="center" fillWidth fillHeight>
        <LetterFx>
          <Text variant="code-default-l">{error}</Text>
        </LetterFx>
      </Flex>
    );
  }

  return loading ? (
    <Flex justifyContent="center" fillWidth fillHeight>
      <Spinner />
    </Flex>
  ) : (
    <Flex justifyContent="center" zIndex={9}>
      <Row paddingY="80" paddingX="s" maxWidth={"l"} fillWidth gap="12">
        <Column maxWidth={"s"} fillWidth gap={"12"}>
          {!changingEpisode && currentStream ? (
            <MediaPlayer style={{ width: "100%" }} src={currentStream}>
              <MediaProvider>
                {data?.stream.results.streamingLink.tracks.map(
                  (track, index) => (
                    <Track
                      key={`${index}`}
                      src={track.file}
                      kind={track.kind as TextTrackKind}
                      label={track.label}
                      default={track.label === "English"}
                    />
                  )
                )}
              </MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
          ) : (
            <Flex
              aspectRatio={16 / 9}
              fillWidth
              justifyContent="center"
              alignItems="center"
            >
              <Spinner></Spinner>
            </Flex>
          )}
          <Heading as="h3">
            {episodes?.results.episodes.find((episode) => episode.id == id)
              ?.japanese_title ?? ""}
          </Heading>
          <User
            name={info?.results.data.japanese_title}
            subline={info?.results.data.title}
            tagProps={{
              label: info?.results.data.showType,
              variant: "accent",
            }}
            avatarProps={{
              src: info?.results.data.poster,
            }}
          />
          <Column
            radius="l"
            background="brand-medium"
            border="brand-medium"
            padding="12"
          >
            <Row gap="8">
              {info?.results.data.animeInfo.Genres.map((genre) => (
                <Link key={genre} href={"/anime/genre"}>
                  <Text onBackground="brand-medium">{`#${genre}`}</Text>
                </Link>
              ))}
            </Row>
            <Text>{info?.results.data.animeInfo.Status}</Text>
            <Text>{info?.results.data.animeInfo.Overview}</Text>
          </Column>
          {/* {data?.servers.results.map((server) => (
            <Button key={server.data_id} label={server.serverName} />
          ))} */}
        </Column>
        <Column gap="4" fillWidth maxWidth={"xs"}>
          <SegmentedControl
            onToggle={(p) => {
              setRangeSize(p.split("-").map((num) => parseInt(num, 10) - 1));
            }}
            buttons={constructOptions(episodes?.results.episodes ?? [], 24)}
          />
          <Grid rows={4} columns={6} gap="2" fillWidth>
            {episodes?.results.episodes
              .slice(rangeSize[0], rangeSize[1])
              .map((episode) => (
                <Flex
                  key={episode.id}
                  padding="8"
                  cursor="pointer"
                  justifyContent="center"
                  onClick={() => handleEpisodeChange(episode.id)}
                  radius="m"
                  border={episode.filler ? "warning-strong" : "brand-strong"}
                  background={
                    episode.filler
                      ? "warning-strong"
                      : episode.id == id
                      ? "brand-medium"
                      : "brand-strong"
                  }
                  onBackground={
                    episode.filler
                      ? "warning-medium"
                      : episode.id == id
                      ? "brand-medium"
                      : "brand-medium"
                  }
                >
                  <Text>{episode.episode_no}</Text>
                </Flex>
              ))}
          </Grid>
          <Heading as="h3">Recommendations</Heading>
          <Column gap="8">
            {info?.results.data.recommended_data
              .slice(0, 4)
              .map((recomended) => (
                <Link
                  href={`/anime/detail/${encrypt(recomended.id)}`}
                  key={recomended.id}
                >
                  <Row
                    gap="8"
                    padding="4"
                    background="brand-medium"
                    border="brand-medium"
                    radius="l"
                    cursor="pointer"
                  >
                    <SmartImage
                      src={recomended.poster}
                      aspectRatio="2/3"
                      fillWidth
                      width={"80"}
                      radius="m"
                    />
                    <Column gap="2" width={"xs"}>
                      <Text onBackground="brand-medium">
                        {recomended.japanese_title ?? recomended.title}
                      </Text>
                      <Text onBackground="brand-medium">
                        <Text as={"span"} onBackground="info-medium">
                          {" "}
                          {recomended.tvInfo.duration?.replaceAll("m", " Min")}
                          {" - "}
                        </Text>
                        {recomended.tvInfo.eps ?? 1}
                        <Text as={"span"} onBackground="info-medium">
                          {" "}
                          Episodes
                        </Text>
                      </Text>
                      <Row gap="4">
                        <Tag
                          variant="brand"
                          label={
                            recomended.tvInfo.showType == ""
                              ? "Movie"
                              : recomended.tvInfo.showType
                          }
                        />
                        {recomended.adultContent && (
                          <Tag variant="danger" label="18+" />
                        )}
                      </Row>
                    </Column>
                  </Row>
                </Link>
              ))}
          </Column>
        </Column>
      </Row>
    </Flex>
  );
};

export default Page;

const episodesJson = {
  success: true,
  results: {
    totalEpisodes: 1122,
    episodes: [
      {
        episode_no: 1,
        id: "one-piece-100?ep=2142",
        title: "I'm Luffy! The Man Who's Gonna Be King of the Pirates!",
        japanese_title: "Ore wa Luffy! Kaizoku Ou ni Naru Otoko Da!",
        filler: false,
      },
      {
        episode_no: 2,
        id: "one-piece-100?ep=2143",
        title: "Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!",
        japanese_title: "Daikengou Arawaru! Kaizokugari Roronoa Zoro",
        filler: false,
      },
      {
        episode_no: 3,
        id: "one-piece-100?ep=2144",
        title: "Morgan versus Luffy! Who",
        japanese_title: "Morgan vs. Luffy! Nazo no Bishoujo wa Dare?",
        filler: false,
      },
      {
        episode_no: 4,
        id: "one-piece-100?ep=2145",
        title: "Luffy",
        japanese_title: "Luffy no Kako! Akagami no Shanks Toujou",
        filler: false,
      },
      {
        episode_no: 5,
        id: "one-piece-100?ep=2146",
        title:
          "A Terrifying Mysterious Power! Captain Buggy, the Clown Pirate!",
        japanese_title: "Kyoufu Nazo no Chikara! Kaizoku Douke Buggy-senchou!",
        filler: false,
      },
      {
        episode_no: 6,
        id: "one-piece-100?ep=2147",
        title: "Desperate Situation! Beast Tamer Mohji vs. Luffy!",
        japanese_title: "Zettai Zetsumei! Moujuutsukai Mohji VS Luffy!",
        filler: false,
      },
      {
        episode_no: 7,
        id: "one-piece-100?ep=2148",
        title: "Epic Showdown! Swordsman Zoro vs. Acrobat Cabaji!",
        japanese_title: "Souzetsu Kettou! Kengou Zoro vs Kyokugei no Cabaji!",
        filler: false,
      },
      {
        episode_no: 8,
        id: "one-piece-100?ep=2149",
        title: "Who is the Victor? Devil Fruit Power Showdown!",
        japanese_title: "Shousha wa Dotchi? Akuma no Mi no Nouryoku Taiketsu!",
        filler: false,
      },
      {
        episode_no: 9,
        id: "one-piece-100?ep=2150",
        title: "The Honorable Liar? Captain Usopp!",
        japanese_title: "Seigi no Usotsuki? Captain Usopp",
        filler: false,
      },
      {
        episode_no: 10,
        id: "one-piece-100?ep=2151",
        title: "The Weirdest Guy Ever! Jango the Hypnotist!",
        japanese_title: "Shijou Saikyou no Hen na Yatsu! Saiminjutsushi Jango",
        filler: false,
      },
      {
        episode_no: 11,
        id: "one-piece-100?ep=2152",
        title: "Expose the Plot! Pirate Butler, Captain Kuro!",
        japanese_title: "Inbou wo Abake! Kaizoku Shitsuji Captain Kuro",
        filler: false,
      },
      {
        episode_no: 12,
        id: "one-piece-100?ep=2153",
        title:
          "Clash with the Black Cat Pirates! The Great Battle on the Slope!",
        japanese_title:
          "Gekitotsu! Kuroneko Kaizoku-dan Sakamichi no Daikoubou!",
        filler: false,
      },
      {
        episode_no: 13,
        id: "one-piece-100?ep=2154",
        title: "The Terrifying Duo! Meowban Brothers vs. Zoro!",
        japanese_title: "Kyoufu no Futarigumi! Nyaban Brothers VS Zoro",
        filler: false,
      },
      {
        episode_no: 14,
        id: "one-piece-100?ep=2155",
        title: "Luffy Back in Action! Miss Kaya",
        japanese_title: "Luffy Fukkatsu! Kaya-ojousama no Kesshi no Teikou",
        filler: false,
      },
      {
        episode_no: 15,
        id: "one-piece-100?ep=2156",
        title: "Beat Kuro! Usopp the Man",
        japanese_title: "Kuro wo Taose! Otoko Usopp Namida no Ketsui!",
        filler: false,
      },
      {
        episode_no: 16,
        id: "one-piece-100?ep=2157",
        title: "Protect Kaya! The Usopp Pirates",
        japanese_title: "Kayaw wo Mamore! Usopp Kaizoku-dan dai Katsuyaku!",
        filler: false,
      },
      {
        episode_no: 17,
        id: "one-piece-100?ep=2158",
        title: "Angry Explosion! Kuro vs. Luffy! How it Ends!",
        japanese_title: "Ikari Bakuhatsu! Kuro vs Luffy Ketchaku no Yukue!",
        filler: false,
      },
      {
        episode_no: 18,
        id: "one-piece-100?ep=2159",
        title: "You",
        japanese_title: "Anta ga Chinju! Gaimon to Kimyou na Nakama",
        filler: false,
      },
      {
        episode_no: 19,
        id: "one-piece-100?ep=2160",
        title: "The Three-Sword Style",
        japanese_title: "Santouryuu no Kako! Zoro to Kuina no Chikai!",
        filler: false,
      },
      {
        episode_no: 20,
        id: "one-piece-100?ep=2161",
        title: "Famous Cook! Sanji of the Sea Restaurant!",
        japanese_title: "Meibutsu Kokku! Kaijou Restaurant no Sanji",
        filler: false,
      },
      {
        episode_no: 21,
        id: "one-piece-100?ep=2162",
        title: "Unwelcome Customer! Sanji",
        japanese_title: "Manekarezaru Kyaku! Sanji no Meshi to Gin no On",
        filler: false,
      },
      {
        episode_no: 22,
        id: "one-piece-100?ep=2163",
        title: "The Strongest Pirate Fleet! Commodore Don Krieg!",
        japanese_title: "Saikyou no Kaizoku Kantai! Teitoku Don Krieg",
        filler: false,
      },
      {
        episode_no: 23,
        id: "one-piece-100?ep=2164",
        title: "Protect Baratie! The Great Pirate, Red Foot Zeff!",
        japanese_title: "Mamore Baratie! Dai Kaizoku: Akaashi no Zeff",
        filler: false,
      },
      {
        episode_no: 24,
        id: "one-piece-100?ep=2165",
        title: "Hawk-Eye Mihawk! The Great Swordsman Zoro Falls At Sea!",
        japanese_title: "Taka no Me no Mihawk! Kengou Zoro Umi ni Chiru",
        filler: false,
      },
      {
        episode_no: 25,
        id: "one-piece-100?ep=2166",
        title:
          "The Deadly Foot Technique Bursts Forth! Sanji vs. The Invincible Pearl!",
        japanese_title:
          "Hissatsu Ashiwaza Sakuretsu! Sanji vs Teppeki no Pearl",
        filler: false,
      },
      {
        episode_no: 26,
        id: "one-piece-100?ep=2167",
        title: "Zeff and Sanji",
        japanese_title: "Zeff to Sanji no Yume Maboroshi no All Blue",
        filler: false,
      },
      {
        episode_no: 27,
        id: "one-piece-100?ep=2168",
        title:
          "Cool-headed, Cold-hearted Demon! Pirate Fleet Chief Commander Gin!",
        japanese_title: "Reitetsu Hijou no Kijin Kaizoku Kantai Souchou Gin",
        filler: false,
      },
      {
        episode_no: 28,
        id: "one-piece-100?ep=2169",
        title: "I Won`t Die! Fierce Battle, Luffy vs. Krieg!",
        japanese_title: "Shinanee yo! Gekitou Luffy vs Krieg!",
        filler: false,
      },
      {
        episode_no: 29,
        id: "one-piece-100?ep=2170",
        title:
          "The Conclusion of the Deadly Battle! A Spear of Blind Determination!",
        japanese_title: "Shitou no Ketchaku! Hara ni Kukutta Ippon no Yari!",
        filler: false,
      },
      {
        episode_no: 30,
        id: "one-piece-100?ep=2171",
        title: "Set Sail! The Seafaring Cook Sets off With Luffy!",
        japanese_title: "Tabidachi! Umi no Kokku wa Luffy to Tomo Ni",
        filler: false,
      },
      {
        episode_no: 31,
        id: "one-piece-100?ep=2172",
        title: "The Worst Man in the Eastern Seas! Fishman Pirate Arlong!",
        japanese_title:
          "Higashi no Umi Saiaku no Otoko! Gyojin Kaizoku Arlong!",
        filler: false,
      },
      {
        episode_no: 32,
        id: "one-piece-100?ep=2173",
        title: "Witch of Cocoyashi Village! Arlong",
        japanese_title: "Kokoyashi Mura no Majo! Arlong no Onna Kanbu",
        filler: false,
      },
      {
        episode_no: 33,
        id: "one-piece-100?ep=2174",
        title: "Usopp Dead?! When is Luffy Going to Make Landfall?!",
        japanese_title: "Usopp Shisu? Luffy Jouriku wa Mada?",
        filler: false,
      },
      {
        episode_no: 34,
        id: "one-piece-100?ep=2175",
        title: "Everyone`s Gathered! Usopp Speaks the Truth About Nami!",
        japanese_title: "Zenin Shuuketsu! Usopp ga Kataru Nami no Shinjitsu",
        filler: false,
      },
      {
        episode_no: 35,
        id: "one-piece-100?ep=2176",
        title: "Untold Past! Female Warrior Bellemere!",
        japanese_title: "Himerareta Kako! Onna Senshi Bellemere!",
        filler: false,
      },
      {
        episode_no: 36,
        id: "one-piece-100?ep=2177",
        title: "Survive! Mother Bellemere and Nami",
        japanese_title: "Ikinuke! Haha Bellemere to Nami no Kizuna!",
        filler: false,
      },
      {
        episode_no: 37,
        id: "one-piece-100?ep=2178",
        title: "Luffy Rises! Result of the Broken Promise!",
        japanese_title: "Luffy Tatsu! Uragirareta Yakusoku no Ketsumatsu!",
        filler: false,
      },
      {
        episode_no: 38,
        id: "one-piece-100?ep=2179",
        title: "Luffy in Big Trouble! Fishmen vs. the Luffy Pirates!",
        japanese_title: "Luffy Dai Pinchi! Gyojin vs Luffy Kaizoku-dan",
        filler: false,
      },
      {
        episode_no: 39,
        id: "one-piece-100?ep=2180",
        title: "Luffy Submerged! Zoro vs. Hatchan the Octopus!",
        japanese_title: "Luffy Suibotsu! Zoro vs Tako no Hatchan",
        filler: false,
      },
      {
        episode_no: 40,
        id: "one-piece-100?ep=2181",
        title: "Proud Warriors! Sanji and Usopp",
        japanese_title: "Hokori Takaki Senshi! Gekitou Sanji to Usopp",
        filler: false,
      },
      {
        episode_no: 41,
        id: "one-piece-100?ep=2182",
        title: "Luffy at Full Power! Nami",
        japanese_title: "Luffy Zenkai! Nami no Ketsui to Mugiwara Boushi",
        filler: false,
      },
      {
        episode_no: 42,
        id: "one-piece-100?ep=2183",
        title: "Explosion! Fishman Arlong`s Fierce Assault from the Sea!",
        japanese_title: "Sakuretsu! Gyojin Arlong Umi Kara no Moukougeki!",
        filler: false,
      },
      {
        episode_no: 43,
        id: "one-piece-100?ep=2184",
        title: "End of the Fishman Empire! Nami",
        japanese_title: "Gyojin Teikoku no Owari! Nami wa Ore no Nakama da!",
        filler: false,
      },
      {
        episode_no: 44,
        id: "one-piece-100?ep=2185",
        title:
          "Setting Out with a Smile! Farewell, Hometown Cocoyashi Village!",
        japanese_title: "Egao no Tabitachi! Saraba Kokyou Cocoyashi Mura",
        filler: false,
      },
      {
        episode_no: 45,
        id: "one-piece-100?ep=2186",
        title: "Bounty! Straw Hat Luffy Becomes Known to the World!",
        japanese_title: "Shoukinkubi! Mugiwara no Luffy yo ni Shirewataru",
        filler: false,
      },
      {
        episode_no: 46,
        id: "one-piece-100?ep=2187",
        title: "Chase Straw Hat! Little Buggy",
        japanese_title: "Mugiwara wo Oe! Chiisana Buggy no Dai Bouken",
        filler: false,
      },
      {
        episode_no: 47,
        id: "one-piece-100?ep=2188",
        title: "The Wait is Over! The Return of Captain Buggy!",
        japanese_title: "Omachi Ka Ne! Aa Fukkatsu no Buggy Senchou",
        filler: false,
      },
      {
        episode_no: 48,
        id: "one-piece-100?ep=2189",
        title: "The Town of the Beginning and the End! Landfall at Logue Town!",
        japanese_title: "Hajimari to Owari no Machi: Logue Town Jouriku",
        filler: false,
      },
      {
        episode_no: 49,
        id: "one-piece-100?ep=2190",
        title:
          "Kitetsu III and Yubashiri! Zoro’s New Swords and the Woman Sergeant Major!",
        japanese_title:
          "Sandai Kitetsu to Yubashiri! Zoro no Shintou to Josouchou",
        filler: false,
      },
      {
        episode_no: 50,
        id: "one-piece-100?ep=2191",
        title: "Usopp vs. Daddy the Parent! Showdown at High!",
        japanese_title: "Usopp vs Kozure no Dadi Mahiru no Kettou",
        filler: false,
      },
      {
        episode_no: 51,
        id: "one-piece-100?ep=2192",
        title: "Fiery Cooking Battle? Sanji vs. the Beautiful Chef!",
        japanese_title: "Hono no Ryouri Battle? Sanji vs Bijin Chef",
        filler: false,
      },
      {
        episode_no: 52,
        id: "one-piece-100?ep=2193",
        title: "Buggy",
        japanese_title: "Buggy no Revenge! Shokeidai de Warau Otoko!",
        filler: false,
      },
      {
        episode_no: 53,
        id: "one-piece-100?ep=2194",
        title: "The Legend Has Started! Head for the Grand Line!",
        japanese_title: "Densetsu wa Hajimatta! Mezase Idai Naru Kouro",
        filler: false,
      },
      {
        episode_no: 54,
        id: "one-piece-100?ep=2195",
        title: "Precursor to a New Adventure! Apis, a Mysterious Girl!",
        japanese_title: "Arata Naru Bouken no Yokan! Nazo no Shoujo Apis",
        filler: true,
      },
      {
        episode_no: 55,
        id: "one-piece-100?ep=2196",
        title: "Miraculous Creature! Apis",
        japanese_title:
          "Kiseki no Ikimono! Apis no Himitsu to Densetsu no Shima",
        filler: true,
      },
      {
        episode_no: 56,
        id: "one-piece-100?ep=2197",
        title: "Eric Attacks! Great Escape from Warship Island!",
        japanese_title: "Eric Shutsugeki! Gunkanjima Kara no Dai Dasshutsu!",
        filler: true,
      },
      {
        episode_no: 57,
        id: "one-piece-100?ep=2198",
        title:
          "A Solitary Island in the Distant Sea! The Legendary Lost Island!",
        japanese_title: "Zekkai no Kotou! Densetsu no Lost Island",
        filler: true,
      },
      {
        episode_no: 58,
        id: "one-piece-100?ep=2199",
        title: "Showdown in the Ruins! Tense Zoro vs. Eric!",
        japanese_title: "Haikyou no Kettou! Kinpaku no Zoro vs Eric!",
        filler: true,
      },
      {
        episode_no: 59,
        id: "one-piece-100?ep=2200",
        title: "Luffy, Completely Surrounded! Commodore Nelson",
        japanese_title: "Luffy Kanzen Houi! Teitoku Nelson no Hissaku",
        filler: true,
      },
      {
        episode_no: 60,
        id: "one-piece-100?ep=2201",
        title: "Through the Sky They Soar! The 1000 Year Legend Lives Again!",
        japanese_title: "Ousora wo Mau Mono! Yomigaeru Sennen no Densetsu!",
        filler: true,
      },
      {
        episode_no: 61,
        id: "one-piece-100?ep=2202",
        title: "An Angry Showdown! Cross the Red Line!",
        japanese_title: "Ikari no Ketchaku! Akai Dairiku wo Norikoero!",
        filler: false,
      },
      {
        episode_no: 62,
        id: "one-piece-100?ep=2203",
        title: "The First Line of Defense? The Giant Whale Laboon Appears!",
        japanese_title: "Sasho no Toride? Kyodai Kujira Laboon Arawareru",
        filler: false,
      },
      {
        episode_no: 63,
        id: "one-piece-100?ep=2204",
        title: "A Promise Between Men! Luffy and the Whale Vow to Meet Again!",
        japanese_title: "Otoko no Yakusoku! Luffy to Kujira Saikai no Chikai",
        filler: false,
      },
      {
        episode_no: 64,
        id: "one-piece-100?ep=2205",
        title: "A Town that Welcomes Pirates? Setting Foot on Whisky Peak!",
        japanese_title: "Kaizoku Kangei no Machi? Whisky Jouriku",
        filler: false,
      },
      {
        episode_no: 65,
        id: "one-piece-100?ep=2206",
        title: "Explosion! The Three Swords Style! Zoro vs. Baroque Works!",
        japanese_title: "Sakuretsu Santouryuu! Zoro vs Baroque Works",
        filler: false,
      },
      {
        episode_no: 66,
        id: "one-piece-100?ep=2207",
        title: "All Out Battle! Luffy vs. Zoro, Mysterious Grand Duel!",
        japanese_title: "Shinken Shoubu! Luffy vs Zoro Nazo no Dai Kettou",
        filler: false,
      },
      {
        episode_no: 67,
        id: "one-piece-100?ep=2208",
        title: "Deliver Princess Vivi! The Luffy Pirates Set Sail!",
        japanese_title: "Oujo Vivi wo Todokero! Luffy Kaizoku Dan Shukkou",
        filler: false,
      },
      {
        episode_no: 68,
        id: "one-piece-100?ep=2209",
        title: "Try Hard, Coby! Coby and Helmeppo",
        japanese_title: "Ganbare Coby! Coby-Meppo Kaigun Funtouki",
        filler: false,
      },
      {
        episode_no: 69,
        id: "one-piece-100?ep=2210",
        title: "Coby and Helmeppo",
        japanese_title: "Coby-Meppo no Ketsui! Garp Chuushou no Oyagokoro",
        filler: false,
      },
      {
        episode_no: 70,
        id: "one-piece-100?ep=2211",
        title: "An Ancient Island! The Shadow Hiding in Little Garden!",
        japanese_title: "Taiko no Shima! Little Garden ni Hisomu Kage!",
        filler: false,
      },
      {
        episode_no: 71,
        id: "one-piece-100?ep=2212",
        title: "Huge Duel! The Giants Dorry and Brogy!",
        japanese_title: "Dekkai Kettou! Kyojin Dorry to Brogy",
        filler: false,
      },
      {
        episode_no: 72,
        id: "one-piece-100?ep=2213",
        title: "Luffy Gets Angry! A Dirty Trick Violates the Sacred Duel!",
        japanese_title: "Luffy Okoru! Seinaru Kettou ni Hiretsu na Wana",
        filler: false,
      },
      {
        episode_no: 73,
        id: "one-piece-100?ep=2214",
        title: "Broggy",
        japanese_title: "Broggy Shouri no Goukyuu! Elbaf no Ketchaku!",
        filler: false,
      },
      {
        episode_no: 74,
        id: "one-piece-100?ep=2215",
        title: "The Devilish Candle! Tears of Regret and Tears of Anger!",
        japanese_title: "Ma no Candle! Munen no Namida to Okari no Namida",
        filler: false,
      },
      {
        episode_no: 75,
        id: "one-piece-100?ep=2216",
        title: "A Hex on Luffy! Colors Trap!",
        japanese_title: "Luffy wo Osou Maryoku! Colors Trap!",
        filler: false,
      },
      {
        episode_no: 76,
        id: "one-piece-100?ep=2217",
        title: "Time to Fight Back! Usopp",
        japanese_title: "Iza Hangeki! Usopp no Kiten to Kaenboshi!",
        filler: false,
      },
      {
        episode_no: 77,
        id: "one-piece-100?ep=2218",
        title: "Farewell Giant Island! Head for Alabasta!",
        japanese_title: "Saraba Kyojin no Shima! Alabasta wo Mezase",
        filler: false,
      },
      {
        episode_no: 78,
        id: "one-piece-100?ep=2219",
        title: "Nami",
        japanese_title: "Nami ga Byouki? Umi ni Furu Yuki no Mukou ni!",
        filler: false,
      },
      {
        episode_no: 79,
        id: "one-piece-100?ep=2220",
        title: "A Raid! The Bliking and Blik Wapol!",
        japanese_title: "Kishuu! Bliking Gou to Blik no Wapol",
        filler: false,
      },
      {
        episode_no: 80,
        id: "one-piece-100?ep=2221",
        title: "An Island without Doctors? Adventure in a Nameless Land!",
        japanese_title: "Isha no Inai Shima? Na mo Naki Kuni no Bouken",
        filler: false,
      },
      {
        episode_no: 81,
        id: "one-piece-100?ep=2222",
        title: "Are You Happy? The Doctor Called Witch!",
        japanese_title: "Happy Kai? Majo to Yobareta Isha!",
        filler: false,
      },
      {
        episode_no: 82,
        id: "one-piece-100?ep=2223",
        title: "Dalton",
        japanese_title: "Dalton no Kakugo! Wapol Gundan Shima ni Jouriku",
        filler: false,
      },
      {
        episode_no: 83,
        id: "one-piece-100?ep=2224",
        title: "The Island Where Snow Lives! Climb the Drum Rockies!",
        japanese_title: "Yuki no Sumi Shima! Drum Rockies wo Nobore!",
        filler: false,
      },
      {
        episode_no: 84,
        id: "one-piece-100?ep=2225",
        title: "Blue-nosed Reindeer! Chopper",
        japanese_title: "Tonakai wa Aoppana! Chopper no Himitsu!",
        filler: false,
      },
      {
        episode_no: 85,
        id: "one-piece-100?ep=2226",
        title: "An Outcast",
        japanese_title: "Hamidashimono no Yume! Yabu Isha Hiluluk!",
        filler: false,
      },
      {
        episode_no: 86,
        id: "one-piece-100?ep=2227",
        title: "Hiluluk",
        japanese_title: "Hiluluk no Sakura to Uketsugare Yuku Ishi!",
        filler: false,
      },
      {
        episode_no: 87,
        id: "one-piece-100?ep=2228",
        title: "Fight Wapol",
        japanese_title: "VS Wapol Gundan! Bakubaku no mi no Nouryoku!",
        filler: false,
      },
      {
        episode_no: 88,
        id: "one-piece-100?ep=2229",
        title: "Zoan-type Devil Fruit! Chopper",
        japanese_title: "Zoan Kei Akuma no mi! Chopper Shichidan Hengei",
        filler: false,
      },
      {
        episode_no: 89,
        id: "one-piece-100?ep=2230",
        title: "When the Kingdom",
        japanese_title:
          "Oukoku no Shihai Owaru Toki! Shinnen no Hata wa Eien ni",
        filler: false,
      },
      {
        episode_no: 90,
        id: "one-piece-100?ep=2231",
        title: "Hiluluk",
        japanese_title: "Hiluluk no Sakura! Drum Rockies no Kiseki",
        filler: false,
      },
      {
        episode_no: 91,
        id: "one-piece-100?ep=2232",
        title: "Goodbye Drum Island! I",
        japanese_title: "Sayounara Doramujima! Boku wa Umi e Deru!",
        filler: false,
      },
      {
        episode_no: 92,
        id: "one-piece-100?ep=2233",
        title: "Alabasta",
        japanese_title: "Alabasta no Eiyuu to Senjou no Ballerina",
        filler: false,
      },
      {
        episode_no: 93,
        id: "one-piece-100?ep=2234",
        title:
          "Off to the Desert Kingdom! The Rain-Summing Powder and the Rebel Army!",
        japanese_title: "Iza Sabaku no Kuni e! Ame wo Yobu Kona to Hanrangun",
        filler: false,
      },
      {
        episode_no: 94,
        id: "one-piece-100?ep=2235",
        title: "The Reunion of Heroes! His Name is Fire Fist Ace!",
        japanese_title: "Gouketsutachi no Saikai! Yatsu no na wa Hiken no Ace",
        filler: false,
      },
      {
        episode_no: 95,
        id: "one-piece-100?ep=2236",
        title: "Ace and Luffy! Hot Emotions and Brotherly Bonds!",
        japanese_title: "Ace to Luffy! Atsuki Omoi to Kyoudai no Kizuna",
        filler: false,
      },
      {
        episode_no: 96,
        id: "one-piece-100?ep=2237",
        title: "Erumalu, the City of Green and the Kung Fu Dugongs!",
        japanese_title: "Midori no Machi Erumalu to Kung fu Jugon!",
        filler: false,
      },
      {
        episode_no: 97,
        id: "one-piece-100?ep=2238",
        title:
          "Adventure in the Country of Sand! The Monsters that Live in the Scorching Land!",
        japanese_title:
          "Suna no Kuni no Bouken! Ennetsu no Daichi ni Sugomu Mamono",
        filler: false,
      },
      {
        episode_no: 98,
        id: "one-piece-100?ep=2239",
        title: "Enter the Desert Pirates! The Men Who Live Freely!",
        japanese_title:
          "Sabaku no Kaizokudan Toujou! Jiyuu ni Ikiru Otokotachi",
        filler: true,
      },
      {
        episode_no: 99,
        id: "one-piece-100?ep=2240",
        title: "False Fortitude! Camu, Rebel Soldier at Heart!",
        japanese_title: "Nisemono no Iji! Kokoro no Hanrangun Kamyu!",
        filler: true,
      },
      {
        episode_no: 100,
        id: "one-piece-100?ep=2241",
        title: "Rebel Warrior Kohza! The Dream Vowed to Vivi!",
        japanese_title: "Hanrangun Senshi Kohza! Vivi ni Chikatta Yume!",
        filler: false,
      },
      {
        episode_no: 101,
        id: "one-piece-100?ep=2242",
        title: "Showdown in a Heat Haze! Ace vs. the Gallant Scorpion!",
        japanese_title: "Youen no Kettou! Ace vs Otoko Scorpion",
        filler: false,
      },
      {
        episode_no: 102,
        id: "one-piece-100?ep=2243",
        title: "Ruins and Lost Ways! Vivi, Her Friends, and the Country",
        japanese_title: "Kiseki to Maigo! Vivi to Nakama to Kuni no Katachi",
        filler: true,
      },
      {
        episode_no: 103,
        id: "one-piece-100?ep=2244",
        title: "Spiders Café at 8 o",
        japanese_title: "Spider",
        filler: false,
      },
      {
        episode_no: 104,
        id: "one-piece-100?ep=2245",
        title: "Luffy vs. Vivi! The Tearful Vow to Put Friends on the Line!",
        japanese_title: "Luffy vs Vivi! Nakama ni Kakeru Namida no Chikai",
        filler: false,
      },
      {
        episode_no: 105,
        id: "one-piece-100?ep=2246",
        title: "The Battlefront of Alabasta! Rainbase, the City of Dreams!",
        japanese_title: "Alabasta Sensen! Yume no Machi Rainbase!",
        filler: false,
      },
      {
        episode_no: 106,
        id: "one-piece-100?ep=2247",
        title: "The Trap of Certain Defeat! Storming Raindinners!",
        japanese_title: "Zettai Zetsumei no Wana! Rain Dinners Totsunyuu",
        filler: false,
      },
      {
        episode_no: 107,
        id: "one-piece-100?ep=2248",
        title: "Operation Utopia Commences! The Swell of Rebellion Stirs!",
        japanese_title: "Utopia Sakusen Hatsudou! Ugokidashita Hanran",
        filler: false,
      },
      {
        episode_no: 108,
        id: "one-piece-100?ep=2249",
        title: "The Terrifying Banana Gators and Mr. Prince!",
        japanese_title: "Kyoufu no Bananawani to Mr. Prince",
        filler: false,
      },
      {
        episode_no: 109,
        id: "one-piece-100?ep=2250",
        title: "The Key to a Great Comeback Escape! The Wax-Wax Ball!",
        japanese_title: "Gyakuden Dai Dasshutsu e no Kagi! Dorudoru Ball!",
        filler: false,
      },
      {
        episode_no: 110,
        id: "one-piece-100?ep=2251",
        title: "Merciless Mortal Combat! Luffy vs. Crocodile!",
        japanese_title: "Joumuyou no Shitou! Luffy vs Crocodile!",
        filler: false,
      },
      {
        episode_no: 111,
        id: "one-piece-100?ep=2252",
        title: "Dash For a Miracle! Alabasta Animal Land!",
        japanese_title: "Kiseki e no Shissou! Alabasta Doubutsu Land",
        filler: false,
      },
      {
        episode_no: 112,
        id: "one-piece-100?ep=2253",
        title: "Rebel Army vs. Royal Army! Showdown at Alubarna!",
        japanese_title: "Hanrangun vs Kokuougun! Kessen wa Alubarna!",
        filler: false,
      },
      {
        episode_no: 113,
        id: "one-piece-100?ep=2254",
        title: "Alubarna Grieves! The Fierce Captain Carue!",
        japanese_title: "Naki no Alubarna! Gekitou Carue Taichou",
        filler: false,
      },
      {
        episode_no: 114,
        id: "one-piece-100?ep=2255",
        title: "Sworn on a Friend",
        japanese_title:
          "Nakama no Yumi ni Chikau! Kettou Mogura Tsuka 4 Banchou",
        filler: false,
      },
      {
        episode_no: 115,
        id: "one-piece-100?ep=2256",
        title: "Big Performance",
        japanese_title: "Honjitsu Dai Koukai! Manemane Montage!",
        filler: false,
      },
      {
        episode_no: 116,
        id: "one-piece-100?ep=2257",
        title: "Transformed into Nami! Bon Clay",
        japanese_title: "Nami ni Henshin! Bon Clay Renpatsu Ballet Kenpou",
        filler: false,
      },
      {
        episode_no: 117,
        id: "one-piece-100?ep=2258",
        title: "Nami",
        japanese_title: "Nami no Senpuu Chuuihou! Clima Tact Sakuretsu!",
        filler: false,
      },
      {
        episode_no: 118,
        id: "one-piece-100?ep=2259",
        title:
          "Secret Passed Down in the Royal Family! The Ancient Weapon Pluton!",
        japanese_title: "Ouke ni Tsuwaru Himitsu! Kodai Heiki Pluton",
        filler: false,
      },
      {
        episode_no: 119,
        id: "one-piece-100?ep=2260",
        title:
          "Secret of Powerful Swordplay! Ability to Cut Steel and the Rhythm Things Have!",
        japanese_title:
          "Gouken no Kyokui! Hagane wo Kiru Chikara to Mono no Kokyuu",
        filler: false,
      },
      {
        episode_no: 120,
        id: "one-piece-100?ep=2261",
        title: "The Battle is Over! Kohza Raises the White Flag!",
        japanese_title: "Tatakai wa Owatta! Kohza ga Ageta Shiroi Hata",
        filler: false,
      },
      {
        episode_no: 121,
        id: "one-piece-100?ep=2262",
        title: "Where Vivi",
        japanese_title: "Vivi no Koe no Yuke! Eiyuu wa Maiorita!",
        filler: false,
      },
      {
        episode_no: 122,
        id: "one-piece-100?ep=2263",
        title: "Sand Croc and Water Luffy! The Second Round of the Duel!",
        japanese_title: "Suna Wani to Mizu Luffy! Kettou Dai ni Round",
        filler: false,
      },
      {
        episode_no: 123,
        id: "one-piece-100?ep=2264",
        title: "That Looks Croc-ish! Luffy, Run to the Royal Tomb!",
        japanese_title: "Wanippoi! Ouke no Haka e Hashire Luffy!",
        filler: false,
      },
      {
        episode_no: 124,
        id: "one-piece-100?ep=2265",
        title: "The Nightmare Draws Near! This is the Sand-Sand Clan",
        japanese_title:
          "Akumu no Toki Hakaru! Koko wa Sunasunadan Himitsu Kichi",
        filler: false,
      },
      {
        episode_no: 125,
        id: "one-piece-100?ep=2266",
        title:
          "Magnificent Wings! My Name is Pell, Guardian Deity of the Country!",
        japanese_title: "Idai Naru Tsubame! Wa ga na wa Kuno no Shigoshin Pell",
        filler: false,
      },
      {
        episode_no: 126,
        id: "one-piece-100?ep=2267",
        title: "I Will Surpass You! Rain Falls in Alabasta!",
        japanese_title: "Koete Iku! Alabasta ni Ame ga Furu!",
        filler: false,
      },
      {
        episode_no: 127,
        id: "one-piece-100?ep=2268",
        title: "A Farewell to Arms! Pirates and Different Ideas of Justice!",
        japanese_title: "Buki yo Saraba! Kaizoku to Ikutsu ka no Seigi",
        filler: false,
      },
      {
        episode_no: 128,
        id: "one-piece-100?ep=2269",
        title: "The Pirates",
        japanese_title: "Kaizokutachi no Utage to Alabasta Dasshutsu Sakusen!",
        filler: false,
      },
      {
        episode_no: 129,
        id: "one-piece-100?ep=2270",
        title:
          "It All Started On That Day! Vivi Tells the Story of Her Adventure!",
        japanese_title: "Hajimaru wa Ano hi! Vivi ga Kataru Boukendan",
        filler: false,
      },
      {
        episode_no: 130,
        id: "one-piece-100?ep=2271",
        title: "Scent of Danger! The Seventh Member is Nico Robin!",
        japanese_title: "Kiken na Kaori! Shichininme wa Nico Robin!",
        filler: false,
      },
      {
        episode_no: 131,
        id: "one-piece-100?ep=2272",
        title: "The First Patient! The Untold Story of the Rumble Ball!",
        japanese_title: "Hajimete no Kanja! Rumble Ball Hiwa",
        filler: true,
      },
      {
        episode_no: 132,
        id: "one-piece-100?ep=2273",
        title: "Uprising of the Navigator! For the Unyielding Dream!",
        japanese_title: "Koukaishi no Hanran! Yuzure Nai Yume no Tame ni!",
        filler: true,
      },
      {
        episode_no: 133,
        id: "one-piece-100?ep=2274",
        title: "A Recipe Handed Down! Sanji, the Iron Man of Curry!",
        japanese_title: "Uketsugareru Yume! Curry no Tetsujin Sanji",
        filler: true,
      },
      {
        episode_no: 134,
        id: "one-piece-100?ep=2275",
        title:
          "I Will Make it Bloom! Usopp, the Man, and the Eight-Foot Shell!",
        japanese_title: "Sakasete Misemasu! Otoko Usopp Hachi Shaku Tama",
        filler: true,
      },
      {
        episode_no: 135,
        id: "one-piece-100?ep=2276",
        title: "The Fabled Pirate Hunter! Zoro, the Wandering Swordsman!",
        japanese_title: "Uwasa no Kaizoku Gari! Sasurai no Kenshi Zoro",
        filler: true,
      },
      {
        episode_no: 136,
        id: "one-piece-100?ep=2277",
        title:
          "Zenny of the Island of Goats and the Pirate Ship in the Mountains!",
        japanese_title:
          "Yagi no Shima no Zenny to Yama no Naka no Kaizoku Sen!",
        filler: true,
      },
      {
        episode_no: 137,
        id: "one-piece-100?ep=2278",
        title: "How",
        japanese_title: "Moukarimakka? Kanekashi Zenny no Yabou!",
        filler: true,
      },
      {
        episode_no: 138,
        id: "one-piece-100?ep=2279",
        title:
          "Whereabouts of the Island Treasure! Attack of the Zenny Pirates!",
        japanese_title:
          "Shima no Otakara no Yukue! Zenny Kaizoku Dan Shutsugeki!",
        filler: true,
      },
      {
        episode_no: 139,
        id: "one-piece-100?ep=2280",
        title: "Legend of the Rainbow Mist! Old Man Henzo of Luluka Island!",
        japanese_title: "Nijiiro no Kiri Densetsu! Rurukajima no Roujin Henzo",
        filler: true,
      },
      {
        episode_no: 140,
        id: "one-piece-100?ep=2281",
        title: "Residents of the Land of Eternity! The Pumpkin Pirates!",
        japanese_title: "Eien no Kuni no Junin! Panpukin Kaizoku Dan!",
        filler: true,
      },
      {
        episode_no: 141,
        id: "one-piece-100?ep=2282",
        title: "Thoughts of Home! The Pirate Graveyard of No Escape!",
        japanese_title: "Kokyuu e no Omoi! Dasshutsu Funou no Kaizoku Hakaba!",
        filler: true,
      },
      {
        episode_no: 142,
        id: "one-piece-100?ep=2283",
        title: "An Inevitable Melee! Wetton",
        japanese_title: "Ransen Hissu! Uetton no Yabou to Niji no Tou",
        filler: true,
      },
      {
        episode_no: 143,
        id: "one-piece-100?ep=2284",
        title: "And so, the Legend Begins! To the Other Side of the Rainbow!",
        japanese_title: "Soshite Densetsu ga Hajimaru! Iza Niji no Kanata e",
        filler: true,
      },
      {
        episode_no: 144,
        id: "one-piece-100?ep=2285",
        title: "Caught Log! The King of Salvagers, Masira!",
        japanese_title: "Ubawareta Kiroku! Salvage ou Masira!",
        filler: false,
      },
      {
        episode_no: 145,
        id: "one-piece-100?ep=2286",
        title: "Monsters Appear! Don",
        japanese_title: "Kaibutsu Toujou! Shirohige Ichimi ni wa te wo Dasu na",
        filler: false,
      },
      {
        episode_no: 146,
        id: "one-piece-100?ep=2287",
        title: "Quit Dreaming! Mock Town, the Town of Ridicule!",
        japanese_title: "Yume wo Miru na! Azakeri no Machi Mock Town!",
        filler: false,
      },
      {
        episode_no: 147,
        id: "one-piece-100?ep=2288",
        title:
          "Distinguished Pirates! A Man Who Talks of Dreams and the King of Undersea Search!",
        japanese_title:
          "Kaizoku no Takami! Yume wo Kataru Otoko to Kaitei Shinsaku ou",
        filler: false,
      },
      {
        episode_no: 148,
        id: "one-piece-100?ep=2289",
        title: "Legendary Family! Noland, the Liar!",
        japanese_title: "Densetsu no Ichizoku! Usotsuki Norland",
        filler: false,
      },
      {
        episode_no: 149,
        id: "one-piece-100?ep=2290",
        title: "Steer for the Clouds! Capture the South Bird!",
        japanese_title: "Kumo Kaji Ippai! South Bird wo oe!",
        filler: false,
      },
      {
        episode_no: 150,
        id: "one-piece-100?ep=2291",
        title: "Dreams Don",
        japanese_title: "Gensou wa Kanawanai!? Bellamy vs Saruyama Rengou",
        filler: false,
      },
      {
        episode_no: 151,
        id: "one-piece-100?ep=2292",
        title: "100 Million Man! World",
        japanese_title:
          "Ichioku no Otoko! Sekai Saikou Kenryoku to Kaizoku Kurohige",
        filler: false,
      },
      {
        episode_no: 152,
        id: "one-piece-100?ep=2293",
        title: "Take to the Sky! Ride the Knockup Stream!",
        japanese_title: "Fune wa Sora wo Yuku! Tsukiageru Kairyuu ni Nore",
        filler: false,
      },
      {
        episode_no: 153,
        id: "one-piece-100?ep=2294",
        title: "Sail the White Sea! The Sky Knight and the Gate in the Clouds!",
        japanese_title: "Koko wa Sora no Umi! Sora no Kishi to Tengoku no Mon",
        filler: false,
      },
      {
        episode_no: 154,
        id: "one-piece-100?ep=2295",
        title: "Godland, Skypiea! Angels on a Beach of Clouds!",
        japanese_title: "Kami no Kuni Skypiea! Kumo no Nagisa no Tenshitachi",
        filler: false,
      },
      {
        episode_no: 155,
        id: "one-piece-100?ep=2296",
        title:
          "The Forbidden Sacred Ground! The Island Where God Lives and Heaven",
        japanese_title:
          "Kindan no Seichi! Kami no Sumi Shima to Ten no Sabaki!",
        filler: false,
      },
      {
        episode_no: 156,
        id: "one-piece-100?ep=2297",
        title: "Already Criminals?! Skypiea",
        japanese_title: "Hayaku mo Hanzaisha!? Skypiea no Hou no Banjin",
        filler: false,
      },
      {
        episode_no: 157,
        id: "one-piece-100?ep=2298",
        title: "Is Escape Possible?!? God",
        japanese_title: "Dasshutsu Naru ka!? Ugokihajimeta Kami no Shiren!",
        filler: false,
      },
      {
        episode_no: 158,
        id: "one-piece-100?ep=2299",
        title: "A Trap on Lovely Street! The Almighty God Eneru",
        japanese_title: "Lovely Doori no Wana! Zennou Naru God Enel",
        filler: false,
      },
      {
        episode_no: 159,
        id: "one-piece-100?ep=2300",
        title: "Onward Crow! To the Sacrificial Altar!",
        japanese_title: "Susume Karasumaru! Ikenie no Saidan wo Mezase",
        filler: false,
      },
      {
        episode_no: 160,
        id: "one-piece-100?ep=2301",
        title: "10% Survival Rate! Satori, the Mantra Master!",
        japanese_title: "Seizonritsu 10%! Mantora Tsukai no Shinkan Satori",
        filler: false,
      },
      {
        episode_no: 161,
        id: "one-piece-100?ep=2302",
        title: "The Ordeal of Spheres! Desperate Struggle in the Lost Forest!",
        japanese_title: "Tama no Shiren",
        filler: false,
      },
      {
        episode_no: 162,
        id: "one-piece-100?ep=2303",
        title: "Chopper in Danger! Former God vs. Priest Shura!",
        japanese_title: "Chopper Abunau Shi! Moto Kami vs Shinkan Shura",
        filler: false,
      },
      {
        episode_no: 163,
        id: "one-piece-100?ep=2304",
        title: "Profound Mystery! Ordeal of String and Ordeal of Love?!?",
        japanese_title: "Makafushigi! Himo no Shiren to Koi no Shiren!?",
        filler: false,
      },
      {
        episode_no: 164,
        id: "one-piece-100?ep=2305",
        title: "Light the Fire of Shandora! Wiper the Warrior!",
        japanese_title: "Shandora no tou wo Nobose! Senshi Wiper",
        filler: false,
      },
      {
        episode_no: 165,
        id: "one-piece-100?ep=2306",
        title: "Jaya, City of Gold in the Sky! Head for God",
        japanese_title: "Tenkuu no Ougonkyou Jaya! Mezase Kami no Yashiro!",
        filler: false,
      },
      {
        episode_no: 166,
        id: "one-piece-100?ep=2307",
        title: "Festival on the Night Before Gold-Hunting! Feelings for Varse!",
        japanese_title: "Ougon Zenya Matsuri! Varse e no Omoi!",
        filler: false,
      },
      {
        episode_no: 167,
        id: "one-piece-100?ep=2308",
        title: "Enter God Eneru! Farewell to Survivors!",
        japanese_title: "God Enel Toujou!! Ikinokori e no Yoake Kyoku",
        filler: false,
      },
      {
        episode_no: 168,
        id: "one-piece-100?ep=2309",
        title: "A Giant Snake Bares Its Fangs! The Survival Game Begins!",
        japanese_title: "Kiba Muku Ouhebi! Tsui ni Hajimaru Ikinokori Gassen",
        filler: false,
      },
      {
        episode_no: 169,
        id: "one-piece-100?ep=2310",
        title: "The Deadly Reject! War Demon Wiper",
        japanese_title: "Sutemi no Haigeki! Senki Wiper no Kakugo",
        filler: false,
      },
      {
        episode_no: 170,
        id: "one-piece-100?ep=2311",
        title: "Fierce Mid-Air Battle! Pirate Zoro vs. Warrior Braham!",
        japanese_title: "Kuuchuu no Gekisen! Kaizoku Zoro vs Senshi Braham",
        filler: false,
      },
      {
        episode_no: 171,
        id: "one-piece-100?ep=2312",
        title: "The Roaring Burn Bazooka!! Pirate Luffy vs. Warrior Wyper!",
        japanese_title: "Unaru Nenshouhou!! Luffy vs Senki Wiper",
        filler: false,
      },
      {
        episode_no: 172,
        id: "one-piece-100?ep=2313",
        title: "The Ordeal of Swamp! Chopper vs Priest Gedatsu!",
        japanese_title: "Numa no Shiren! Chopper vs Shinkan Gedatsu!!",
        filler: false,
      },
      {
        episode_no: 173,
        id: "one-piece-100?ep=2314",
        title: "Unbeatable Powers! Eneru's True Form is Revealed!",
        japanese_title: "Muteki no Nouryoku! Akasareru Enel no Shoutai",
        filler: false,
      },
      {
        episode_no: 174,
        id: "one-piece-100?ep=2315",
        title: "A Mystical City! The Grand Ruins of Shandora!",
        japanese_title: "Maboroshi no to! Yuudai Naru Shandora no Iseki!!",
        filler: false,
      },
      {
        episode_no: 175,
        id: "one-piece-100?ep=2316",
        title: "0% Survival Rate! Chopper vs Priest Ohm",
        japanese_title: "Seisonritsu 0%!! Chopper vs Shinkan Ohm",
        filler: false,
      },
      {
        episode_no: 176,
        id: "one-piece-100?ep=2317",
        title: "Climb Giant Jack! Deadly Combat in the Upper Ruins!",
        japanese_title: "Kyodai MameTsuru wo Nobore!! Jousou Iseki no Shitou",
        filler: false,
      },
      {
        episode_no: 177,
        id: "one-piece-100?ep=2318",
        title: "The Ordeal of Iron! White Barbed Death Match!",
        japanese_title:
          "Tetsu no Shiren no Shinkocchou! Shiroibara Desumacchi!!",
        filler: false,
      },
      {
        episode_no: 178,
        id: "one-piece-100?ep=2319",
        title: "Bursting Slash! Zoro vs Ohm!",
        japanese_title: "Hotobashiru Zangeki! Zoro vs Shinkan Ohm!!",
        filler: false,
      },
      {
        episode_no: 179,
        id: "one-piece-100?ep=2320",
        title: "Collapsing Upper Ruins! The Quintet for the Finale!",
        japanese_title: "Kuzure Yuku Jousou Iseki! Shuukyoku e no Gojuusou!!",
        filler: false,
      },
      {
        episode_no: 180,
        id: "one-piece-100?ep=2321",
        title: "Showdown in the Ancient Ruins! Sky God Enel",
        japanese_title: "Kodai Iseki no Taiketsu! God Enel no Mokuteki",
        filler: false,
      },
      {
        episode_no: 181,
        id: "one-piece-100?ep=2322",
        title: "Ambition Towards the Endless Vearth! The Ark Maxim!",
        japanese_title: "Kagirinai Daichi e no Yabou Hakobune Maxim!!",
        filler: false,
      },
      {
        episode_no: 182,
        id: "one-piece-100?ep=2323",
        title: "They Finally Clash! Pirate Luffy vs God Enel!",
        japanese_title: "Tsui ni Gekitotsu! Kaizoku Luffy vs God Enel!!",
        filler: false,
      },
      {
        episode_no: 183,
        id: "one-piece-100?ep=2324",
        title: "Maxim Surfaces! Deathpiea is Activated!",
        japanese_title: "Maxim Ujou! Ugokihajimeta Deathpiea!!",
        filler: false,
      },
      {
        episode_no: 184,
        id: "one-piece-100?ep=2325",
        title: "Luffy Falls! Eneru",
        japanese_title: "Luffy Rakka! Kami no Sabaki to Nami no Nozomi!!",
        filler: false,
      },
      {
        episode_no: 185,
        id: "one-piece-100?ep=2326",
        title: "The Two Awaken! On the Front Lines of the Burning Love Rescue!",
        japanese_title: "Mesameta Futari! Moeru Koi no Kyuushutsu Zensen!!",
        filler: false,
      },
      {
        episode_no: 186,
        id: "one-piece-100?ep=2327",
        title: "Capriccio for Despair! The Impending Doom of Sky Island!",
        japanese_title:
          "Zetsubou e no Kyousoukyoku Hakari Kuru Sorajima no Shoumetsu!!",
        filler: false,
      },
      {
        episode_no: 187,
        id: "one-piece-100?ep=2328",
        title: "Lead by a Bell",
        japanese_title:
          "Kane no Oto no Michibiki! Daisenshi to Shinkenka no Monogatari",
        filler: false,
      },
      {
        episode_no: 188,
        id: "one-piece-100?ep=2329",
        title: "Free From the Spell! The Great Warrior Sheds Tears!",
        japanese_title:
          "Jubaku Kara no Kaihou! Daisenshi ga Nagashita Namida!!",
        filler: false,
      },
      {
        episode_no: 189,
        id: "one-piece-100?ep=2330",
        title: "Eternal Friends! The Vowed Bell Echoes Across the Mighty Seas!",
        japanese_title: "Eien no Shinyuu! Daikaigen ni Hibiku Chikai no Kane",
        filler: false,
      },
      {
        episode_no: 190,
        id: "one-piece-100?ep=2331",
        title: "Angel Island, Obliterated! The Horror of The Raigo",
        japanese_title: "Enjerushima Shoumetsu! Raigo Kourin no Kyoufu!!",
        filler: false,
      },
      {
        episode_no: 191,
        id: "one-piece-100?ep=2332",
        title: "Knock Over Giant Jack! Last Hope for Escape!",
        japanese_title:
          "Kyodai Mame Tsuru wo Taose! Dasshutsu e no Saigou no Nozomi",
        filler: false,
      },
      {
        episode_no: 192,
        id: "one-piece-100?ep=2333",
        title: "Miracle on Skypiea! The Love Song Heard in the Clouds!",
        japanese_title:
          "Kami no Kuni no Kiseki! Tenshi ni Todoita Shima no Kasei",
        filler: false,
      },
      {
        episode_no: 193,
        id: "one-piece-100?ep=2334",
        title: "The Battle Ends! Proud Fantasia Echo",
        japanese_title:
          "Tatakai no Shuuen! Touku Hibiku Hokori Takaki Gensoukyoku",
        filler: false,
      },
      {
        episode_no: 194,
        id: "one-piece-100?ep=2335",
        title: "I Made it here! The Yarn the Poneglyphs Spin!",
        japanese_title: "Ware koko ni itaru! Rekishi no honbun ga tsumugu mono",
        filler: false,
      },
      {
        episode_no: 195,
        id: "one-piece-100?ep=2336",
        title: "Off to the Blue Sea!! A Heartfelt Finale!!",
        japanese_title: "Iza Seikai e!! Omoi ga Shibarinasu Saishuu Gakushou",
        filler: false,
      },
      {
        episode_no: 196,
        id: "one-piece-100?ep=2337",
        title:
          "A State of Emergency is Issued! A Notorious Pirate Ship has Infiltrated!",
        japanese_title:
          "Hijou Jitai Hatsumei! Akumei Takaki Kaizokusen Sennyuu",
        filler: true,
      },
      {
        episode_no: 197,
        id: "one-piece-100?ep=2338",
        title: "Sanji the Cook! Proving His Merit at the Marine Dining Hall!",
        japanese_title: "Ryourinin Sanji! Kaigun Shokudou de Shinka Hakki!",
        filler: true,
      },
      {
        episode_no: 198,
        id: "one-piece-100?ep=2339",
        title: "Captured Zoro! Chopper",
        japanese_title: "Towareta Zoro to Chopper Kinkyuu Shittou",
        filler: true,
      },
      {
        episode_no: 199,
        id: "one-piece-100?ep=2340",
        title: "The Marines Dragnet Closes In! The Second Member Captured!",
        japanese_title: "Hakaru Kaigun no Sousamou! Towareta Futarime!",
        filler: true,
      },
      {
        episode_no: 200,
        id: "one-piece-100?ep=2341",
        title: "Luffy and Sanji",
        japanese_title: "Kesshi no Luffy to Sanji! Kuushutsu Daisakusen!",
        filler: true,
      },
    ],
  },
};

const streamJson = {
  servers: {
    success: true,
    results: [
      { type: "sub", data_id: "1139622", server_id: "4", serverName: "HD-1" },
    ],
  },
  stream: {
    success: true,
    results: {
      streamingLink: {
        id: "1139622",
        type: "sub",
        link: {
          file: "https://wf1.biananset.net/_v7/906821d7da9060c6ccc07454273ee9a1039f392cdc46e57778725b664ad83cac7841f1c8b671c05893bca2fe62e3d413e6ad37cdc12b1b5a76ed176ed6253ab3aa62bb1925c3e48631798ea9bb941432ba525d5570a6286ccc248dcc89a7394108e24c9e404c095144106e6f974dad90975125e5fd64d4626ff652d720ee387d/master.m3u8",
          type: "hls",
        },
        tracks: [
          {
            file: "https://s.megastatics.com/subtitle/f1af8f55729d10b844f25425410cbb4e/f1af8f55729d10b844f25425410cbb4e.vtt",
            label: "English",
            kind: "captions",
            default: true,
          },
        ],
        intro: { start: 57, end: 145 },
        outro: { start: 0, end: 0 },
        server: "HD-1",
      },
      servers: [
        {
          type: "sub",
          data_id: "1139622",
          server_id: "4",
          serverName: "HD-1",
        },
      ],
    },
  },
};
