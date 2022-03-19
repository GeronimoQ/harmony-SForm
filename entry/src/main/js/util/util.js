export function dateFormat(data) {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    return data.getUTCFullYear() +
    '-' + pad(data.getUTCMonth() + 1) +
    '-' + pad(data.getUTCDate()) +
    ' ' + pad(data.getUTCHours()) +
    ':' + pad(data.getUTCMinutes()) +
    ':' + pad(data.getUTCSeconds())
    ;
}