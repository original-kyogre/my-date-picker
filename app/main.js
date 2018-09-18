// const Picker = require('./date-picker');
import Picker from './date-picker';
import $ from "jquery";

console.log($);
window.addEventListener('load',function(){
    console.log(1);
    let target = $(event.currentTarget);
    let options = target.data();
    let picker = options.ucupayDatePicker;
    if (picker) {
        picker.show();
    }
    picker = new Picker(target, options);
    target.data('ucupay-date-picker', picker);
})
// $(window).onload(function(event){
//
// })