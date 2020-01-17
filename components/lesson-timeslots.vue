<template>
  <v-app id="dayspan" v-cloak>
    <ds-calendar-app
      ref="app"
      :calendar="calendar"
      :read-only="readOnly"
    >

      <template slot="eventPopover" slot-scope="slotData" :hasDetails="false">
        <v-card v-if="!readOnly && false">
          <v-card-title>
            <span class="headline">Изменить</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <div
                class="row"
                @keyup.enter="save"
              >
                <MyInput
                  :value.sync="slotData.details"
                  :error.sync="error"
                  name="Заголовок"
                  prop-name="title"
                />
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
            <v-btn
              color="blue darken-1"
              flat
              @click="close"
            >{{ $t('cancel') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="edit(slotData)">{{ $t('edit') }}</v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <template slot="eventCreatePopover" slot-scope="{placeholder, calendar}">
        <ds-calendar-event-create-popover
          :calendar-event="placeholder"
          :calendar="calendar"
          :details="{location: false, notify: false, calendar:false, description: false}"
          :close="$refs.app.$refs.calendar.clearPlaceholder"
          :error.sync="error"
          :lessons="lessons"
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

      <template slot="drawerBottom">
        <div class="pa-3">
          <v-checkbox label="На весь экран" v-model="fullWidth"></v-checkbox>
        </div>
      </template>
    </ds-calendar-app>
  </v-app>
</template>

<script>
import { Calendar, Weekday, Month } from "dayspan";
import MyInput from "~/components/ui/input";
import MyTime from "~/components/ui/time";
import MyDate from "~/components/ui/date";
import Select from "~/components/ui/select";
import cDate from "~/components/ui/date";
import * as moment from 'moment';
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
  },
  computed: {
    fullWidth: {
      get() {
        return false
        return this.$store.state.user.fullWidth;
      },
      set(value) {
        this.$store.commit("user/setFullWidth", value);
      }
    },
    readOnly() {
      return false
      return this.$cookies.get('role') != 'Admin'
    }
  },
  data: () => ({
    storeKey: "dayspanState",
    calendar: Calendar.weeks(),
    test: true,
    defaultEvents: [],
    isEditing: false,
    error: false,
    newItem: {
      start: null,
      end: null,
      day: null,
      lesson: null
    },
    lessons: []
  }),
  mounted() {
    window.app = this.$refs.app;
    this.getAllEvents();
  },
  methods: {
    getAllEvents() {
      this.$http
        .get("/lesson_lessons/", { params: { page_size: 50 } })
        .then(response => {
          this.lessons = response.data.results;
        })
        .catch(e => {
        });
      this.loadState();
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
      if (event.eventType == "creating") {
        if(!event.lesson) {
          this.error = {
            lesson: [this.$t('pleaseSelect')]
          }
          return;
        }
        this.error = false
        this.defaultEvents.push(this.transformEvent(event));
        this.$emit('new-slot', event)
        this.loadState();
        this.$refs.okhandler.handle();
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
      }
      this.$http.put('/schedule/' + schedule.id, schedule).then((response) => {
        if(response.data.status == "Success") {
            this.$toast.global.success();
            this.getAllEvents()
        }
      })
    },
    save(item) {
      this.isEditing = false;
    },
    // eventUpdate (event) {
    //   this.edit(event.data)
    // },
    transformEvent(event) {
      var startTime = moment(event.start, "HH:mm");
      var endTime = moment(event.end, "HH:mm");
      var duration = moment.duration(endTime.diff(startTime));

      let days = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6
      }
      return {
        data: {
          details: event,
          title: this.lessons.filter(lesson => lesson.id == event.lesson)[0].title,
          ...event
        },
        schedule: {
          dayOfWeek: [days[event.day]],
          times: [event.start],
          duration: duration.asMinutes(),
          durationUnit: this.$t('lessons.minutes')
        }
      };
    },
    close() {
      $('.v-menu__activator--active').click()
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
.v-toolbar--fixed {
  position: absolute !important;
}
.page-wrapper {
  min-height: calc(100vh - 132px) !important;
}
.application--wrap {
  min-height: calc(100vh - 132px) !important;
}
main.v-content.ds-expand {
  padding-left: 0!important;
  padding-top: 0!important;
}
aside.v-navigation-drawer, .ds-app-calendar-toolbar.v-toolbar, .ds-week-date {
  display: none;
}
.ds-week-weekday {
  font-size: 30px;
}
</style>