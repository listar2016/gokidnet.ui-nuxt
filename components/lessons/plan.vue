<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s12 m3 left left-align">
              <a class="btn waves-effect waves-light green" @click="save">{{ $t('save') }}</a>
            </div>
            <div class="col s12 m3 right right-align">
              <Select
                :value="plan"
                :error.sync="error"
                :name="$t('status')"
                prop-name="status"
                :reduce="status => status.code"
                :options="statuses"
              />
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col m2 s6">
              <form class="m-t-3">
                <Input :value="plan" :error.sync="error" :name="$t('lessons.planTitle')" prop-name="title" />
              </form>
            </div>
            <div class="col m2 s6">
              <form class="m-t-3">
                <Date :value="plan" :error.sync="error" :name="$t('lessons.activeFrom')" prop-name="active_from" />
              </form>
            </div>
            <div class="col m2 s6">
              <form class="m-t-3">
                <Date :value="plan" :error.sync="error" :name="$t('lessons.expiresOn')" prop-name="active_to" />
              </form>
            </div>
            <div class="col m6 s6">
              <Select
                :value="plan"
                :error.sync="error"
                :name="$t('billings.rooms_groups')"
                prop-name="rooms"
                :reduce="room => {return {id: room.id}}"
                :options="rooms"
                :multiple="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="col s12">
        <div class="card">
            <div class="card-content">
              <LessonTimeslots @new-slot="newSlot" />
            </div>
        </div>
    </div>-->
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="calendar-header">
            <div
              v-for="day in [$t('weeks.monday'), $t('weeks.tuesday'), $t('weeks.wednesday'),$t('weeks.thursday'), $t('weeks.friday'), $t('weeks.saturday'), $t('weeks.sunday')]"
              :key="day"
            >{{ day }}</div>
          </div>
          <div class="calendar-hour" v-for="hour in hours15" :key="hour">
            <span>{{ hour }}</span>
            <div
              v-for="day in [$t('weeks.monday'), $t('weeks.tuesday'), $t('weeks.wednesday'),$t('weeks.thursday'), $t('weeks.friday'), $t('weeks.saturday'), $t('weeks.sunday')]"
              :key="day"
              @click="add(day, hour)"
            >
              <span
                @click.stop="editItem(slot)"
                v-for="slot in plan.timeslots.filter(item => item.day == day && item.start == hour)"
                :key="`${slot.start}${slot.day}${slot.lesson.id}`"
                :style="{height: height(slot)}"
              >{{ slot.lesson.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="height: 100%">
      <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
        <v-card>
          <v-card-title>
            <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit') }}</span>
          </v-card-title>
          <v-card-text>
            <!-- <v-container grid-list-md> -->
            <div class="row">
              <!-- <Select
                class="col m12 rel"
                :value="newTimeslot"
                :error.sync="error"
                name="Lesson"
                label="title"
                prop-name="lesson"
                :reduce="a => a"
                :options="lessons"
              />-->
              <v-select
                class="col m12 rel"
                v-model="newTimeslot.lesson"
                name="Lesson"
                :label="$t('title')"
                item-text="title"
                :return-object="true"
                :items="lessons"
              />
              {{ $t('lessons.startTime') }}: {{ newTimeslot.start }}
              <br />
              {{ $t('duration') }}: {{ duration }}
            </div>
            <!-- </v-container> -->
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">{{ $t('cancel') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="removeLesson">{{ $t('delete') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="saveSlot">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import Select from "~/components/ui/select";
import Date from "~/components/ui/date";

import * as moment from "moment";

export default {
  props: {
    rooms: { type: Array, default: [] },
    statuses: { type: Array, default: [] },
    lessons: { type: Array, default: [] },
    plan: {
      type: Object,
      default() {
        return {
          title: "",
          active_from: null,
          active_to: null,
          rooms: [],
          timeslots: [],
          status: null
        };
      }
    },
    method: { default: "post" },
    url: { default: "/lesson_plans/" }
  },
  components: {
    Input,
    Select,
    Date
  },
  data() {
    return {
      newTimeslot: {
        start: "",
        end: "",
        day: "",
        lesson: null
      },
      emptyTimeslot: {
        start: "",
        end: "",
        day: "",
        lesson: null
      },
      editedIndex: -1,
      dialog: false,
      error: false
    };
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.plan.timeslots.indexOf(item);
      this.newTimeslot = Object.assign({}, item);
      this.dialog = true;
    },
    removeLesson() {
      this.plan.timeslots.splice(this.editedIndex, 1);
      this.close();
      this.$toast.global.success();
    },
    add(day, hour) {
      let days = {
        Mon: this.$t('weeks.monday'),
        Tue: this.$t('weeks.tuesday'),
        Wed: this.$t('weeks.wednesday'),
        Thu: this.$t('weeks.thursday'),
        Fri: this.$t('weeks.friday'),
        Sat: this.$t('weeks.saturday'),
        Sun: this.$t('weeks.sunday')
      };
      this.newTimeslot.day = day; //days[day]
      this.newTimeslot.start = hour;
      this.editedIndex = -1;
      this.dialog = true;
    },
    save() {
      this.$http[this.method](this.url, this.plan)
        .then(response => {
          this.$toast.global.success();
          this.error = false;
          this.$router.go(-1);
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    },
    close() {
      this.dialog = false;
      this.newTimeslot = Object.assign({}, this.emptyTimeslot);
      this.editedIndex = -1;
    },
    saveSlot() {
      this.newTimeslot.end = moment(this.newTimeslot.start, "HH:mm")
        .add(this.duration, this.$t('lessons.minutes'))
        .format("HH:mm");

      if (this.editedIndex == -1) {
        this.plan.timeslots.push(this.newTimeslot);
      } else {
        this.plan.timeslots.splice(this.editedIndex, 1, this.newTimeslot);
      }

      this.close();
    },

    height(slot) {
      let start = moment(slot.start, "HH:mm");
      let end = moment(slot.end, "HH:mm");

      let count = moment.duration(end.diff(start)).asMinutes() / 15;

      return 31 * count + "px";
    }
  },
  computed: {
    hours15() {
      let hours = [
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23"
      ];
      let minutes = ["00", "15", "30", "45"];
      let res = [];

      for (let i = 0; i < hours.length; i++) {
        for (let j = 0; j < minutes.length; j++) {
          res.push(hours[i] + ":" + minutes[j]);
        }
      }
      res.push("23:59");

      return res;
    },
    duration() {
      // let tmp = this.lessons.filter(
      //   item => item.id == this.newTimeslot.lesson.id
      // )[0];
      if (this.newTimeslot.lesson)
        return this.newTimeslot.lesson.duration_start;
      return 0;
    }
  }
};
</script>
<style scoped>
.calendar-header {
  display: flex;
}
.calendar-header > div {
  width: calc(14.28% - 6px);
  font-size: 30px;
  color: black;
  padding-left: 8px;
  border-right: #e0e0e0 1px solid;
  border-bottom: #e0e0e0 1px solid;
}
.calendar-header > div:first-child {
  margin-left: 42px;
}
.calendar-hour {
  width: 100%;
  display: flex;
}
.calendar-hour > span {
  width: 41px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-hour {
  border-bottom: #e0e0e0 1px solid;
}

.calendar-hour > div {
  width: calc(14.28% - 6px);
  border-left: #e0e0e0 1px solid;
  height: 30px;
  position: relative;
}
.calendar-hour > div > span {
  width: 100%;
  position: absolute;
  z-index: 138;
  background: greenyellow;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
}
.calendar-hour > div:last-child {
  border-right: #e0e0e0 1px solid;
}

.v-select >>> * {
  margin-bottom: 0 !important;
}
</style>