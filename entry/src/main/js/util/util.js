function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

export function dateFormat(data) {

    return data.getUTCFullYear() +
    '-' + pad(data.getUTCMonth() + 1) +
    '-' + pad(data.getUTCDate() + 1) +
    ' ' + pad(data.getUTCHours()) +
    ':' + pad(data.getUTCMinutes()) +
    ':' + pad(data.getUTCSeconds())
    ;
}

export function dateFormatToDate(data) {

    return data.getUTCFullYear() +
    '-' + pad(data.getUTCMonth() + 1) +
    '-' + pad(data.getUTCDate() + 1)
    ;
}

export function dateFormatToTime(data) {

    return
    data.getUTCHours() +
    ':' + pad(data.getUTCMinutes()) + ':' + pad(data.getUTCSeconds())
    ;
}

export function isNumber(val) {

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}
