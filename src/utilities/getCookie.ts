import { decrypt } from './cryptoUtils';

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

export async function getUserCookie(req: Request): Promise<number | null> {
    const encryptedId = await getCookieValue(req, 'id_user');
    if (!encryptedId) {
        return null;
    }

    const decryptedId = await decrypt(encryptedId);
    if (!decryptedId) {
        return null;
    }

    const num = parseInt(decryptedId, 10);
    return isNaN(num) ? null : num;
}
