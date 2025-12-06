import { decrypt } from './cryptoUtils';

// New type for our cookie payload
export type UserCookieData = {
    id_user: number;
    id_artist: number | null;
};

async function getCookieValue(req: Request, name: string): Promise<string | null> {
    const cookieHeader = req.headers.get("Cookie") || '';
    const cookies = cookieHeader.split(';');

    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === name) {
            return parts[1];
        }
    }

    return null;
}

export async function getUserDataFromCookie(req: Request): Promise<UserCookieData | null> {
    const encryptedData = await getCookieValue(req, 'user_data');
    if (!encryptedData) {
        return null;
    }

    try {
        const decryptedData = await decrypt(encryptedData);
        if (!decryptedData) {
            return null;
        }
        return JSON.parse(decryptedData) as UserCookieData;
    } catch (error) {
        console.error("Error parsing user cookie data:", error);
        return null;
    }
}

export async function getUserCookie(req: Request): Promise<number | null> {
    const userData = await getUserDataFromCookie(req);
    return userData ? userData.id_user : null;
}
