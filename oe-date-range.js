/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { PaperInputBehavior } from "@polymer/paper-input/paper-input-behavior.js";
import { IronFormElementBehavior } from "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import "oe-utils/date-utils.js";
import { OEFieldMixin } from "oe-mixins/oe-field-mixin";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-flex-layout/iron-flex-layout";
import "@polymer/polymer/lib/elements/dom-if.js";
import "oe-input/oe-input.js";
import "./oe-date-range-picker.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-card/paper-card.js";
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
class OeDateRange extends OECommonMixin(
  mixinBehaviors([IronFormElementBehavior, PaperInputBehavior], PolymerElement)
) {
  static get is() {
    return "oe-date-range";
  }

  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment">
        .foc:focus {
          color: #a69db3;
        }
        .point {
          pointer-events: none;
        }

        #display {
          width: 100% @apply --range-date-input;
        }
        .date-button:focus {
          color: var(--paper-input-container-focus-color, --primary-color);
        }
        .suffix-btn {
          color: var(
            --paper-input-container-color,
            var(--secondary-text-color)
          );
          padding: 0;
          margin: 0;
          min-width: 0;
          @apply --oe-date-suffix;
        }
        #cal {
          @apply --event-icon-input;
        }
        .dropdown-content {
          min-height: 340px;
          min-width: 300px;
          overflow: hidden;
        }
        .header {
          background-color: blue;
          height: 80px;
          margin-top: 0px;
        }
        .picker {
          margin: 0px;
          padding: 12px;
        }
        .year {
          color: #ddddf9;
          padding: 5px 0px;
          font-size: 12px;
        }
        .start-month-date,
        .end-month-date {
          padding: 5px 0px;
          font-size: 25px;
          color: #d4e0ef;
          font-weight: 600;
        }
        .seperator {
          border-top: 1px solid;
          border-right: 1px solid;
          width: 44px;
          height: 44px;
          margin: 17px 17px 0 0;
          transform: rotate(32deg) matrix(1, 0.5, 0, 1, 0, 1);
          color: #ddddf9;
        }
        paper-button {
          color: #1565c0;
          font-weight: 500;
        }
        paper-button[disabled] {
          color: #94a9c1;
          font-weight: 500;
        }
        oe-input {
          @apply --oe-input-date;
        }
        .sdate-range{
          padding: 0px 10px;
          min-width: 85px;
        }
        .edate-range{
          padding: 0px 10px;
          min-width: 85px;
        }
      </style>
      <dom-if if="[[_computeAttachDialog(dropdownMode,dialogAttached)]]">
        <template>
          <paper-dialog
            aria-modal="true"
            modal
            id="dialog"
            opened="{{expand}}"
            on-keydown="_handleEscape"
            on-iron-overlay-opened="patchOverlay"
          >
            <template is="dom-if" if="[[_dateSelected(pickerSdate,pickerEdate)]]">
              <div class="header horizontal layout">
                <div class="sdate-range layout vertical">
                  <div class="year">[[getYear(pickerSdate)]]</div>
                  <div class="start-month-date">[[getDayMonth(pickerSdate)]]</div>
                </div>
                <div class="seperator"></div>
                <div class="edate-range layout vertical">
                  <div class="year">[[getYear(pickerEdate)]]</div>
                  <div class="start-month-date">[[getDayMonth(pickerEdate)]]</div>
                </div>
              </div>
            </template>
            <div class="picker vertical flex">
              <oe-date-range-picker
                id="picker"
                class="flex"
                value="{{localValue}}"
                locale="[[locale]]"
                start-of-week="[[startOfWeek]]"
                disabled-days="[[disabledDays]]"
                holidays="[[holidays]]"
                max="[[max]]"
                min="[[min]]"
              ></oe-date-range-picker>

              <div class="layout horizontal center-center">
                <paper-button id="cancelBtn" on-tap="_onCancel"
                  >Cancel</paper-button
                >
                <paper-button
                  id="okBtn"
                  on-tap="_onOK"
                  disabled="[[!localValue.endDate]]"
                  >OK</paper-button
                >
              </div>
            </div>
          </paper-dialog>
        </template>
      </dom-if>

      <oe-input
        id="display"
        class="bottomless"
        label="[[label]]"
        value="{{_formatDate(startDate,endDate)}}"
        required$="[[required]]"
        readonly
        placeholder="[[_getPlaceholder(format)]]"
        validator="[[validator]]"
        no-label-float="[[noLabelFloat]]"
        always-float-label="[[alwaysFloatLabel]]"
        invalid="{{invalid}}"
        error-message="{{errorMessage}}"
      >
        <paper-button
          aria-label="clear date from calendar"
          slot="suffix"
          class="suffix-btn"
          on-tap="_clearDate"
        >
          <iron-icon icon="clear"></iron-icon>
        </paper-button>
        <paper-button
          id="cal"
          aria-label="Select date from calendar"
          slot="suffix"
          class="suffix-btn date-button"
          on-tap="_handleTap"
        >
          <iron-icon icon="today"></iron-icon>
        </paper-button>
      </oe-input>

      <dom-if if="[[_computeAttachDropdown(dropdownMode,dropdownAttached)]]">
        <template>
          <iron-dropdown
            id="dropdown"
            no-cancel-on-outside-click="[[openOnFocus]]"
            no-animations
            horizontal-align="right"
            vertical-align="{{verticalAlign}}"
            vertical-offset="{{verticalOffset}}"
            no-auto-focus
            opened="{{expand}}"
          >
            <paper-card
              slot="dropdown-content"
              class="dropdown-content layout vertical"
              disabled$="[[disabled]]"
            >
              <div class="vertical flex">
                <oe-date-range-picker
                  disable-initial-load
                  class="flex"
                  id="datePicker"
                  value="{{localValue}}"
                  locale="[[locale]]"
                  start-of-week="[[startOfWeek]]"
                  disabled-days="[[disabledDays]]"
                  holidays="[[holidays]]"
                  max="[[max]]"
                  min="[[min]]"
                  on-selection-double-click="_onOK"
                ></oe-date-range-picker>
                <div class="layout horizontal">
                  <div class="layout flex"></div>
                  <paper-button id="cancelBtn" on-tap="_onCancel"
                    >Cancel</paper-button
                  >
                  <paper-button
                    id="okBtn"
                    on-tap="_onOK"
                    disabled="[[!localValue.endDate]]"
                    >OK</paper-button
                  >
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
      label: {
        type: String,
      },
      startDate: {
        type: Object,
        value: null,
        observer: "_computeStart",
        notify: true,
      },
      endDate: {
        type: Object,
        value: null,
        observer: "_computeEnd",
        notify: true,
      },
      /**
       * Setting to true makes the datepicker open as a dropdown on focus of this element.
       * This will work only if the oe-date component is in dropdown-mode.
       */
      openOnFocus: {
        type: Boolean,
        value: false,
      },
      format: {
        type: String,
      },
      /**
       * Setting to true makes the datepicker open as a dropdown instead of a dialog
       */
      dropdownMode: {
        type: Boolean,
        value: false,
      },
      /**
       * vertical offset for date picker dropdown
       */
      verticalOffset: {
        type: String,
        value: 62,
      },

      /**
       * vertical alignment for date picker dropdown
       */
      verticalAlign: {
        type: String,
        value: "top",
      },
      /**
       * Maximum allowed date (accepts date shorthands)
       */
      max: {
        type: Object,
        observer: "_maxChanged",
      },

      /**
       * Minimum allowed date (accepts date shorthands)
       */
      min: {
        type: Object,
        observer: "_minChanged",
      },
      pickerSdate:{
        type: Object
      },
      pickerEdate:{
        type: Object
      }
    };
  }
  _dateSelected(start, end) {
    return (start ||
      end) &&
      (typeof start === "object" ||
      typeof end === "object")
      ? true
      : false;
  }

  getYear(date) {
    if(date){
      let year = date.getUTCFullYear();
      return year;
    }
  }
  _forwardFocus(e) {
    this.$.display.focus();
  }
   /**
   * Returns a reference to the focusable element. Overridden from
   * PaperInputBehavior to correctly focus the native input.
   *
   * @return {HTMLElement}
   */
  get _focusableElement() {
    return PolymerElement ? this.inputElement._inputElement :
      this.inputElement;
  }

  /**
   * Returns a reference to the input element.
   */
  get inputElement() {
    return this.$.display.inputElement;
  }

  getDayMonth(date) {
    if(date){
      var months = new Array(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      );
      let month = months[date.getUTCMonth()].substring(0, 3);
      let day = date.getUTCDate();
      return month + " " + day;
    }
   
  }
  connectedCallback() {
    super.connectedCallback();
    this.set('pickerSdate',new Date());
    this.addEventListener('selection-changed',function(event){
      if(this.localValue.startDate && !this.localValue.endDate){
        this.set('pickerSdate',this.localValue.startDate);
        this.set('pickerEdate',null);
      }
      if(this.localValue.endDate){
        this.set('pickerEdate',this.localValue.endDate);
      }
    }.bind(this));
    this.$.display.addEventListener("focus", (e) => this._focusHandle(e));
    this.addEventListener("blur", (e) => this._blurHandle(e));
    this.set("expand", false);
    if (this.max && typeof this.max === "string") {
      var newDate = this._parseShorthand(this.max);
      if (newDate) {
        this.set("max", newDate);
      } else {
        console.warn("Invalid 'max' date value", this.max);
      }
    }
    if (this.min && typeof this.max === "string") {
      var newDate = this._parseShorthand(this.min); // eslint-disable-line no-redeclare
      if (newDate) {
        this.set("min", newDate);
      } else {
        console.warn("Invalid 'min' date value", this.min);
      }
    }
    if (!this.dropdownMode && this.openOnFocus) {
      console.warn("open-on-focus is only available in dropdown-mode.");
    }
  }
  /**
   * Clear the date value entered
   */
  _clearDate() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.pickerSdate = new Date();
    this.pickerEdate = undefined;
    this.set("localValue", {
      startDate: new Date(),
      endDate: this.endDate,
    });
  }
  _handleEscape(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      this._onCancel();
    }
  }
  constructor() {
    super();
    this.dialogAttached = false;
    this.dropdownAttached = false;
  }
  /**
   * Converts the user shortHand inputs to Date values.
   * computes values for 'today' , 3y , -7M etc.
   * @param {string} input input shortHand string
   * @return {Date} parsed Date value
   */
  _parseShorthand(input) {
    if (!input || input.trim().length === 0) {
      return undefined;
    }
    var tuInput = input.trim().toUpperCase();

    var retDate;

    var mDate = this._resolveReferenceDate(
      this.referenceDate,
      this.referenceTimezone
    );

    if (tuInput === "T" || tuInput === "TOD" || tuInput === "TODAY") {
      retDate = mDate;
    } else if (tuInput == "TOM") {
      retDate = mDate.setUTCDate(mDate.getUTCDate() + 1);
    } else if (tuInput[tuInput.length - 1] === "D") {
      retDate = this._calcDate(mDate, tuInput, "days");
    } else if (tuInput[tuInput.length - 1] === "W") {
      retDate = this._calcDate(mDate, tuInput, "weeks");
    } else if (tuInput[tuInput.length - 1] === "M") {
      retDate = this._calcDate(mDate, tuInput, "months");
    } else if (tuInput[tuInput.length - 1] === "Q") {
      retDate = this._calcDate(mDate, tuInput, "quarters");
    } else if (tuInput[tuInput.length - 1] === "Y") {
      retDate = this._calcDate(mDate, tuInput, "years");
    } else {
      retDate = OEUtils.DateUtils.parse(tuInput, this.format);
    }

    return retDate;
  }
  _resolveReferenceDate(refDate, refTZ) {
    let rDate;

    if (refDate && typeof refDate.getTime === "function") {
      rDate = refDate;
    } else {
      // If referenceDate is NOT specified,
      // reference for date calculation is today in user's TZ (represented as UTC00:00).
      // i.e. At 02:30 AM IST on 5th-Nov-2019.
      //      The reference date is 2019-11-05 00:00:00Z
      // At the same moment, person sitting in PST (GMT -7:00) sees
      //      current date and time as 2019-11-04 14:00 PM.
      //      For her the reference date would be 2019-11-04 00:00:00Z
      //
      // If referenceTimezone is specified
      //      Reference date is current-date in biz-TZ (with time set to UTC00:00)
      //      i.e. setting referenceTimezone = -420 (minutes) means
      //      users in anytimezone will see the reference date to be (2019-11-04 00:00:00Z)
      rDate = new Date();

      /* If reference timezone offset is specified, arrive date in that timezone */
      if (typeof refTZ === "number") {
        rDate.setMinutes(
          rDate.getMinutes() + (refTZ + new Date().getTimezoneOffset())
        );
      }
    }
    rDate = new Date(
      Date.UTC(rDate.getFullYear(), rDate.getMonth(), rDate.getDate())
    );
    return rDate;
  }
  _getPlaceholder(format) {
    return format + " - " + format;
  }
  _focusHandle(e) {
    // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode && !this.expand) {
      this.__expandDropDown();
    }
  }
  _blurHandle(e) {
    // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode) {
      this.set("expand", false);
    }
  }
  _handleTap(e) {
    if (!this.readonly && !this.disabled) {
      if (this.dropdownMode) {
        if (!this.expand && !this.openOnFocus) {
          this.__expandDropDown();
        }
      } else {
        if (!this.dialogAttached) {
          this.set("dialogAttached", true);
          this.async(
            function () {
              this.$$("#dialog").open();
            }.bind(this),
            0
          );
        } else {
          this.$$("#dialog").open();
        }
      }
    }
  }
  __expandDropDown() {
    if (!this.dropdownAttached) {
      this.set("dropdownAttached", true);
      this.async(
        function () {
          this.set("expand", true);
          //this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
        }.bind(this),
        0
      );
    } else {
      this.set("expand", true);
      //this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
    }
  }
  _computeStart() {
    if (typeof this.startDate === "string") {
      var date = new Date(this.startDate);
      if (!isNaN(date.getTime())) {
        var dateUTC = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        this.set("startDate", dateUTC);
      } else {
        this.$.display.setValidity(false, "Invalid Start Date");
      }
    }
  }
  _computeAttachDialog(dropdownMode, dialogAttached) {
    return !dropdownMode && dialogAttached;
  }

  _computeAttachDropdown(dropdownMode, dropdownAttached) {
    return dropdownMode && dropdownAttached;
  }
  _computeEnd() {
    if (typeof this.endDate === "string") {
      var date = new Date(this.endDate);
      if (!isNaN(date.getTime())) {
        var dateUTC = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        this.set("endDate", dateUTC);
      } else {
        this.$.display.setValidity(false, "Invalid End Date");
      }
    }
  }
  /**
   * Closes the dropdown
   */
  _onCancel() {
    if(!this.startDate && !this.endDate){
      this.set("localValue", {
        startDate: new Date(),
        endDate: this.endDate,
      });
    }
    this.set("expand", false);
  }
  /**
   * Sets the selected value and closes the dropdown
   */
  _onOK() {
    if (this.localValue.startDate && this.localValue.endDate) {
      this.set("startDate", this.localValue.startDate);
      this.set("endDate", this.localValue.endDate);
      this.fire("oe-date-picked", {
        startDate: this.startDate,
        endDate: this.endDate,
      });
    }
    this.set("expand", false);
    if (this.fieldId) {
      this.fire("oe-field-changed", {
        fieldId: this.fieldId,
        value: this.value,
      });
    }
  }

  _formatDate(startdateVal, enddateValue) {
    var resultStart, resultEnd, result;
    if (!startdateVal && enddateValue) {
      resultStart = null;
      resultEnd = null;
    } else if (
      typeof startdateVal === "object" &&
      typeof enddateValue === "object"
    ) {
      resultStart = OEUtils.DateUtils.format(startdateVal, this.format);
      resultEnd = OEUtils.DateUtils.format(enddateValue, this.format);
    } else {
      resultStart = startdateVal;
      resultEnd = enddateValue;
    }
    if (resultStart && resultEnd) {
      result = resultStart + " - " + resultEnd;
    } else {
      result = null;
    }
    return result;
  }
  _validate() {
    let isValid = true;
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        this.setValidity(false, "End date should be greater");
        isValid = false;
      }
    }
    if (this.max && this.endDate > this.max) {
      this.setValidity(false, 'rangeOverflow');
      return false;
    }
    if (this.min && this.startDate < this.min) {
      this.setValidity(false, 'rangeUnderflow');
      return false;
    }
    if (isValid) {
      this.setValidity(true, "");
    }
    return isValid;
  }
  /**
   * Pactch to move the backdrop behind the dialog box.
   * @param {Event} e
   */
  patchOverlay(e) {
    if (e.target.withBackdrop) {
      e.target.parentNode.insertBefore(
        e.target._backdrop || e.target.backdropElement,
        e.target
      );
    }
  }
  /**
   * Parses the shorthand for "max" and validates the value.
   * @param {Object} newMax
   */
  _maxChanged(newMax) {
    if (newMax && typeof newMax === "string") {
      var newDate = this._parseShorthand(newMax);
      if (newDate) {
        this.set("max", newDate);
        this.value && this.validate();
      } else {
        console.warn("Invalid 'max' date value", this.max);
      }
    }
  }

  /**
   * Parses the shorthand for "min" and validates the value.
   * @param {Object} newMin
   */
  _minChanged(newMin) {
    if (newMin && typeof newMin === "string") {
      var newDate = this._parseShorthand(newMin);
      if (newDate) {
        this.set("min", newDate);
        this.value && this.validate();
      } else {
        console.warn("Invalid 'min' date value", this.max);
      }
    }
  }

}
window.customElements.define(OeDateRange.is, OEFieldMixin(OeDateRange));