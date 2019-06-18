/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html } from '@polymer/polymer/polymer-element.js';
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "oe-date/oe-datepicker.js";


var OeDatePicker = window.customElements.get('oe-datepicker');

/**
 * `oe-date-range-picker`
 *  This element used to create date picker for `oe-date-range` element, by making use of oe-datepicker component from oe-date element.
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * 
 */
class OeDateRangePicker extends OeDatePicker {

  static get is() { return 'oe-date-range-picker'; }

  static get template(){
    return html`
    <style>
    .day.start-date span {
        background-color: #296969;
        color: var(--dp-selected-text);
        border-radius: 100%;
    }
    .day.end-date span {
        background-color: #296969;
        color: var(--dp-selected-text);
        border-radius: 100%;
    }
    .day.range-date span {
        background-color: #296969;
        color: var(--dp-selected-text);
        opacity:0.8;
        border-radius: 100%;
    }
    </style>
    ${super.template}
    `;
  }


  constructor(){
    super();
    this.startClick = false;
  }

  static get properties(){
    return {
      value: {
        type : Object,
        value:function(){
          return {
            startDate: null,
            endDate:null
          };
        }
      }
    };
  }

  _valueChanged(){
    if(!this.value.startDate){

      var today = new Date();
      this._activeMonth = today.getMonth();
      this._activeYear = today.getFullYear();
      this.prepareMonth(this._activeMonth, this._activeYear);
    }
  }
  _canTabInOnCalendar(month, selected){
    /* If selected date is not in current month we should allow tabbing into calendar */
    var tabIndex = -1;
    if(month && selected.startDate){
        if(!selected || month.number !== selected.startDate.getUTCMonth() ||
        month.year !== selected.startDate.getUTCFullYear()){
        tabIndex = 0;
      }
    }
    return tabIndex;
  }


  _pickDate(e){
    var data = e.currentTarget.dataset;
    if (data && data.date) {
        var day = data.date;
        var month = data.month;
        var year = data.year;
        if (day && month && year) {
          var pickedDate = new Date(Date.UTC(year, month, day));
          if(this.value.startDate && this.value.endDate){
            this.set('value',{
              startDate:pickedDate,
              endDate:null
            });
          }else if(this.value.startDate && this.value.startDate < pickedDate){
            this.set('value',{
              startDate:this.value.startDate,
              endDate:pickedDate
            });
          }else{
            this.set('value',{
              startDate:pickedDate,
              endDate:null
            });
          }
        }
    }
  }


  _getDateClass(day, month, selected){
    var retClass = '';
    var date = new Date(Date.UTC(month.year,month.number,day.n));
    if(selected.startDate && date.getTime() === selected.startDate.getTime()){
      retClass += ' start-date';
    }else if (selected.endDate && date.getTime() === selected.endDate.getTime()){
      retClass += ' end-date';
    }else if(selected.endDate && date.getTime() > selected.startDate.getTime() && date.getTime() < selected.endDate.getTime()){
      retClass += ' range-date';
    }
    if (day.disabled) {
        retClass += ' disabled';
    }

    return retClass;
  }
}

window.customElements.define(OeDateRangePicker.is, OeDateRangePicker);