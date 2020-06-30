/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { OECommonMixin } from "oe-mixins/oe-common-mixin";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { PaperInputBehavior } from "@polymer/paper-input/paper-input-behavior.js";
import { IronFormElementBehavior } from "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "oe-utils/date-utils.js";
import { OEFieldMixin } from 'oe-mixins/oe-field-mixin';
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-flex-layout/iron-flex-layout";
import '@polymer/polymer/lib/elements/dom-if.js';
import "oe-input/oe-input.js";
import "./oe-date-range-picker.js";
import "@polymer/paper-button/paper-button.js";
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
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
 * `--range-date-input` | width of range oe-input | 100% 
 * `--event-icon-input` | padding on event icon |  
 * `--oe-input-underline | underline to start date and end date | {}
 * 
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @appliesMixin OEFieldMixin
 * @demo demo/demo-oe-date-range.html
 */
class OeDateRange extends OECommonMixin(mixinBehaviors([IronFormElementBehavior, PaperInputBehavior],PolymerElement)) {

  static get is() { return 'oe-date-range'; }

  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment">
  
   
      .foc:focus{
          color: #a69db3;
      } 
      .point{  
          pointer-events: none;
      }
      .mar{
      padding: 5px 5px 0 5px;
        color: grey;
   
    margin-top: 15px;
      }
     
     #rangedate {
       width: 100%
      @apply --range-date-input;
    }
   
    #cal {
      @apply --event-icon-input;
    }
    .dropdown-content{
      min-height: 340px;
      min-width: 300px;
    }
    </style>
    <dom-if if=[[_computeAttachDialog(dropdownMode,dialogAttached)]]>
    <template>
    <paper-dialog aria-modal="true" modal id="dialog" opened={{expand}} on-keydown="_handleEscape" on-iron-overlay-opened="patchOverlay">
      
          <div class="vertical flex">
          <oe-date-range-picker class="flex" value="{{localValue}}" locale="[[locale]]" start-of-week="[[startOfWeek]]"
          disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
            max=[[max]] min=[[min]]></oe-date-range-picker>
          
            <div class="layout horizontal">
            <div class="layout flex"></div>
            <paper-button id="cancelBtn" on-tap="_onCancel">Cancel</paper-button>
            <paper-button id="okBtn" on-tap="_onOK" disabled=[[!localValue.endDate]]>OK</paper-button>
          </div>
        </div>
        </paper-dialog>
            </template>
  </dom-if>
    <div id="main" class="layout horizontal justified">
        <oe-input id="rangedate" class="bottomless" tabindex="-1" label=[[label]] value={{_formatDate(startDate,endDate)}} required$=[[required]] readonly disabled=[[disabled]] placeholder=[[format]]-[[format]] validator=[[validator]] no-label-float=[[noLabelFloat]]
        always-float-label="[[alwaysFloatLabel]]" invalid={{invalid}} error-message={{errorMessage}}></oe-input>
       <paper-icon-button id="cal" on-click="_handleTap" icon="event" class="foc mar">
       </paper-icon-button>
       </div>
       <dom-if if=[[_computeAttachDropdown(dropdownMode,dropdownAttached)]]>
       <template>
       <iron-dropdown id="dropdown" 
       no-cancel-on-outside-click=[[openOnFocus]]
       no-animations horizontal-align="right" 
       vertical-align="{{verticalAlign}}" vertical-offset="{{verticalOffset}}"  no-auto-focus opened={{expand}}>
           <paper-card slot="dropdown-content" class="dropdown-content layout vertical" disabled$="[[disabled]]">
             <div class="vertical flex">
             <oe-date-range-picker disable-initial-load class="flex" id="datePicker" value="{{localValue}}" locale="[[locale]]" start-of-week="[[startOfWeek]]"
             disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
               max=[[max]] min=[[min]]
               on-selection-double-click="_onOK"></oe-date-range-picker>
            <div class="layout horizontal">
              <div class="layout flex"></div>
              <paper-button id="cancelBtn" on-tap="_onCancel">Cancel</paper-button>
              <paper-button id="okBtn" on-tap="_onOK" disabled=[[!localValue.endDate]]>OK</paper-button>
            </div>
            </div>
      </paper-card>
    </iron-dropdown>
  </template>
</dom-if>
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
        observer:'_computeStart',
        notify: true
      },
      endDate:{
        type:Object,
        value:null,
        observer:'_computeEnd',
        notify: true
      },
         /**
       * Setting to true makes the datepicker open as a dropdown on focus of this element.
       * This will work only if the oe-date component is in dropdown-mode.
       */
      openOnFocus: {
        type: Boolean,
        value: false
      },
      format:{
        type: String,
        value: 'DD/MM/YYYY'
      },
        /**
       * Setting to true makes the datepicker open as a dropdown instead of a dialog
       */
      dropdownMode: {
        type: Boolean,
        value: false
      },
/**
       * vertical offset for date picker dropdown
       */
      verticalOffset: {
        type: String,
        value: 62
      },

      /**
       * vertical alignment for date picker dropdown
       */
      verticalAlign: {
        type: String,
        value: 'top'
      },

    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.$.rangedate.addEventListener('focus', e => this._focusHandle(e));
    this.addEventListener('blur', e => this._blurHandle(e));
    this.set('expand', false);
    if (!this.dropdownMode && this.openOnFocus) {
      console.warn("open-on-focus is only available in dropdown-mode.");
    }
  }
  _handleEscape(e){
    if(e.key === 'Escape' || e.keyCode === 27){
      this._onCancel();
    }
  }
  constructor() {
    super();
    this.dialogAttached = false;
    this.dropdownAttached = false;
  }
  _focusHandle(e) { // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode && !this.expand) {
      this.__expandDropDown();
    }
  }
  _blurHandle(e) { // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode) {
      this.set('expand', false);
    }
  }
  _handleTap(e){
    if (!this.readonly && !this.disabled) {
      if (this.dropdownMode) {
        if (!this.expand && !this.openOnFocus) {
          this.__expandDropDown();
        }
      } else {
        if (!this.dialogAttached) {
          this.set('dialogAttached', true);
          this.async(function () {
            this.$$('#dialog').open();
          }.bind(this), 0);
        } else {
          this.$$('#dialog').open();
        }
      }
    }
  }
  __expandDropDown() {
    if (!this.dropdownAttached) {
      this.set('dropdownAttached', true);
      this.async(function () {
        this.set('expand', true);
        //this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
      }.bind(this), 0);
    } else {
      this.set('expand', true);
      //this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
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
          this.$.rangedate.setValidity(false,'Invalid Start Date');
        }      
    }
  }
  _computeAttachDialog(dropdownMode, dialogAttached) {
    return !dropdownMode && dialogAttached;
  }

  _computeAttachDropdown(dropdownMode, dropdownAttached) {
    return dropdownMode && dropdownAttached;
  }
  _computeEnd(){
    if(typeof this.endDate === 'string'){
      var date = new Date(this.endDate); 
      if(!isNaN(date.getTime())){
        var dateUTC = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate()));
        this.set('endDate',dateUTC);
      }
      else{
        this.$.rangedate.setValidity(false,'Invalid End Date');
      }
    }
  }
   /**
   * Closes the dropdown
   */
  _onCancel() {
    this.set('localValue', {'startDate':this.startDate,'endDate':this.endDate});
    this.set('expand', false);
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
    this.set('expand', false);
    if(this.fieldId) {
      this.fire('oe-field-changed', {fieldId: this.fieldId, value: this.value});      
    }
  }
 
  _formatDate(startdateVal,enddateValue){
    if(this.format === ''){
      this.format = 'DD/MM/YYYY';
    }
    var resultStart,resultEnd,result;
    if(!startdateVal && enddateValue){
      resultStart= null;
      resultEnd = null;
    } else if(typeof startdateVal === 'object' && typeof enddateValue === 'object'){
      resultStart = OEUtils.DateUtils.format(startdateVal,this.format);
      resultEnd = OEUtils.DateUtils.format(enddateValue,this.format);
    } else {
      resultStart = startdateVal;
      resultEnd = enddateValue;
    }
    if(resultStart && resultEnd){
      result =  resultStart +' - '+ resultEnd;
    }
    else{
      result = null;
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
   /**
   * Pactch to move the backdrop behind the dialog box.
   * @param {Event} e 
   */
  patchOverlay(e) {
    if (e.target.withBackdrop) {
      e.target.parentNode.insertBefore(e.target._backdrop || e.target.backdropElement, e.target);
    }
  }
}
window.customElements.define(OeDateRange.is, OEFieldMixin(OeDateRange));