import { webcrypto } from 'crypto';

// It is recommended to set this as an environment variable
const secret = process.env.COOKIE_SECRET || 'a-very-secret-key-that-is-32-bytes';

if (secret.length < 32) {
    throw new Error('COOKIE_SECRET environment variable must be at least 32 characters long.');
}

// We will use the first 32 bytes of the secret for the key
const secretKeyData = new TextEncoder().encode(secret.slice(0, 32));

async function getKey() {
    return await webcrypto.subtle.importKey(
        'raw',
        secretKeyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

const ivLength = 12; // For AES-GCM

export async function encrypt(text: string): Promise<string> {
    const key = await getKey();
    const iv = webcrypto.getRandomValues(new Uint8Array(ivLength));
    const encrypted = await webcrypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        new TextEncoder().encode(text)
    );

    // Combine iv and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return Buffer.from(combined).toString('hex');
}

export async function decrypt(encryptedText: string): Promise<string | null> {
    try {
        // The encrypted text must be a hex string and long enough.
        // Each byte is 2 hex characters, so we check against ivLength * 2.
        if (!/^[0-9a-fA-F]+$/.test(encryptedText) || encryptedText.length < ivLength * 2) {
            return null;
        }

        const key = await getKey();
        const combined = Buffer.from(encryptedText, 'hex');
        
        // Double-check buffer length after conversion. It must be greater than the IV length.
        if (combined.length <= ivLength) {
            return null;
        }

        const iv = combined.slice(0, ivLength);
        const encrypted = combined.slice(ivLength);

        const decrypted = await webcrypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encrypted
        );

        return new TextDecoder().decode(decrypted);
    } catch (error) {
        // Fail silently if decryption fails (e.g., invalid format, old cookie).
        // This prevents the console from being spammed with errors.
        return null;
    }
}
