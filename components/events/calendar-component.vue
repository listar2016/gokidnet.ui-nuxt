<template>
  <v-app id="dayspan" v-cloak>
    <ds-calendar-app ref="app" :calendar="calendar" :read-only="readOnly" :athletes="athletes">
      <template slot="title">{{ $t('calendar') }}</template>

      <template slot="eventPopover" slot-scope="slotData" :hasDetails="false">
        <v-card v-if="!readOnly">
          <v-card-title>
            <span class="headline">{{ $t('edit') }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <div class="row" @keyup.enter="save">
                <Select
                  class="col m12"
                  :value.sync="slotData.details"
                  :error.sync="error"
                  name="Спортсмен"
                  :reduce="item => item.athleteId"
                  label="name"
                  prop-name="athleteId"
                  :options="athletes"
                />
                <MyInput
                  :value.sync="slotData.details"
                  :error.sync="error"
                  name="Заголовок"
                  prop-name="title"
                />
                {{slotData.calendarEvent.id}}
                <div class="row">
                  <div class="col s6">
                    <MyDate
                      v-if="test"
                      :value.sync="slotData.details"
                      :error.sync="error"
                      name="Дата начала"
                      prop-name="startDate"
                      :defaultTimestamp="slotData.calendarEvent.start.date"
                      ref="test"
                    />
                  </div>
                  <div class="col s6">
                    <MyTime
                      v-if="test"
                      :value.sync="slotData.details"
                      :error.sync="error"
                      :defaultTimestamp="slotData.calendarEvent.start.date"
                      name="Время начала"
                      prop-name="startTime"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col s6">
                    <MyDate
                      v-if="test"
                      :value="slotData.details"
                      :error.sync="error"
                      :defaultTimestamp="slotData.calendarEvent.end.date"
                      name="Дата окончания"
                      prop-name="endDate"
                    />
                  </div>
                  <div class="col s6">
                    <MyTime
                      v-if="test"
                      :value="slotData.details"
                      :error.sync="error"
                      :defaultTimestamp="slotData.calendarEvent.end.date"
                      name="Время окончания"
                      prop-name="endTime"
                    />
                  </div>
                </div>
                <div class="col s12">
                  Тип
                  <br />
                  <v-radio-group v-model="slotData.details.type" :mandatory="false" row>
                    <v-radio label="Событие" value="Event"></v-radio>
                    <v-radio label="Замер" value="Measuring"></v-radio>
                    <v-radio label="Соревнование" value="Competition"></v-radio>
                  </v-radio-group>
                </div>
              </div>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="edit(slotData)">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template slot="eventCreatePopover" slot-scope="{placeholder, calendar}">
        <ds-calendar-event-create-popover
          :calendar-event="placeholder"
          :calendar="calendar"
          :rooms="rooms"
          :details="{location: false, notify: false, calendar:false, description: false}"
          :close="$refs.app.$refs.calendar.clearPlaceholder"
          :athletes="athletes"
          :error="error"
          @create-edit="$refs.app.editPlaceholder"
          @creating="saveState"
          ref="okhandler"
        ></ds-calendar-event-create-popover>
      </template>

      <template slot="eventTimeTitle" slot-scope="{calendarEvent, details}">
        <div>
          <v-icon
            class="ds-ev-icon"
            v-if="details.icon"
            size="14"
            :style="{color: details.forecolor}"
          >{{ details.icon }}</v-icon>
          <strong class="ds-ev-title">{{ details.title }}</strong>
        </div>
        <div class="ds-ev-description">{{ getCalendarTime( calendarEvent ) }}</div>
      </template>
    </ds-calendar-app>
  </v-app>
</template>

<script>
import { Calendar } from "dayspan";
import MyInput from "~/components/ui/input";
import MyTime from "~/components/ui/time";
import MyDate from "~/components/ui/date";
import Select from "~/components/ui/select";
import cDate from "~/components/ui/date";
import Vue from "vue";
export default {
  layout: "default",
  components: {
    cDate,
    MyInput,
    MyTime,
    MyDate,
    Select
  },

  watch: {
    athlete() {
      this.getAllEvents();
    },
    calendar() {
      console.log("calendar", calendar);
      this.$emit("sync", this.calendar);
    }
  },
  computed: {
    otherAthletes() {
      return this.athletes.map(el => {
        if (el.athleteId != this.athlete.athleteId) return el;
      });
    },
    fullWidth: {
      get() {
        return this.$store.state.user.fullWidth;
      },
      set(value) {
        this.$store.commit("user/setFullWidth", value);
      }
    },
    readOnly() {
      return false;
    }
  },
  data: () => ({
    athletes: [],
    rooms: [],
    storeKey: "dayspanState",
    calendar: Calendar.months(),
    test: true,
    defaultEvents: [],
    athlete: null,
    isEditing: false,
    error: false,
    athleteToCopy: null,
    selectedEvents: [],
    newItem: {
      startDate: null,
      endDate: null,
      startTime: null,
      endTime: null,
      title: null,
      type: "Event"
    }
  }),
  mounted() {
    this.$http.get("/room_rooms/").then(response => {
      this.rooms = response.data.results;
    });
    window.app = this.$refs.app;
    // this.$root.$on('calendar-day-event-context-menu-event', this.selectEvent)
    this.getAllEvents();
  },
  methods: {
    copy() {
      var data = {
        athleteId: this.athleteToCopy,
        schedules: this.selectedEvents.map(el => {
          return el.id;
        })
      };
      this.$http.post("/schedule/copy", data).then(data => {
        this.$toast.global.success("События успешно скопированны");
        // this.selectedEvents = []
        this.athleteToCopy = null;
      });
    },
    removeSelectedEvents() {
      this.selectedEvents = [];
    },
    selectEvent(e) {
      // return ;
      if (this.$cookies.get("role") != "Admin") return;
      let foundIndex = this.selectedEvents.findIndex(el => {
        return el.id == e.data.id;
      });
      if (foundIndex == -1) {
        this.selectedEvents.push(e.data);
      } else {
        this.selectedEvents.splice(foundIndex, 1);
      }
    },
    getAllEvents() {
      if (!this.athlete && this.$cookies.get("role") == "Admin") {
        return;
      }
      this.$http.get('/event_events').then(response => {
        if (response.data.results) {
          response.data.results.forEach(event => {
            this.defaultEvents.push(this.transformEvent(event));
          })
          this.loadState();
        }
      });
/*      let url =
        this.$cookies.get("role") == "Admin"
          ? "/schedule/athlete/" + this.athlete
          : "/schedule/staff";
      this.$http.get(url).then(response => {
        this.defaultEvents = response.data.data.map(event => {
          return this.transformEvent(event);
        });
        this.loadState();
      });*/
    },
    getCalendarTime(calendarEvent) {
      let sa = calendarEvent.start.format("a");
      let ea = calendarEvent.end.format("a");
      let sh = calendarEvent.start.format("h");
      let eh = calendarEvent.end.format("h");
      if (calendarEvent.start.minute !== 0) {
        sh += calendarEvent.start.format(":mm");
      }
      if (calendarEvent.end.minute !== 0) {
        eh += calendarEvent.end.format(":mm");
      }
      return sa === ea ? sh + " - " + eh + ea : sh + sa + " - " + eh + ea;
    },
    saveState(event) {
      console.log("saveState", event);
      this.error = {};
      let errors = false;
      if (!event.startDate) {
        this.error.startDate = ["Please fill this field!"];
        errors = true;
      }
      if (!event.endDate) {
        this.error.endDate = ["Please fill this field!"];
        errors = true;
      }
      if (!event.startTime) {
        this.error.startTime = ["Please fill this field!"];
        errors = true;
      }
      if (!event.endTime) {
        this.error.endTime = ["Please fill this field!"];
        errors = true;
      }
      if (errors) return;

      if (event.eventType == "creating") {
        let newItem = { ...{}, ...event };
        newItem.startDate += "T" + newItem.startTime + ":00";
        newItem.endDate += "T" + newItem.endTime + ":00";
        newItem.start_time = newItem.startDate;
        newItem.end_time = newItem.endDate;
        //запрос на добавление
        this.$http
          .post("/event_events/", newItem)
          .then(response => {
            if (response.data.id) {
              this.$toast.global.success();
              this.defaultEvents.push(this.transformEvent(response.data));
              this.loadState();
              this.error = false;
              // this.$refs.okhandler.handle();
            }
          })
          .catch(e => {
            console.log(e);
            if (e.response == "Error") {
              this.$toast.error(e.response);
              this.error = false;
            } else {
              this.error = e.response ? e.response.data.errors : false;
            }
          });
      }
    },
    loadState() {
      let state = {};
      state.events = this.defaultEvents;
      state.events.forEach(ev => {
        let defaults = this.$dayspan.getDefaultEventDetails();
        ev.data = Vue.util.extend(defaults, ev.data);
      });
      this.$refs.app.setState(state);
    },
    edit(data) {
      let schedule = {
        startDate: `${data.details.startDate}T${data.details.startTime}`,
        endDate: `${data.details.endDate}T${data.details.endTime}`,
        type: data.details.type,
        title: data.details.title,
        id: data.details.id,
        athleteId: data.details.athleteId
      };
      this.$http.put("/schedule/" + schedule.id, schedule).then(response => {
        if (response.data.status == "Success") {
          this.$toast.global.success();
          this.getAllEvents();
        }
      });
    },
    save(item) {
      this.isEditing = false;
    },
    // eventUpdate (event) {
    //   this.edit(event.data)
    // },
    transformEvent(event) {
      let colors = {
        Event: "#1e88e5",
        Measuring: "#ffa726",
        Competition: "#43a047"
      };
      var date = new Date(event.start_time);
      var endDate = new Date(event.end_time);
      let time = event.start_time.substr(11, 5);
      let duration = (endDate - date) / 60000;
      event.startTime = event.start_time.substr(11, 8);
      event.endTime = event.end_time.substr(11, 8);
      event.startDate = event.start_time.substr(0, 10);
      event.endDate = event.end_time.substr(0, 10);
      return {
        data: {
          color: event.type ? colors[event.type] : '#2196F3',
          details: event,
          ...event
        },
        schedule: {
          month: [date.getMonth()],
          dayOfMonth: [date.getDate()],
          times: [time],
          duration: duration,
          durationUnit: "minutes"
        }
      };
    },
    close() {
      $(".v-menu__activator--active").click();
    },
    athleteChange(event) {
      this.athlete = event;
    }
  }
};
</script>

<style>
.v-menu__activator {
  position: relative;
}
* {
  user-select: none;
}
.v-btn--floating.v-btn--left .v-icon {
  height: auto;
}
.v-btn__content {
  height: 36px;
}
.page-wrapper {
  position: relative !important;
}
.v-navigation-drawer--fixed {
  position: absolute !important;
}
.v-navigation-drawer--close {
  width: 0px !important;
}
.v-toolbar--fixed {
  position: absolute !important;
}
.page-wrapper {
  min-height: calc(100vh - 132px) !important;
}
.application--wrap {
  min-height: calc(100vh - 132px) !important;
}
.title {
  margin: 0px;
}
</style>
