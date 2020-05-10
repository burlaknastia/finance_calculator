import {MONTHS} from "./constants";

export const sortByMonth = (stats) => {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"]
    return stats.sort((a, b) =>
        months.indexOf(a.month) - months.indexOf(b.month))
}

export const displayRussianMonthName = (englishName) => {
    return MONTHS[englishName]
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}