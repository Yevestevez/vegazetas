// Type for the .lean() projection of User with only _id and favorites.
// Matches the Mongoose User schema after migration to TypeScript.

export interface UserFavorites {
    _id: string
    favorites: string[]
}
