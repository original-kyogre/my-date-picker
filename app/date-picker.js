import utils from './utils';
import $ from 'jquery';
import EasyDate from './EasyDate';
import calendar from '../template/calendar.hbs';
import template from '../template/picker.hbs';

export default class DatePicker {
    constructor(target, options = {}) {
       // options = options.scattered || {scattered: true};
        this.target = target;
        this.range = utils.getRange(options);
        if ('multiple' in options) {
            options.confirm = options.multiple;
        }
        this.options = options;
        this.createElement(options);
        this.delegateEvent(options);
        this.setValue(options);
    }

    /**
     * @method 利用模板创建EL对象
     * @param {Object} today start end method fixCalendarContainer
     */
    createElement(options) {

        options = Object.assign({}, options);
        let today = options.today = new EasyDate(0, options);
        let start = options.start = options.start ? new EasyDate(options.start, options) : today;
        let end = options.end = options.end ? new EasyDate(options.end, options) : null;
        let current = start.clone();
        current.setDate(1);
        let months = [];
        for (let i = 0; i < 2; i++) {
            let month = this.createMonthObject(current, today, start, end);
            months.push(month);
            current.add('+1m');
        }
        options.months = months;
        let item = $(template(options));
        item.appendTo(document.body);
        this.$el = item;
        this.lastMonth = current;
        if (options.fixCalendarContainer) {
            this.$el.find('.ucupay-dp-container').height($(window).height() - 105);
        }
    }

    /**
     * @method 生成月label对象
     * @param {Object} 起始日期克隆对象
     * @param {Object} 今天
     * @param {Object} 起始日期
     * @param {Object} 结束日期
     */
    createMonthObject(current, today, start, end) {
        return current.toObject(today, start, end);
    }

    //点击日期 确认
    confirm() {
        let value = this.$el.find('.select').map(function () {
            return $(this).data('date')
        }).get();
        this.target.val(value.join('.'));
        //关闭还是跳转
        this.hide();
    }

    delegateEvent(options) {
        this.$el.on('click', 'li:not(.disable,.empty,.out-range)', this.onClick.bind(this)).on('click', 'ucupay-dp-close-button', () => {
            this.$el.addClass('out');
        }).on('click', 'ucupay-dp-confirm-button', () => {
            this.confirm();
        }).on('transitionend', () => {
            this.$el.toggleClass('hide', this.$el.hasClass('out'));
        });

        if (!this.lastMonth.isGreaterOrEqual(options.end)) {
            this.$el.find('.ucupay-dp-container').on('scroll', this.onScroll.bind(this));
        }
    }

    //根据values 数组截断 item寻找对应 el
    setValue(value) {
        //
        // let values = value.split(',');
        // values.forEach(value => {
        //     this.$el.find('[data-date="' + value + '"]').addClass('select');
        // });
    }

    //被点击的元素进行 toggle select处理
    onClick(event) {
        let li = $(event.currentTarget);
        if (li.hasClass('select')) {
            li.removeClass('select');
            return;
        }
        if (!this.options.multiple) {
            this.$el.find('.select').removeClass('select');
        }
        li.addClass('select');
        if (!this.options.confirm) {
            this.confirm();
        }
    }

    //滚动渲染多个
    onScroll(event) {
        let container = event.target;
        if (container.scrollHeight - container.scrollTop <= container.offsetHeight + 10) {
            let item = calendar(this.createMonthObject(this.lastMonth, this.options.today, this.options.start, this.options.end));
            container.appendChild($(item)[0]);
            this.lastMonth.add('+1m');
            if (this.lastMonth.isGreaterOrEqual(this.options.end)) {
                $(container).off('scroll');
            }
            return true;
        }
    }


}




