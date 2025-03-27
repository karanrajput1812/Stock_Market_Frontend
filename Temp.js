function isoToMilliseconds(isoString) {
    return new Date(isoString).getTime();
}

function millisecondsToTime(ms) {
    let date = new Date(ms);
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
}

let isoString = "2025-03-27T11:45:29.7848849";
let ms = isoToMilliseconds(isoString);

console.log(ms);
console.log(millisecondsToTime(ms));