/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "oe-date/oe-datepicker.js";

var OeDatePicker = window.customElements.get("oe-datepicker");

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
  static get is() {
    return "oe-date-range-picker";
  }

  static get template() {
    return html`
      <style>
        .day.start-date span {
          background-color: #1565c0;
          color: var(--dp-selected-text);
          border-radius: 100%;
        }
        .day.end-date span {
          background-color: #1565c0;
          color: var(--dp-selected-text);
          border-radius: 100%;
        }
        .day.range-date span {
          background-color: #d4e0ef;
          border-radius: 100%;
        }
       
        .day.range-date {
          @apply --oe-range-date;
        }
        .day.end-date {
          @apply --oe-end-date;
        }
        .day.start-date {
          @apply --oe-start-date;
        }
      </style>
      ${super.template}
    `;
  }

  constructor() {
    super();
    this.startClick = false;
  }

  static get properties() {
    return {
      value: {
        type: Object,
        value: function () {
          return {
            startDate: null,
            endDate: null,
          };
        },
      },
      focusedDate: {
        type: Date,
        observer: "_focusChanged",
      },
      /**
       * Maximum selectable date
       */
      max: {
        type: Date,
        observer: "_renderCurrentMonth",
      },

      /**
       * Minimum selectable date
       */
      min: {
        type: Date,
        observer: "_renderCurrentMonth",
      },
    };
  }
  static get observer() {
    ["_valueChanged(value.*)"];
  }
  _valueChanged() {
    //this.set('focusedDate',undefined);
    if (
      typeof this.value.startDate == "string" ||
      this.value.startDate instanceof String
    ) {
      this.value.startDate = new Date(this.value);
      //we'll visit this function again this time with typeof(value)=Date
      return;
    }
    if (this.value.startDate && !isNaN(this.value.startDate.getTime())) {
      if (
        this._activeMonth != this.value.startDate.getUTCMonth() ||
        this._activeYear != this.value.startDate.getUTCFullYear()
      ) {
        this._activeMonth = this.value.startDate.getUTCMonth();
        this._activeYear = this.value.startDate.getUTCFullYear();
        this.prepareMonth(this._activeMonth, this._activeYear);
      }
    } else {
      if (this.value.startDate !== undefined) {
        var today = new Date();
        this._activeMonth = today.getMonth();
        this._activeYear = today.getFullYear();
        this.prepareMonth(this._activeMonth, this._activeYear);
      }
    }
  }
  _focusChanged() {
    if (
      typeof this.focusedDate == "string" ||
      this.focusedDate instanceof String
    ) {
      this.focusedDate = new Date(this.focusedDate);
      //we'll visit this function again this time with typeof(value)=Date
      return;
    }
    if (this.focusedDate && !isNaN(this.focusedDate.getTime())) {
      if (
        this._activeMonth != this.focusedDate.getUTCMonth() ||
        this._activeYear != this.focusedDate.getUTCFullYear()
      ) {
        this._activeMonth = this.focusedDate.getUTCMonth();
        this._activeYear = this.focusedDate.getUTCFullYear();
        this.prepareMonth(this._activeMonth, this._activeYear);
      }
    } else {
      if (this.focusedDate !== undefined) {
        var today = new Date();
        this._activeMonth = today.getMonth();
        this._activeYear = today.getFullYear();
        this.prepareMonth(this._activeMonth, this._activeYear);
      }
    }
  }
  _canTabInOnCalendar(month, selected) {
    /* If selected date is not in current month we should allow tabbing into calendar */
    var tabIndex = -1;
    if (month && selected.startDate) {
      if (
        !selected.startDate ||
        month.number !== selected.startDate.getUTCMonth() ||
        month.year !== selected.startDate.getUTCFullYear()
      ) {
        tabIndex = 0;
      }
    }
    return tabIndex;
  }
  connectedCallback() {
    super.connectedCallback();
    this.set("showing", "month");

    this._settingsChanged();

    if (!this.value && !this.disableInitialLoad) {
      this.set("value", { startDate: new Date(), endDate: null });
    } else if (
      this.value !== "Invalid date" &&
      this.value &&
      typeof this.value != "date"
    ) {
      // eslint-disable-line valid-typeof
      this.set("value", { startDate: new Date(), endDate: null });
    }
  }
  _canTabInOnDate(day, month, selected) {
    var tabIndex = -1;
    if (
      selected.startDate &&
      selected.startDate.getUTCDate &&
      day.n === selected.startDate.getUTCDate() &&
      month.number == selected.startDate.getUTCMonth() &&
      month.year === selected.startDate.getUTCFullYear()
    ) {
      tabIndex = 0;
    }
    else if( selected.endDate &&
      selected.endDate.getUTCDate &&
      day.n === selected.endDate.getUTCDate() &&
      month.number == selected.endDate.getUTCMonth() &&
      month.year === selected.endDate.getUTCFullYear()){
        tabIndex = 0;
      }
    return tabIndex;
  }
  _handleDateArrowNavigation(e) {
    if (
      this.disabled ||
      [
        "Enter",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ].indexOf(e.code) < 0
    ) {
      return;
    }
    var targetDiv = e.currentTarget;
    var newStartDate, newEndDate, newDate;
    var newFocusDate;
    var currentStartDate = targetDiv.querySelector("div.start-date");
    var currentDate;
    var currentEndDate = targetDiv.querySelector("div.end-date");
    var startData = currentStartDate && currentStartDate.dataset;
    var endData = currentEndDate && currentEndDate.dataset;
    //var month = this.__prepareMonth(this._activeMonth, this._activeYear);
    if (startData && startData.date && startData.month && startData.year) {
      var startday = parseInt(startData.date);
     
      if (startday) {
        // on Enter it select the current focused date
        if (e.code === "Enter") {
          if (
            startData &&
            startData.date &&
            startData.month &&
            startData.year &&
            endData &&
            endData.date &&
            endData.month &&
            endData.year
          ) {
            newStartDate = new Date(
              Date.UTC(startData.year, startData.month, startData.date)
            );
            newEndData = new Date(
              Date.UTC(endData.year, endData.month, endData.date)
            );
            if (newStartDate && newEndDate) {
              this.set("value", {
                startDate: newStartDate,
                endDate: newEndDate,
              });
              this.fire(
                "selection-double-click",
                this.getDetails(this.value.startDate)
              );
              e.preventDefault();
            }
          } else {
            if (
              startData &&
              startData.date &&
              startData.month &&
              startData.year
            ) {
              newStartDate = new Date(
                Date.UTC(startData.year, startData.month, startData.date)
              );
              if (newStartDate) {
                this.set("value", {
                  startDate: newStartDate,
                  endDate: null,
                });
                //this.fire("selection-double-click", this.getDetails(this.value));
                e.preventDefault();
              }
            }
          }
        } else {

          // on ArrowLeft goto to one day before

          if (e.code === "ArrowLeft") {
            newStartDate = new Date(
              Date.UTC(startData.year, startData.month, startday - 1)
            );
            // if (this.focusedDate) {
            //   newFocusDate = new Date(
            //     Date.UTC(
            //       this.focusedDate.getUTCFullYear(),
            //       this.focusedDate.getMonth(),
            //       this.focusedDate.getUTCDate() - 1
            //     )
            //   );
            //   var tempdate = newFocusDate.getUTCDate().toString();
            //   var tempmonth = newFocusDate.getUTCMonth().toString();
            //   var tempyear = newFocusDate.getUTCFullYear().toString();
            //   currentDate = targetDiv.querySelector(`div[data-date="${tempdate}"][data-month="${tempmonth}"][data-year="${tempyear}"]`);
            //   currentDate && currentDate.focus();
            // } else {
            //   newFocusDate = new Date(
            //     Date.UTC(startData.year, startData.month, startday - 1)
            //   );
            //   var temp = newFocusDate.getUTCDate().toString();
            //   currentDate = targetDiv.querySelector(`div[data-date="${temp}"]`);
            //   currentDate && currentDate.focus();
            // }
            
          }
          // on ArrowUp goto same day previous week
          else if (e.code === "ArrowUp") {
            newStartDate = new Date(
              Date.UTC(startData.year, startData.month, startday - 7)
            );
          }
          //on ArrowRight goto next day.
          else if (e.code === "ArrowRight") {
            newStartDate = new Date(
              Date.UTC(startData.year, startData.month, startday + 1)
            );
          }
          //on ArrowDown goto next week same day.
          else if (e.code === "ArrowDown") {
            newStartDate = new Date(
              Date.UTC(startData.year, startData.month, startday + 7)
            );
          }
          if (!this._isDateDisabled(newStartDate)) {
            this.set("focusedDate", undefined);
            this.set("value", { startDate: newStartDate, endDate: newEndDate });
            this.fire("selection-changed", this.getDetails(newStartDate));
            e.preventDefault();
          }
          if (!this._isDateDisabled(newFocusDate)) {
            this.set("focusedDate", newFocusDate);
            // this.fire('selection-changed', this.getDetails(newFocusDate));
            e.preventDefault();
          }
        }
      }
    }
    this.async(function () {
      if (!this.focusedDate) {
        var currentStartDate = targetDiv.querySelector("div.start-date");
        var currentEndDate = targetDiv.querySelector("div.end-date");
        currentEndDate && currentEndDate.focus();
        currentStartDate && currentStartDate.focus();
      }
    }, 300);
  }
  _doubleClick(e) {}
  _pickDate(e) {
    var data = e.currentTarget.dataset;
    this.set("focusedDate", undefined);
    if (data && data.date) {
      var day = data.date;
      var month = data.month;
      var year = data.year;
      if (day && month && year) {
        var pickedDate = new Date(Date.UTC(year, month, day));
        if (this.value.startDate && this.value.endDate) {
          this.set("value", {
            startDate: pickedDate,
            endDate: null,
          });
          this.fire("selection-changed", this.getDetails(this.value.startDate));
        } else if (this.value.startDate && this.value.startDate < pickedDate && !this._isDateDisabled(this.value.startDate)) {
          this.set("value", {
            startDate: this.value.startDate,
            endDate: pickedDate,
          });
          this.fire("selection-changed", this.getDetails(this.value.endDate));
        } else {
          this.set("value", {
            startDate: pickedDate,
            endDate: null,
          });
          this.fire("selection-changed", this.getDetails(this.value.startDate));
        }
      }
    }
  }

  /**
   * Checks if the input date is diabled based on
   * 'min','max' and 'disabledDays' list.
   * @param {number} dateValue
   * @return {boolean} true if date is disabled.
   */
  _isDateDisabled(dateValue) {
    var disabled = false;
    var date = new Date(dateValue);
    if (!disabled && this.min) {
      disabled = dateValue < this.min;
    }
    if (!disabled && this.max) {
      disabled = dateValue > this.max;
    }
    if (!disabled && this.disabledDays) {
      disabled = (this.disabledDays.indexOf(date.getUTCDay()) >= 0);
  }
    return disabled;
  }
  _getDateClass(day, month, selected) {
    var retClass = "";
    var date = new Date(Date.UTC(month.year, month.number, day.n));
    var startUTC =
      selected.startDate &&
      Date.UTC(
        selected.startDate.getUTCFullYear(),
        selected.startDate.getUTCMonth(),
        selected.startDate.getUTCDate()
      );

    var endUTC =
      selected.endDate &&
      Date.UTC(
        selected.endDate.getUTCFullYear(),
        selected.endDate.getUTCMonth(),
        selected.endDate.getUTCDate()
      );

    if (
      selected.startDate &&
      selected.startDate.getUTCDate &&
      day.n == selected.startDate.getUTCDate() &&
      month.number == selected.startDate.getUTCMonth() &&
      month.year == selected.startDate.getUTCFullYear()
    ) {
      retClass += " start-date";
    } else if (
      selected.endDate &&
      selected.endDate.getUTCDate &&
      day.n == selected.endDate.getUTCDate() &&
      month.number == selected.endDate.getUTCMonth() &&
      month.year == selected.endDate.getUTCFullYear()
    ) {
      retClass += " end-date";
    } else if (
      selected.endDate &&
      date.getTime() > startUTC &&
      date.getTime() < endUTC
    ) {
      retClass += " range-date";
    }
    if (day.disabled) {
      retClass += " disabled";
    }

    return retClass;
  }
  /**
   * Renders the current month's days
   */
  _renderCurrentMonth() {
    this.prepareMonth(this._activeMonth, this._activeYear);
  }
}

window.customElements.define(OeDateRangePicker.is, OeDateRangePicker);
