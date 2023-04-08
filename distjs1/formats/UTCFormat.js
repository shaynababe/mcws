import { M as Moment } from '../moment-83aaf3a7.js';
import { DOY_PATTERN, inlineParseDOYString } from './utils/DOY.js';
import '../_commonjsHelpers-76cdd49e.js';

/**
 * Returns an appropriate time format based on the provided value and
 * the threshold required.
 * @private
 */
function getScaledFormat (m) {
    return [
        [".SSS", function(m) { return m.milliseconds(); }],
        [":ss", function(m) { return m.seconds(); }],
        ["HH:mm", function(m) { return m.minutes() || m.hours(); }],
        ["DD", function(m) { return m.date(); }],
        ["MM", function(m) { return m.format('MMM'); }],
        ["YYYY", function() { return true; }]
    ].filter(function (row){
        return row[1](m);
    })[0][0];
}

/**
 * Formatter for UTC timestamps in day of year format.
 *
 * @implements {Format}
 * @constructor
 */
function UTCFormat() {
    this.key = 'utc';
}

UTCFormat.prototype.FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';
UTCFormat.prototype.ACCEPTABLE_FORMATS = [
    UTCFormat.prototype.FORMAT,
    'YYYY-MM-DDTHH:mm:ss',
    'YYYY-MM-DDTHH:mm',
    'YYYY-MM-DDTHH',
    'YYYY-MM-DD',
    'YYYY-DDDDTHH:mm:ss.SSS',
    'YYYY-DDDTHH:mm:ss',
    'YYYY-DDDTHH:mm',
    'YYYY-DDDTHH',
    'YYYY-DDD',
];

UTCFormat.prototype.format = function (value, scale) {
    var m = Moment.utc(value);
    if (typeof scale !== 'undefined') {
        var scaledFormat = getScaledFormat(m);
        if (scaledFormat) {
            return m.format(scaledFormat);
        }
    }
    return m.format(this.FORMAT);
};

UTCFormat.prototype.parse = function (text) {
    if (text === undefined || typeof text === 'number') {
        return text;
    }

    if (DOY_PATTERN.test(text)) {
        return +inlineParseDOYString(text);
    }

    return Moment.utc(text, this.ACCEPTABLE_FORMATS, true).valueOf();
};

UTCFormat.prototype.validate = function (text) {
    return text !== undefined && Moment.utc(text, this.ACCEPTABLE_FORMATS, true).isValid();
};

export { UTCFormat as default };
