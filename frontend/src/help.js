
/**
 * @template T
 * @typedef {[T, React.Dispatch<React.SetStateAction<T>>]} useStateReturnType
 */


export function formatDateTime(format, date = new Date()) {
    const map = {
        'YYYY': date.getFullYear(),
        'YY': String(date.getFullYear()).slice(-2),
        'MMMM': date.toLocaleString('default', { month: 'long' }),
        'MMM': date.toLocaleString('default', { month: 'short' }),
        'MM': String(date.getMonth() + 1).padStart(2, '0'),
        'M': date.getMonth() + 1,
        'DD': String(date.getDate()).padStart(2, '0'),
        'D': date.getDate(),
        'HH': String(date.getHours()).padStart(2, '0'),
        'H': date.getHours(),
        'hh': String(date.getHours() % 12 || 12).padStart(2, '0'),
        'h': date.getHours() % 12 || 12,
        'mm': String(date.getMinutes()).padStart(2, '0'),
        'm': date.getMinutes(),
        'ss': String(date.getSeconds()).padStart(2, '0'),
        's': date.getSeconds(),
        'A': date.getHours() < 12 ? 'AM' : 'PM',
        'a': date.getHours() < 12 ? 'am' : 'pm'
    };

    return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g, match => map[match]);
}