import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Anime } from "@/types/anime";

interface AnimeCardProps {
    /* The anime object to be displayed in the card. */
    anime: Anime;

    /* Function to be called when the favorite icon is clicked. */
    onFavorite: (id: string) => void;

    /* Function to be called when the star icon is clicked. */
    onStar: (id: string) => void;

    /* A boolean indicating if the anime is favorited. */
    favorite: boolean;

    /* A boolean indicating if the anime is starred. */
    starred: boolean;

    onNavigate: (id: string) => void;
}

/**
 * A component that displays an anime card.
 * @component
 * @param {AnimeCardProps} props - The props object containing the anime object and callback functions for favorite and star actions.
 * @returns {JSX.Element} - A component to display the anime card.
 */
const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onFavorite, onStar, favorite, starred, onNavigate }) => {

    return <Grid item lg={3}>
        <Card>
            <CardMedia
                component="img"
                image={anime.attributes.posterImage.medium}
                alt={anime.attributes.titles.en}
                onClick={() => onNavigate(anime.id)}
                className="cursor-pointer"
            />
            <CardContent>
                <Typography variant="body1" color="text.secondary">
                    {anime.attributes.titles.en_jp}
                </Typography>
            </CardContent>
            <CardActions>
                <AnimeCardButton
                    onClick={() => onStar(anime.id)}
                    text={anime.attributes.averageRating}
                    icon={<StarIcon style={{ color: starred ? `yellow` : undefined }} />}
                />
                <AnimeCardButton
                    onClick={() => onFavorite(anime.id)}
                    text={anime.attributes.favoritesCount}
                    icon={<FavoriteIcon style={{ color: favorite ? `red` : undefined }} />}
                />
            </CardActions>
        </Card>
    </Grid>;
}

export default AnimeCard

interface AnimeCardButton {
    /* Function to be called when the button is clicked. */
    onClick: () => void;

    /* The Icon to be displayed in the button. */
    icon: React.ReactNode;

    /* The text to be displayed in the button. */
    text: string | number;
}

/**
 * A component that displays a button for the `AnimeCard`.
 * @component
 * @param {AnimeCardButton} props - The props object containing the icon, text and callback functions for the button.
 * @returns {JSX.Element} - A component to display a button.
 */
const AnimeCardButton: React.FC<AnimeCardButton> = ({ onClick, icon, text }) => {
    return <Button size="small" onClick={onClick}>
        <Box className="flex items-center">
            {icon}
            <Typography variant="body2" color="text.secondary">
                {text}
            </Typography>
        </Box>
    </Button>;
}

