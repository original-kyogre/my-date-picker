/**
 * Created by panguanpeng on 2018/9/18.
 */
/**
 * @class
 * @classdesc EasyDate 时间日历主对象
 * @desc 通过EasyDate 模拟接口 进行月份调取 以及日期格式化
 */

const METHODS = {
    m: 'Month',
    d: 'Date'
}

const defaultFormat = 'yyyy-mm-dd';

export default class EasyDate {
    constructor(offset, options = {}) {
        this.format = options.format || defaultFormat;
        let date = EasyDate.isDate(offset, this.format);
        //判断格式与日期对象对等
        if (date) {
            this.base = new Date(date);
        }
        if (offset instanceof Date) {
            this.base = new Date(offset);
            return;
        }

        this.base = new Date();
        //时分秒毫秒 置位 0
        this.base.setHours(0);
        this.base.setMinutes(0);
        this.base.setSeconds(0);
        this.base.setMilliseconds(0);
        //日期调整方法
        this.add(offset);

    }

    /**
     * @method add 日期调整
     * @for EasyDate
     * @param {String} offset 日期偏移量 示例: '+1m' 表示下一个月
     * @return null
     */
    add(offset) {
        offset = EasyDate.parse(offset);
        if (!offset) {
            return;
        }
        for (let key in offset) {
            if (offset.hasOwnProperty(key)) {
                let method = METHODS[key];
                this.base[`set${method}`](this.base[`get${method}`]() + offset[key]);
            }
        }
        return this;
    }

    /**
     * @method 克隆方法
     * @return {Object} new EasyDate
     */
    clone() {
        return new EasyDate(this.base, {
            format: this.format
        });
    }

    /**
     * @method 获取 日
     * @return {Number} getDay;
     */
    getDay() {
        return this.base.getDay();
    }

    /**
     * @method  获取月份的第一天
     * @return {Number} firstDay;
     */
    getFirstDayOfThisMonth() {
        let date = this.clone();
        date.setDate(1);
        return date.getDay();
    }

    /**
     * @method 日期大小对比
     * @param {Object} date 日期对象
     * @return {boolean} >= ;
     */
    isGreaterOrEqual(date) {
        if (!date) {
            return false;
        }
        date = date instanceof EasyDate ? date : new EasyDate(date, {
            format: this.format
        });
        return this.toString() >= date.toString();
    }

    /**
     * @method 日期月份验证  所选中日期 与 当下日期
     * @param {Object} date 日期对象
     * @return {boolean} ==&&== ;
     */
    isSameMonth(date) {
        date = date instanceof EasyDate ? date.toDate : date;
        return this.base.getFullYear() === date.getFullYear() && this.base.getMonth() === date.getMonth();
    }

    /**
     * @method 设置当前日期为传入时间
     * @param {Object} date 日期对象
     */
    setDate(date) {
        this.base.setDate(date);
    }

    /**
     * @method 返回当前日期对象
     * @return {Object Date} 返回当前日期对象
     */
    toDate() {
        return this.base;
    }

    /**
     * @method 日历对象生成器 根据 今天日期 选择日期起始 返回UI控件使用的对象
     * @param {date} 当前日期
     * @param {date} 起始日期
     * @param {date} 结束日期
     * @return {Object:json} {year|month|empty|days}
     */
    toObject(today, start, end) {
        let month = this.base.getMonth();
        return {
            year: this.base.getFullYear(),
            month: EasyDate.toDouble(month + 1),
            empty: this.getFirstDayOfThisMonth(),
            days: EasyDate.getDates(this.base, today, start, end, this.format)
        }
    }

    /**
     * @method 格式化当前日期为文本
     * @return {String} date 日期对象字符串
     */
    toString() {
        return EasyDate.format(this.base, this.format);
    }

    /**
     * @static method 日期对象 字符串格式化
     * @param  {Object date}  日期对象
     * @param  {String}       格式化格式
     * @RegExp /([+-]?\d+)([ymd])/g  '+'/'-'+num  y/m/d
     */
    static format(date, format) {
        return format
            .replace(/y+/gi, () => {
                return date.getFullYear();
            })
            .replace(/m+/gi, () => {
                return EasyDate.toDouble(date.getMonth() + 1);
            })
            .replace(/d+/gi, () => {
                return EasyDate.toDouble(date.getDate());
            });
    }

    /**
     * @static method 获取所有的日期
     * @param   {Object date} 日期对象克隆
     * @param   {Object date} 今天
     * @param   {Object date}   起始日期
     * @param   {Object date}   结束日期
     * @param   {String = default}  日期格式化
     * @RegExp /([+-]?\d+)([ymd])/g  '+'/'-'+num  y/m/d
     * @return {Array} 挂载在UI模板上的date属性组
     */
    static getDates(date, today, start, end, format = defaultFormat) {
        let month = date.getMonth();
        date = new Date(date);
        date.setDate(1);
        let dates = [];
        while (date.getMonth() === month) {
            let label = EasyDate.format(date, format);
            dates.push({
                date: label.substr(0, 10),
                today: today && today.toString() === label,
                disabled: (start && label > start.toString()) || (end && label < end.toString())
            });
            date.setDate(date.getDate() + 1);
        }
        return dates;
    }


    /**
     * @static 判断是否是日期以及标准日期格式
     * @param  {String} string  格式化日期偏移量
     * @param  {String} format  日期格式
     * @RegExp {Array} [/d+/gi,/y+/gi,/m+/gi];
     * @return  {String} 'yyyy-mm-dd'
     */
    static isDate(string, format) {
        format = format || defaultFormat;
        string = string.toString();
        let pos = [];
        let regexps = [/d+/gi, /y+/gi, /m+/gi];
        let origin = format;
        regexps.forEach(regexp => {
            format = format.replace(regexp, match => {
                pos.push(match.substr(0, 1));
                return '(\\d{' + match.length + '})';
            });
        });
        let regexp = new RegExp(`^${format}$`);
        let check = string.match(regexp);
        if (!check) {
            return check;
        }
        let result = {};
        ['y', 'm', 'd'].forEach(key => {
            let regexp = new RegExp(`${key}+`, 'gi');
            origin.replace(regexp, (match, i) => {
                result[key] = string.substr(i, match.length);
            });
        });
        return `${result.y}-${result.m}-${result.d}`;
    }


    /**
     * @static 闰年判断 isLeapYear
     * @param {Number} year
     * @return {boolean} %4===
     */
    isLeapYear(year) {
        if (year && year > 1900) {
            if (year % 100 === 0) {
                return year % 400 === 0;
            }
            return year % 4 === 0;
        }
    }


    /**
     * @static method 日期整理工具
     * @param  {String} offset  格式化日期偏移量
     * @RegExp /([+-]?\d+)([ymd])/g  '+'/'-'+num  y/m/d
     * @return new Object { key: number }
     */
    static parse(offset) {
        if (!offset) {
            return
        }

        offset = offset.toLowerCase();

        let result = {};
        offset.replace(/([+-]?\d+)([ymd])/g, (match, number, unit) => {
            result[unit] = Number(number);
        })
        return result;
    }


    /**
     * @method 个位数补0
     * @param {Number} 日期数字
     * @return {String} 补0后的日期
     * */
    static toDouble(number) {
        return number > 9 ? number.toString() : ('0' + number);
    }
}

