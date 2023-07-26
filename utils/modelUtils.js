export function generateRandomLikeCount() {
    const min = Math.ceil(10);
    const max = Math.floor(64);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
