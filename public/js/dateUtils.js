/* function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        // If it's not a Date object or it's an invalid Date, try to parse it
        date = new Date(date);
    }

    if (isNaN(date)) {
        console.error('Invalid date:', date);
        return 'Invalid Date';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}`;
}

function parseFormattedDate(dateString) {
    if (typeof dateString !== 'string' || dateString.length !== 12) {
        console.error('Invalid date string format. Expected yyyymmddhhmm, got:', dateString);
        return null;
    }

    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // JS months are 0-indexed
    const day = parseInt(dateString.substring(6, 8), 10);
    const hours = parseInt(dateString.substring(8, 10), 10);
    const minutes = parseInt(dateString.substring(10, 12), 10);

    const date = new Date(year, month, day, hours, minutes);

    if (isNaN(date)) {
        console.error('Failed to parse date:', dateString);
        return null;
    }

    return date;
}

// If using CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatDate, parseFormattedDate };
} */


    // dateUtils.js
const formatDate = (date) => {
    if (!(date instanceof Date)) return date; // Return non-date values as-is
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

const parseFormattedDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
};

module.exports = { formatDate, parseFormattedDate };