import { config } from '@/config';
import { Preference } from '@/types/anime';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Inter } from 'next/font/google';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

interface EpisodeWatchState { id: string, watched: boolean }

export default function Post({ anime, episodes }: { anime: any, episodes: any }) {

    /**
     * The key used to access user preferences data in local storage.
     */
    const localStorageKey = "animelist_userpreferenceData"

    /**
     * The user's anime preference data stored in local storage.
     */
    const [userPreferenceData, setUserPreferenceData] = useState<Preference[]>(typeof window !== "undefined" && JSON.parse(window.localStorage.getItem(localStorageKey) || "[]"))

    /**
     * Load watched state from local storage, default to an empty object if not found
     */
    const [watchedEpisodes, setWatchedEpisodes] = useState<EpisodeWatchState[]>(typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem("watchedEpisodes") || "[]") : [])

    /**
     * Updates the user's preference data based on the provided anime ID and preference type. 
     */
    const handlePreference = (type: "FAVORITE" | "STAR") => {
        const preferenceIndex = userPreferenceData?.findIndex(preference => preference?.animeId === anime.data.id)

        let newPreference;

        if (preferenceIndex === -1) {
            newPreference = [
                ...userPreferenceData,
                {
                    animeId: anime.data.id,
                    favorite: type === "FAVORITE" ? true : false,
                    starred: type === "STAR" ? true : false,
                }
            ]
        } else {
            newPreference = userPreferenceData.map((preference, index) => {
                if (index !== preferenceIndex) return preference;

                return {
                    ...preference,
                    favorite: type === "FAVORITE" ? !preference.favorite : preference.favorite,
                    starred: type === "STAR" ? !preference.starred : preference.starred,
                }
            });
        }

        window.localStorage.setItem(localStorageKey, JSON.stringify(newPreference))
        setUserPreferenceData(newPreference as Preference[])
    }

    /**
     * Updates the watched status of the episode selected.
     */
    const handleWatch = (episodeId: string) => {
        const episodeIndex = watchedEpisodes?.findIndex(episode => episode?.id === episodeId)
        let newEpisodeState;

        if (episodeIndex === -1) {
            newEpisodeState = [
                ...watchedEpisodes,
                {
                    id: episodeId,
                    watched: true
                }
            ]
        } else {
            newEpisodeState = watchedEpisodes.map((episode, index) => {
                if (index !== episodeIndex) return episode;

                return {
                    ...episode,
                    watched: !episode.watched,
                }
            });
        }

        window.localStorage.setItem("watchedEpisodes", JSON.stringify(newEpisodeState))
        setWatchedEpisodes(newEpisodeState as EpisodeWatchState[])
    }


    if (!anime) {
        return <main
            className={`flex min-h-screen flex-col items-center p-8 ${inter.className}`}
        >
            <CircularProgress />
        </main>
    }

    const { attributes } = anime.data
    const currentPreference = userPreferenceData && userPreferenceData?.find(preference => preference.animeId === anime.data.id) || { favorite: false, starred: false }


    return (<main
        className={`flex min-h-screen flex-col items-center p-8 ${inter.className}`}
    >
        <header className="w-full flex flex-col items-center">
            <Typography variant="h4" component="h1">
                {attributes.titles.en_jp}
            </Typography>
            <Box className="w-full">
                <Button className="flex items-center" onClick={() => {
                    window.location.href = window.location.origin;
                }}>
                    <ArrowBackIosIcon />
                    <span>
                        Back
                    </span>
                </Button>
            </Box>
            <Grid container spacing={8}>
                <Grid item lg={3} xs={12}>
                    <Box className="flex flex-col space-y-4">
                        <img src={attributes.posterImage.medium} />
                        <Box>
                            <Button onClick={() => handlePreference("STAR")}>
                                <StarIcon color={currentPreference.starred ? "warning" : "disabled"} />
                            </Button>
                            <span>{attributes.averageRating} from {attributes.userCount} users</span>
                        </Box>
                        <Box>
                            <Button onClick={() => handlePreference("FAVORITE")}>
                                <FavoriteIcon color={currentPreference.favorite ? "error" : "disabled"} />
                            </Button>
                            <span>{attributes.favoritesCount} Rank # {attributes.popularityRank}</span>
                        </Box>
                        <Box>
                            <span>Rated {attributes.ageRating}: {attributes.ageRatingGuide}</span>
                        </Box>
                        <Box>
                            <span>Aired on {attributes.startDate}</span>
                        </Box>
                        <Box>
                            <span>{attributes.status === "current" ? "Ongoing" : attributes.status} {attributes.status === "finished" ? attributes.endDate : ''}</span>
                        </Box>
                        <Box>
                            <span>Type: {attributes.subtype}</span>
                        </Box>
                    </Box>
                </Grid>
                <Grid item lg={9}>
                    <Box className="flex flex-col space-y-4">
                        <Box>
                            {attributes.synopsis}
                        </Box>
                        <br />
                        {/* Characters do not exist in Kitsu API; providing mock characters. */}
                        <Grid container spacing={4}>
                            <Grid item lg={12} xs={12}>
                                Characters
                            </Grid>
                            {Array.from(Array(4)).map((i, index) => (<Grid item lg={3} key={"img" + index} >
                                <img src="https://placehold.co/400x400" />
                            </Grid>))}
                        </Grid>
                        <Box>
                            Episodes
                        </Box>
                        <Box className="space-y-4">
                            {episodes.map((episode: any) => {
                                const episodeState = watchedEpisodes.find(currentEpisode => currentEpisode.id === episode.id)
                                return (
                                    <Box className="flex space-x-2" key={episode.id}>
                                        <Button onClick={() => handleWatch(episode.id)}>
                                            <VisibilityIcon color={episodeState?.watched ? "primary" : "disabled"} />
                                        </Button>
                                        <Box>
                                            <Typography variant="body1">
                                                {episode.attributes.airDate} Season {episode.attributes.seasonNumber || 0} Episode {episode.attributes.number}: {episode.attributes.titles.en_jp}
                                            </Typography>
                                            <Typography variant="body2">
                                                {episode.attributes.synopsis}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </header>
    </main>)
}

export const getStaticPaths: GetStaticPaths = async () => {
    const animeResponse = await axios.get(`${config.apiUrl}anime`);
    const paths = Array.from(animeResponse.data.meta.count).map((number, index) => ({ params: { id: (index + 1).toString() } }));
    return {
        paths,
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async ({
    params,
}) => {
    const { data: animeData } = await axios.get(`${config.apiUrl}anime/${params ? params.id : ""}`);

    const { data: episodeData } = await axios.get(`${config.apiUrl}anime/${params ? params.id : ""}/episodes?page[limit]=20`)

    return {
        props: {
            anime: animeData,
            episodes: episodeData.data
        },
        revalidate: 1,
    };
};

