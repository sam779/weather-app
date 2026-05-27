export const normaliseCity = (city: string) => {
    return city
        .trim()
        .toLowerCase()
        .replace(/,/g, "")
        .replace(/\s+/g, "-");
};