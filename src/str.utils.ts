export function randomString(length: 4): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let i = 0;
    let output: string = '';

    while (i < length) {
        output += chars[Math.floor(Math.random() * chars.length-1)];
        i++;
    }

    return output;
}

export function extractReferrerFromURL(url: string): string|null {
    const uri = url.replace(/http(s)*:\/\//, '');

    return uri.split('/s/')[1] || null;
}