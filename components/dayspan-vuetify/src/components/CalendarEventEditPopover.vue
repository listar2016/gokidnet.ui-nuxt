<template>
  <v-card>
    <v-card-title>
      <span class="headline">Добавить</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <div class="row" @keyup.enter="save" v-if="calendar.placeholderForCreate===true || true">
          <Select
            class="col m12"
            :value="newItem"
            :error.sync="error"
            name="Спортсмен"
            :reduce="item => item.athleteId"
            label="name"
            prop-name="athleteId"
            :options="athletes"
          />
          <MyInput :value="newItem" :error.sync="error" name="Заголовок" prop-name="title" />
          <div class="row">
            <div class="col s6">
              <MyDate
                v-if="test"
                :value="newItem"
                :error.sync="error"
                name="Дата начала"
                prop-name="startDate"
                ref="test"
              />
            </div>
            <div class="col s6">
              <MyTime
                v-if="test"
                :value="newItem"
                :error.sync="error"
                name="Время начала"
                prop-name="startTime"
              />
            </div>
          </div>
          <div class="row">
            <div class="col s6">
              <MyDate
                v-if="test"
                :value="newItem"
                :error.sync="error"
                name="Дата окончания"
                prop-name="endDate"
              />
            </div>
            <div class="col s6">
              <MyTime
                v-if="test"
                :value="newItem"
                :error.sync="error"
                name="Время окончания"
                prop-name="endTime"
              />
            </div>
          </div>
          <div class="col s12">
            Тип
            <br />
            <label>
              <input value="Event" name="type" type="radio" v-model="newItem.type" />
              <span>Событие</span>
            </label>
            <label>
              <input value="Measuring" name="type" type="radio" v-model="newItem.type" />
              <span>Замер</span>
            </label>
            <label>
              <input value="Competition" name="type" type="radio" v-model="newItem.type" />
              <span>Соревнование</span>
            </label>
          </div>
        </div>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
      <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { CalendarEvent, Calendar, Pattern, Functions as fn } from 'dayspan';
import MyInput from '~/components/ui/input';
import MyTime from '~/components/ui/time';
import MyDate from '~/components/ui/date';
import Select from '~/components/ui/select';


export default {
  name: 'dsCalendarEventEditPopover',
  components: { MyInput, MyTime, MyDate, Select },
  props:
  {
    calendarEvent:
    {
      required: false,
      type: CalendarEvent
    },

    calendar:
    {
      required: false,
      type: Calendar
    },

    close:
    {
      type: Function
    },

    formats:
    {
      validate(x) {
        return this.$dsValidate(x, 'formats');
      },
      default() {
        return this.$dsDefaults().formats;
      }
    },

    icons:
    {
      validate(x) {
        return this.$dsValidate(x, 'icons');
      },
      default() {
        return this.$dsDefaults().icons;
      }
    },

    labels:
    {
      validate(x) {
        return this.$dsValidate(x, 'labels');
      },
      default() {
        return this.$dsDefaults().labels;
      }
    },

    prompts:
    {
      validate(x) {
        return this.$dsValidate(x, 'prompts');
      },
      default() {
        return this.$dsDefaults().prompts;
      }
    },

    busyOptions:
    {
      type: Array,
      default() {
        return this.$dsDefaults().busyOptions;
      }
    },

    placeholderForCreate: {},
    error: {},
    athletes: {
      type: Array,
      default: []
    }
  },

  computed:
  {
    slotData()
    {
      return {
        // calendarEvent: this.calendarEvent,
        // calendar: this.calendar,
        close: this.close,
        details: this.details
      };
    },

    classes()
    {
      return {
        'ds-event-cancelled': this.calendarEvent.cancelled
      };
    },

    styleHeader()
    {
      return {
        backgroundColor: this.details.color,
        color: this.details.forecolor
      };
    },

    styleText()
    {
      return {
        color: this.details.forecolor
      };
    },

    startDate()
    {
      return this.calendarEvent.start.format( this.formats.start );
    },

    busyness()
    {
      return this.details.busy ? this.labels.busy : this.labels.free;
    },

    isValid()
    {
      return this.$dayspan.isValidEvent(
        this.details,
        this.calendarEvent.schedule,
        this.calendarEvent
      );
    },

    occurs()
    {
      return this.$dayspan.getEventOccurrence(
        this.calendarEvent.schedule,
        this.calendarEvent.start,
        this.labels,
        this.formats
      );
    }
  },

  data: vm => ({
    details: vm.buildDetails(),
    newItem: {
      eventType: "creating",
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      athleteId: null,
      title: null,
      type: "Event"
    },
    test: false,
    oldInterval: null
  }),

  computed: {
    dateChanged() {
      return this.calendarEvent.start.time + this.calendarEvent.end.time
    }
  },

  watch: {
    dateChanged() {
      this.kostil()
    }
  },

  mounted() {
    this.kostil()
  },

  methods:
  {
    kostil() {
      this.test = false
      let startDate = new Date(this.calendarEvent.start.time + 5*3600000).toISOString()
      let endDate = new Date(this.calendarEvent.end.time + 5*3600000).toISOString()
      let startTime = startDate.substr(11,5)
      let endTime = endDate.substr(11,5)
      startDate = startDate.substr(0,10)
      endDate = endDate.substr(0,10)

      this.newItem = {
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime
      }
      clearInterval(this.oldInterval)
      this.oldInterval = setTimeout(()=>{
        this.test = true
        this.$forceUpdate()
      }, 100)
    },
    edit()
    {
      var ev = this.getEvent('create-edit');

      this.$emit('create-edit', ev);

      this.finishEvent( ev );
    },

    save()
    {
      let ev = this.getEvent('creating');

      this.newItem.eventType = 'creating';

      this.$emit('creating', this.newItem);
    },

    handle() {
      // ev.created = ev.calendarEvent.event;
      // this.$dayspan.setEventDetails(
      //   ev.details,
      //   ev.created.data,
      //   ev.created,
      //   ev.calendarEvent
      // );
      // if (ev.calendar)
      // {
      //   ev.calendar.addEvent( ev.created );
      //   ev.added = true;
      // }
      // this.$emit('created', ev);
      // if (ev.calendar && ev.refresh)
      // {
      //   ev.calendar.refreshEvents();
      // }
      // ev.handled = true;
      // this.$emit('event-create', ev.created);
      this.finishEvent( {close:true} );
    },

    finishEvent(ev)
    {
      if (ev.close)
      {
        this.close();

        this.$emit('create-popover-closed', ev);
      }
    },

    buildDetails()
    {
      let details = this.$dayspan.copyEventDetails( this.calendarEvent.event.data );

      details.title = '';

      return details;
    },

    getEvent(type, extra = {})
    {
      return fn.extend({

        type: type,
        calendarEvent: this.calendarEvent,
        calendar: this.calendar,
        close: this.close,
        details: this.details,
        handled: false,
        added: false,
        refresh: true,
        close: true,
        $vm: this,
        $element: this.$el

      }, extra);
    }
  }
}
</script>

