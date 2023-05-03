import { Grid, Box, TextField, Button } from "@mui/material"
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEventHandler, useState } from "react";

interface SearchControlProps {
  /** The number of items to be displayed in the count display. */
  itemCount?: number;

  /** The function to be called when the search input is changed. */
  onSearch: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;

  /** An object containing booleans for the favorite and starred filters. */
  filterState: {
    favorite: boolean;
    starred: boolean;
  }

  /** The function to be called when the favorite filter button is clicked. */
  onFilterFavorite: () => void;

  /** onFilterStarred The function to be called when the starred filter button is clicked. */
  onFilterStarred: () => void;
}

/**
 * SearchControl is a component that provides a search bar, filtering buttons and an item count display.
 */
const SearchControl: React.FC<SearchControlProps> = ({ itemCount, onSearch, filterState, onFilterFavorite, onFilterStarred }) => {

  return (
    <Grid container spacing={2} alignContent="center" >
      <Grid item lg={4} >
        <Box className="space-x-1" >
          <span>Filter </span>
          <Button onClick={onFilterFavorite}>
            <FavoriteIcon style={{ color: filterState.favorite ? `red` : "gray" }} />
          </Button>
          <Button onClick={onFilterStarred} >
            < StarIcon style={{ color: filterState.starred ? `yellow` : "gray" }} />
          </Button>
        </Box>
      </Grid>
      < Grid item lg={4} >
        <TextField label={
          <Box className="space-x-1" >
            <span>Search </span>
            < SearchIcon />
          </Box>}
          onChange={onSearch}
          variant="outlined"
          className="w-full"
          size="small" />
      </Grid>
      <Grid item lg={4} className="text-right" >
        <span>
          {itemCount || 0} Items
        </span>
      </Grid>
    </Grid>
  )
}

export default SearchControl