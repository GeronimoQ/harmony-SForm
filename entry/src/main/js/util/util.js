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


export function generateUUID(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
