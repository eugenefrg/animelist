export interface Anime {
    id: string;
    type: string;
    links: {
        self: string;
    };
    attributes: {
        createdAt: string;
        updatedAt: string;
        slug: string;
        synopsis: string;
        description: string;
        coverImageTopOffset: number;
        titles: {
            en: string;
            en_jp: string;
            ja_jp: string;
        };
        canonicalTitle: string;
        abbreviatedTitles: string[];
        averageRating: string;
        ratingFrequencies: {
            [key: string]: string;
        };
        userCount: number;
        favoritesCount: number;
        startDate: string;
        endDate: string;
        nextRelease: null;
        popularityRank: number;
        ratingRank: number;
        ageRating: string;
        ageRatingGuide: string;
        subtype: string;
        status: string;
        tba: null;
        posterImage: {
            tiny: string;
            large: string;
            small: string;
            medium: string;
            original: string;
            meta: {
                dimensions: {
                    tiny: {
                        width: number;
                        height: number;
                    };
                    large: {
                        width: number;
                        height: number;
                    };
                    small: {
                        width: number;
                        height: number;
                    };
                    medium: {
                        width: number;
                        height: number;
                    };
                };
            };
        };
        coverImage: {
            tiny: string;
            small: string;
            large: string;
            original: string;
            meta: {
                dimensions: {
                    tiny: {
                        width: number;
                        height: number;
                    };
                    large: {
                        width: number;
                        height: number;
                    };
                    small: {
                        width: number;
                        height: number;
                    };
                    medium: {
                        width: number;
                        height: number;
                    };
                };
            };
        };
    };
}

export interface Preference {
    animeId: string;
    starred?: boolean;
    favorite?: boolean;
}

export type AnimeWithPreference = Anime & Preference