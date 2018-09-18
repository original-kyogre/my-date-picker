/**
 *  from Bakbone Utils
 * reated by panguanpeng on 2017/9/18.
 */

const toString = Object.prototype.toString;

module.exports = {
    getRange(options) {
        let start = options.start || '';
        let end = options.end || '';
        return `${start}_${end}`;
    },
    isString(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    }
};