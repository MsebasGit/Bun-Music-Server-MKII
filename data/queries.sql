SELECT
    p.name,
    s.title
FROM
    playlists p
INNER JOIN
    playlists_songs sp ON p.id_playlist = sp.id_playlist
INNER JOIN
    songs s ON sp.id_song = s.id_song
-- WHERE 
--     p.id_playlist = 1 
ORDER BY
    p.name, s.title;

SELECT
    p.id_playlist,
    p.name,
    p.description
FROM
    playlists AS p
WHERE
    p.id_playlist NOT IN (
        SELECT
            id_playlist
        FROM
            playlists_songs
        WHERE
            id_song = ? -- Sustituye '123' con el id_song de la canción que quieres excluir
    );

