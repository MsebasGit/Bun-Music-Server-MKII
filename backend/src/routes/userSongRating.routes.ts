import { Elysia, t } from "elysia";
import { authGuard } from "../guards/auth.guard";
import {
    handleLikeSong,
    handleUnlikeSong,
    handleGetLikedSongs,
    handleIsSongLiked,
    handleGetLikesCount,
    handleSearchLikedSongs
} from "../controllers/userSongRating.controller";

export const userSongRatingRoutes = new Elysia({ prefix: "/ratings" })
    .guard(
        {
            beforeHandle: authGuard,
        },
        (app) =>
            app
                // GET /ratings/me
                .get("/me", handleGetLikedSongs)
                
                // GET /ratings/me/search?q=...
                .get("/me/search", handleSearchLikedSongs)

                // GET /ratings/song/:id/check
                .get("/song/:id/check", handleIsSongLiked)

                // GET /ratings/song/:id/count
                .get("/song/:id/count", handleGetLikesCount)

                // POST /ratings/song/:id/like
                .post("/song/:id/like", handleLikeSong)

                // DELETE /ratings/song/:id/unlike
                .delete("/song/:id/unlike", handleUnlikeSong)
    );