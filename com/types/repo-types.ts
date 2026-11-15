// Intermediate types for Mongoose .lean() projections used by recipe repositories.
// When models migrate to TypeScript (Sprint 8), these can be replaced by inferred types.

export interface UserFavorites {
    _id: any
    favorites: any[]
}