<style scoped lang="scss">

.v-btn--floating.v-btn--left {
  margin-left: 0px !important;

  .v-icon {
    height: auto;
  }
}

.ds-calendar-event-popover-card {

  .v-toolbar__extension {
    padding: 0 16px !important;
    height: 60px !important;
    align-items: start;

    .v-toolbar__title {
      width: 100%;
      margin-left: 0;
      margin-right: 0px;

      .v-input__slot {
        background-color: rgba(255,255,255,0.2) !important;

        input {
          caret-color: rgba(0,0,0,.87) !important;
        }
      }
    }
  }
}

.v-text-field--full-width {
  width: 100%;
}

.v-card__text {
  padding: 16px 0;

  .v-list {
    padding-bottom: 0px;

    > div:first-child {
      margin-bottom: 1em;
    }

    .v-list__tile {
      height: auto !important;
    }
  }
}

.ds-create-popover-save {
  background-color: transparent !important;
}

.ds-color-option {
  width: 100%;
  color: white;
  padding: 4px;
}

.v-input {
  margin-bottom: 8px !important;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.centered {
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
}
input[type="search"] {
  border: none !important;
  height: auto !important;
  width: auto !important;
  margin: 0 !important;
  font-size: 1em !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
.v-select.valid .vs__dropdown-toggle {
  border-bottom: 2px solid rgb(76, 175, 80);
  padding: 10px 0 11px;
  width: 100%;
}
.v-select.invalid .vs__dropdown-toggle {
  border-bottom: 2px solid rgb(244, 67, 54);
}
.collapsible-body li + li a {
  border-top: 1px solid #ccc;
}
.collapsible-body li a.nuxt-link-exact-active {
  border-left: 3px solid #14d8e2;
  color: #14d8e2;
}
button.vs__clear {
  display: none;
}
.vs__dropdown-option--highlight {
  background: #ebebeb !important;
  color: #5e35b1 !important;
}
.vs__dropdown-option {
  line-height: 1.42857143;
  clear: both;
  white-space: nowrap;
  font-size: 16px !important;
  color: #5e35b1 !important;
  display: block;
  line-height: 22px !important;
  padding: 14px 16px !important;
  cursor: pointer;
}
.vs__dropdown-option:hover {
  background-color: #ebebeb;
}
span.vs__selected {
  position: absolute;
  margin: 0;
}
.vs--searchable .vs__dropdown-toggle {
  cursor: text;
  margin-bottom: 2rem;
  border: transparent;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0px;
  padding: 0.3em 0;
}
.vs--open .vs__dropdown-toggle,
.vs--searchable .vs__dropdown-toggle:focus {
  border-bottom: 1px solid #5e35b1;
  box-shadow: 0 1px 0 0 #5e35b1;
}

.vs--searchable .vs__dropdown-toggle:placeholder:focus {
  color: #5e35b1;
}

.left-sidebar .sidenav ul > li.nuxt-link-active > .collapsible-header,
.left-sidebar .sidenav ul > li.nuxt-link-exact-active > .collapsible-header {
  background-color: #11d7e4;
  background-image: -moz-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #11d7e4),
    color-stop(100%, #48eaa1)
  );
  background-image: -webkit-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background-image: -o-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background: -ms-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background: linear-gradient(to right, #11d7e4 0%, #48eaa1 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$from', endColorstr='$to',GradientType=1 );
  border-radius: 60px;
}
#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li.nuxt-link-active
  > .collapsible-header,
#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li.nuxt-exact-link-active
  > .collapsible-header {
  color: white !important;
}
/* #main-wrapper[data-layout="vertical"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li
  a {
} */

input[type="text"]:not(.browser-default)[readonly="readonly"] {
  border-bottom: none;
}
</style>
