import { Inter } from 'next/font/google'
import { Grid, Typography } from '@mui/material'
import { SearchControl } from '@/components/search';
import { useState } from 'react';
import useGetAnimeList from '@/hooks/useGetAnimeList';
import { useDetectPageEnd } from '@/hooks/useDetectPageEnd';
import { AnimeCard } from '@/components/card';
import { Anime, AnimeWithPreference, Preference } from '@/types/anime';

const inter = Inter({ subsets: ['latin'] })

/**
 * The main page of the Anime List app.
 */
export default function Home() {
  /**
   * Fetches anime data and provides a function to refetch the data.
   */
  const { data, refetch } = useGetAnimeList()

  /**
   * Registers a scroll event listener and invokes the provided function when the end of the page is detected.
   */
  useDetectPageEnd(refetch);

  /**
   * The search value entered by the user.
   */
  const [searchValue, setSearchValue] = useState<string | undefined>();

  /**
   * The key used to access user preferences data in local storage.
   */
  const localStorageKey = "animelist_userpreferenceData"

  /**
   * The user's anime preference data stored in local storage.
   */
  const [userPreferenceData, setUserPreferenceData] = useState<Preference[]>(typeof window !== "undefined" && JSON.parse(window.localStorage.getItem(localStorageKey) || "[]"))

  /**
   * The filter state used to control the visibility of favorite and starred anime.
   */
  const [filterState, setFilterState] = useState({ favorite: false, starred: false })

  /**
   * The list of anime with their preference data (if available) and filtered based on the search query and filter state.
   */
  const animeList: (Anime | AnimeWithPreference)[] | undefined = data?.filter((anime) => {
    if (searchValue) {
      const regex = new RegExp(searchValue, "i")
      return regex.test(anime.attributes.titles.en_jp)
    }
    return true
  }).map(anime => {
    if (userPreferenceData.find((preference) => preference?.animeId === anime.id)) {
      return { ...anime, ...userPreferenceData.find((preference) => preference.animeId === anime.id) }
    }
    return anime
  }).filter((anime) => {
    const { favorite, starred } = filterState;
    const isFavorite = 'favorite' in anime && anime.favorite === true;
    const isStarred = 'starred' in anime && anime.starred === true;

    if (favorite && starred) {
      return isFavorite && isStarred;
    } else if (favorite) {
      return isFavorite;
    } else if (starred) {
      return isStarred;
    }

    return true;
  });

  /**
   * Updates the user's preference data based on the provided anime ID and preference type. 
   */
  const handlePreference = (id: string, type: "FAVORITE" | "STAR") => {
    const preferenceIndex = userPreferenceData.findIndex(preference => preference?.animeId === id)

    let newPreference;

    if (preferenceIndex === -1) {
      newPreference = [
        ...userPreferenceData,
        {
          animeId: id,
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

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-8 ${inter.className}`}
    >
      <header className="w-full flex flex-col items-center">
        <Typography variant="h4" component="h1">
          Anime List
        </Typography>
        <SearchControl
          onSearch={(event) => {
            setSearchValue(event.target.value)
          }}
          itemCount={data?.length}
          filterState={filterState}
          onFilterFavorite={() => {
            setFilterState((filterState) => {
              return { ...filterState, favorite: !filterState.favorite }
            })
          }}
          onFilterStarred={() => {
            setFilterState((filterState) => {
              return { ...filterState, starred: !filterState.starred }
            })
          }}
        />
      </header>
      <article className='w-full py-8'>
        <Grid container spacing={8}>
          {animeList?.map((anime) =>
            <AnimeCard
              anime={anime}
              key={anime.id}
              onFavorite={(id) => handlePreference(id, "FAVORITE")}
              onStar={(id) => handlePreference(id, "STAR")}
              favorite={'favorite' in anime ? anime.favorite || false : false}
              starred={'starred' in anime ? anime.starred || false : false}
              onNavigate={(id) => window.location.href = `${window.location.origin}/${id}`}
            />
          )}
        </Grid>
      </article>
    </main>
  )
}