import { db } from './../utilities/connectionDB';
import { executeDbQuery } from '../utilities/modelUtils';

export {
    insertSocialNetwork,
    getAllSocialNetworks,
    getSocialNetworkById,
    getSocialNetworksByArtistId,
    updateSocialNetwork,
    deleteSocialNetwork
};

export type { SocialNetwork };

type SocialNetwork = {
    id_network: number;
    name: string;
    url: string;
    id_artist: number;
};

async function insertSocialNetwork(
  name: string, 
  url: string, 
  id_artist: number
): Promise<void> {
  const query = () => db.run(
    `INSERT INTO social_networks (name, url, id_artist)
     VALUES (?, ?, ?)`, [name, url, id_artist]
  );
  await executeDbQuery(query, 'Error al insertar red social');
}

async function getAllSocialNetworks(): Promise<SocialNetwork[]> {
    const query = () => db.query(
        `SELECT * FROM social_networks ORDER BY id_network DESC`
    ).all() as SocialNetwork[];
    return executeDbQuery(query, 'Error al obtener todas las redes sociales');
}

async function getSocialNetworkById(id: number): Promise<SocialNetwork | null> {
    const query = () => db.query(
        `SELECT * FROM social_networks WHERE id_network = ?`
    ).get(id) as SocialNetwork | null;
    return executeDbQuery(query, 'Error al obtener una red social');
}

async function getSocialNetworksByArtistId(id_artist: number): Promise<SocialNetwork | null> {
    const query = () => db.query(
        `SELECT * FROM social_networks WHERE id_artist = ?`
    ).all(id_artist) as SocialNetwork | null;
    return executeDbQuery(query, 'Error al obtener una red social');
}

async function updateSocialNetwork(
    id: number,
    name: string,
    url: string,
    id_artist: number
): Promise<void> {
    const query = () => db.run(
        `UPDATE social_networks SET name = ?, url = ?, id_artist = ? WHERE id_network = ?`,
        [name, url, id_artist, id]
    );
    await executeDbQuery(query, 'Error al actualizar la red social');
}

async function deleteSocialNetwork(id: number): Promise<void> {
    const query = () => db.run(
        `DELETE FROM social_networks WHERE id_network = ?`,
        [id]
    );
    await executeDbQuery(query, 'Error al eliminar la red social');
}