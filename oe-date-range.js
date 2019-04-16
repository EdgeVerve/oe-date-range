/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { OECommonMixin } from "oe-mixins/oe-common-mixin";
import "oe-utils/date-utils.js";
import { OEFieldMixin } from 'oe-mixins/oe-field-mixin';
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-flex-layout/iron-flex-layout";
import "oe-input/oe-input.js";
import "./oe-date-range-picker.js";
import "@polymer/paper-button/paper-button.js";
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-card/paper-card.js';
import "@polymer/paper-icon-button/paper-icon-button.js";
var OEUtils = window.OEUtils || {};
/**
 * `oe-date-range`
 *  This element use to select the start-date and end-date.
 * 
 *  ### Styling
 * 
 * The following custom properties and mixins are available for styling:
 * 
 * CSS Variable | Description | Default
 * ----------------|-------------|----------
 * `--start-date-input` | width of startDate oe-input | 100% 
 * `--end-date-input` | width of endDate oe-input | 100%
 * `--iron-icon-seperator` | paading on seperator |  
 * `--event-icon-input` | padding on event icon |  
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @appliesMixin OEFieldMixin
 * @demo demo/demo-oe-date-range.html
 */
class OeDateRange extends OECommonMixin(PolymerElement) {

  static get is() { return 'oe-date-range'; }

  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment">

      .bottomless {
        --paper-input-container-underline: {
          display: none;
        }
        --paper-input-container-underline-disabled: {
         display: none;
        }
        --paper-input-container-underline-focus: {
          display: none;
        }
        --paper-font-caption: {
          display: none;
        }
        --paper-input-container-color: #8a8989;
      }
     
      .foc:focus{
          color: #a69db3;
      } 
      .point{  
          pointer-events: none;
      }
      .mar{
        margin-bottom : 5px;
        color: grey;
      }
     .margin{
       margin-bottom : 10px;
       color : #999;
     }
     #startdate {
      @apply --start-date-input;
    }
    #enddate {
      @apply --end-date-input;
    }
    #icon {
      @apply --iron-icon-seperator;
    }
    #cal {
      @apply --event-icon-input;
    }
    </style>
    <div id="main" class="layout horizontal end">
      
        <oe-input id="startdate" class="bottomless" label=[[label]] invalid=[[invalid]] error-message={{errorMessage}} placeholder=[[format]] value={{_formatDate(startDate)}} readonly>
        </oe-input>
        <iron-icon id="icon" class="margin point" tabindex="-1" icon="remove"></iron-icon>
        <oe-input id="enddate"  class="bottomless" placeholder=[[format]] value={{_formatDate(endDate)}} readonly>
       </oe-input>
       <paper-icon-button id="cal" on-click="_handleTap" icon="event" class="foc mar">
       </paper-icon-button>
        <paper-dialog id="_dialog">
        <div class="vertical flex">
          <oe-date-range-picker tabindex="-1" class="flex" value="{{localValue}}" locale="[[locale]]" start-of-week="[[startOfWeek]]"
          disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
            max=[[max]] min=[[min]]></oe-date-range-picker>
          <div class="layout horizontal">
              <div class="layout flex"></div>
              <paper-button id="cancelBtn" on-tap="_onCancel">Cancel</paper-button>
              <paper-button id="okBtn" on-tap="_onOK" disabled=[[!localValue.endDate]]>OK</paper-button>
            </div>
          </div>
        </paper-dialog>
    </div>
    `;
  }

  static get properties() {
    return {

      label:{
        type: String
      },
      startDate:{
        type:Object,
        value:null,
        observer:'_computeStart'
      },
      endDate:{
        type:Object,
        value:null,
        observer:'_computeEnd'
      },
      format:{
        type: String,
        value: 'DD/MM/YYYY'
      }
    };
  }
  _handleTap(e){
    if (!this.readonly && !this.disabled) {
      this.$._dialog.open();
    }
  }
  _computeStart(){
    if(typeof this.startDate === 'string'){
        var date = new Date(this.startDate);
        if(!isNaN(date.getTime())){
          var dateUTC = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
          this.set('startDate',dateUTC);
        }
        else{
          this.$.startdate.setValidity(false,'Invalid Start Date');
        }      
    }
  }
  _computeEnd(){
    if(typeof this.endDate === 'string'){
      var date = new Date(this.endDate); 
      if(!isNaN(date.getTime())){
        var dateUTC = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
        this.set('endDate',dateUTC);
      }
      else{
        this.$.enddate.setValidity(false,'Invalid End Date');
      }
    }
  }
   /**
   * Closes the dropdown
   */
  _onCancel() {
    this.set('localValue', {'startDate':this.startDate,'endDate':this.endDate});
    this.$._dialog.close();
  }
   /**
   * Sets the selected value and closes the dropdown
   */
  _onOK() {
    if(this.localValue.startDate && this.localValue.endDate){
      this.set('startDate', this.localValue.startDate);
      this.set('endDate', this.localValue.endDate);
      this.fire('oe-date-picked', {'startDate':this.startDate,'endDate':this.endDate});
    }
      this.$._dialog.close();
  }
 
  _formatDate(dateVal){
    if(this.format === ''){
      this.format = 'DD/MM/YYYY';
    }
    var result;
    if(!dateVal){
      result = null;
    } else if(typeof dateVal === 'object'){
      result = OEUtils.DateUtils.format(dateVal,this.format);
    } else {
      result = dateVal;
    }
    return result;
  }
  _validate(){
    let isValid = true;
    if(this.startDate  && this.endDate){
      if(this.startDate > this.endDate){
        this.setValidity(false, 'End date should be greater');
        isValid = false;
    }
  }
  if(isValid){
    this.setValidity(true, '');
  }
  return isValid;
  }
}
window.customElements.define(OeDateRange.is, OEFieldMixin(OeDateRange));