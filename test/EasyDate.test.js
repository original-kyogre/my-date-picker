const should = require('should');
import EasyDate from '../app/EasyDate';

/**
 * @test
 * @arow
 */
describe('EasyDate', () => {
    //获取当前月份+1 月
    describe('#new', () => {
        let date = new EasyDate("+1m");
        it('should create instance', () => {
            let some = date.toDate();
            let today = new Date();
            //生成的日期年 大于 今天的日期年份
            should(some.getFullYear()).aboveOrEqual(today.getFullYear());
            //当前年份可能等于生成年份 所以差值 <=1
            should(some.getFullYear() - today.getFullYear()).belowOrEqual(1);
            //如果当前月份为12月
            if (today.getMonth() === 11) {
                //生成月份应为 1月
                should(some.getMonth()).equal(0);
            } else {
                //否则 当前月份 +1
                should(some.getMonth() - today.getMonth()).equal(1)
            }
        });
    });
});