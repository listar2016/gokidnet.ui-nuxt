<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col s12 m4">
        <div class="card">
          <div class="card-content">
            <div class="center-align m-t-30">
              <Photo
                :value="student"
                prop-name="photo"
                :url="'/student_students/'+this.$route.params.id+'/'"
              />
              <h4 class="card-title m-t-10">{{student.first_name}} {{student.last_name}}</h4>
              <h6 class="card-subtitle">{{student.first_name_ar}} {{student.last_name_ar}}</h6>
            </div>
          </div>
          <hr />
          <div class="card-content">
            <small>{{ $t('billings.room_group') }}</small>
            <h6>{{student.room?student.room.name: $t('noInfo') }}</h6>
            <small>{{ $t('status') }}</small>
            <h6>{{student.status}}</h6>
            <small>{{ $t('mealPlan') }}</small>
            <h6>{{student.meal_plan}}</h6>
            <small>{{ $t('studentId') }}</small>
            <h6>{{student.id}}</h6>
            <small>{{ $t('profileCreated') }}</small>
            <h6></h6>
          </div>
        </div>
      </div>
      <div class="col s12 m8">
        <div class="card">
          <div class="row">
            <div class="col s12">
              <ul class="tabs">
                <li class="tab col s4">
                  <a class="active" href="#timeline">{{ $t('profile') }}</a>
                </li>
                <li class="tab col s4">
                  <a href="#profile">{{ $t('dailyActivity') }}</a>
                </li>
                <li class="tab col s4">
                  <a href="#settings">{{ $t('learning') }}</a>
                </li>
              </ul>
            </div>
            <div id="timeline" class="col s12 active">
              <div class="card-content">
                <div class="row">
                  <div class="col m3 b-r">
                    <Select
                      :value="student"
                      :error.sync="error"
                      :name="$t('billings.room_group')"
                      prop-name="room"
                      :reduce="room => room.id"
                      :options="rooms"
                    />
                  </div>
                  <div class="col m3 b-r">
                    <Select
                      :value="student"
                      :error.sync="error"
                      :name="$t('status')"
                      prop-name="status"
                      :reduce="item => item.code"
                      :options="statuses"
                    />
                  </div>
                  <div class="col m3 b-r">
                    <Select
                      :value="student"
                      :error.sync="error"
                      :name="$t('mealPlan')"
                      prop-name="meal_plan"
                      :reduce="item => item.code"
                      :options="meal_plans"
                    />
                  </div>
                  <div class="col m3">
                    <Date
                      :value="student"
                      :error.sync="error"
                      :name="$t('birthday')"
                      prop-name="birthday"
                    />
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col m12">
                    <div class="card">
                      <div class="card-content">
                        <h5 class="card-title">{{ $t('personalDetails') }}</h5>
                        <div class="row">
                          <Input
                            :value="student"
                            :error.sync="error"
                            :name="$t('firstName')"
                            prop-name="first_name"
                          />
                          <Input
                            :value="student"
                            :error.sync="error"
                            :name="$t('lastName')"
                            prop-name="last_name"
                          />
                          <Input
                            :value="student"
                            :error.sync="error"
                            :name="$t('firstNameArabic')"
                            prop-name="first_name_ar"
                          />
                          <Input
                            :value="student"
                            :error.sync="error"
                            :name="$t('lastNameArabic')"
                            prop-name="last_name_ar"
                          />
                          <Select
                            :value="student"
                            :error.sync="error"
                            :name="$t('gender')"
                            prop-name="gender"
                            :reduce="item => item.code"
                            :options="genders"
                          />
                          <Select
                            :value="student"
                            :error.sync="error"
                            :name="$t('nationality')"
                            prop-name="nationality"
                            :options="nationalities"
                            label="title"
                          />
                          <Textarea
                            :value="student"
                            :error.sync="error"
                            :name="$t('billings.notes')"
                            prop-name="notes"
                          />
                        </div>
                        <div class="row right-align">
                          <a
                            @click="save"
                            class="waves-effect waves-light btn btn-round btn-large green"
                          >{{ $t('save') }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col m12">
                    <div class="card">
                      <div class="card-content">
                        <h5 class="card-title">{{ $t('addressDetails') }}</h5>
                        <div class="row">
                           <Select
                            :value="student"
                            :error.sync="error"
                            :name="$t('governorate')"
                            prop-name="governorate"
                            :options="governorates"
                            label="title"
                          />
                          <div class="row">
                            <div class="col s6">
                              <Input
                                :value="student"
                                :error.sync="error"
                                :name="$t('address_1')"
                                prop-name="street1"
                              />
                            </div>

                            <div class="col s6">
                              <Input
                                :value="student"
                                :error.sync="error"
                                :name="$t('address_1_arabic')"
                                prop-name="street1_ar"
                              />
                            </div>
                          </div>

                          <div class="row">
                            <div class="col s6">
                              <Input
                                :value="student"
                                :error.sync="error"
                                :name="$t('address_2')"
                                prop-name="street2"
                              />
                            </div>

                            <div class="col s6">
                              <Input
                                :value="student"
                                :error.sync="error"
                                :name="$t('address_2_arabic')"
                                prop-name="street2_ar"
                              />
                            </div>
                          </div>
                          <div class="row">
                            <div class="col s6">
                              <Select
                                :value="student"
                                :error.sync="error"
                                :name="$t('area')"
                                prop-name="area"
                                :options="areas"
                                label="title"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row right-align">
                          <a
                            @click="save"
                            class="waves-effect waves-light btn btn-round btn-large green"
                          >{{ $t('save') }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col m12">
                    <div class="card">
                      <div class="card-content">
                        <h5 class="card-title">{{ $t('medical.medicalAlerts') }}</h5>
                        <div class="row">
                          <medical-alerts v-if="$route.params.id" :id="$route.params.id" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col m12">
                    <div class="card">
                      <div class="card-content">
                        <h5 class="card-title">{{ $t('contacts') }}</h5>
                        <div class="row">
                          <Contacts v-if="$route.params.id" :id="$route.params.id" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="profile" class="col s12 active" style="display: none;">
              <div class="card-content">
                <Activity :activities="activities"/>
              </div>
            </div>
            <div id="settings" class="col s12 active" style="display: none;">
              <div class="card-content">
                <h2 class="center">{{ $t('comingSoon') }}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      class="thumbnail-popup"
      width="750"
      style="width: 750px; height: 450px;"
      :key="dialog"
    >
      <v-carousel>
        <v-carousel-item v-for="thumb in thumbnails" :key="thumb.id" class="act-img__cnt">
          <img
            class="responsive-img"
            alt="user"
            :src="thumb.url"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </v-carousel-item>
      </v-carousel>
    </v-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import Input from "~/components/ui/input";
import Textarea from "~/components/ui/textarea";
import Select from "~/components/ui/select";
import Photo from "~/components/ui/photo";
import Date from "~/components/ui/date";
import MedicalAlerts from "~/components/medical-alerts";
import Contacts from "~/components/contacts";
import Activity from '~/components/rooms/activity'

export default {
  components: { Input, Textarea, Select, Photo, Date, MedicalAlerts, Contacts, Activity },
  async asyncData(context) {
    let student = await context.app.$http
      .get("/student_students/" + context.params.id)
      .then(response => {
        let data = response.data;
        return data;
      });
    let nationalities = await context.app.$http
      .get("/reference_nationalities/")
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let rooms = await context.app.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let statuses = await context.app.$http
      .get("/student_students/statuses/")
      .then(response => {
        let data = response.data.choices;
        return data;
      });
    let meal_plans = await context.app.$http
      .get("/student_students/meal_plans/")
      .then(response => {
        let data = response.data.choices;
        return data;
      });
    let governorates = await context.app.$http
      .get("/reference_governorates/")
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let activities = await context.app.$http
      .get("/activity_logs/", { params: { students: context.params.id } })
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let genders = [
      {
        code: "MALE",
        name: "Male"
      },
      {
        code: "FEMALE",
        name: "Female"
      }
    ];
    return {
      student: student,
      nationalities: nationalities,
      rooms: rooms,
      statuses: statuses,
      meal_plans: meal_plans,
      //cities: cities,
      governorates: governorates,
      genders: genders,
      activities: activities
    };
  },
  data() {
    return {
      error: {},
      categories: [],
      areas: [],
      thumbnails: [],
      dialog: false
    };
  },
  watch: {
    governorate() {
      this.refreshAreas();
    }
  },
  mounted() {
    this.refreshAreas();
    Vue.unloadScript("/assets/js/custom.min.js");
    Vue.loadScript("/assets/js/custom.min.js");
  },
  methods: {
    save() {
      this.$http
        .put("/student_students/" + this.$route.params.id + "/", this.student)
        .then(data => {
          this.$toast.global.success();
          this.error = false;
          // this.$router.push('/' + this.$i18n.locale + '/students')
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
          console.log(e);
        });
    },
    refreshAreas() {
      if (!this.student.governorate) return;

      let governorate = this.student.governorate.id
        ? this.student.governorate.id
        : this.student.governorate;

      this.areas = [];
      this.$http
        .get("reference_areas/", {
          params: { page_size: 10000, governorate: governorate }
        })
        .then(response => {
          this.areas = response.data.results;
        });
    },
    showThumb(photos) {
      // console.log(photos)
      this.thumbnails = photos;
      this.dialog = true;
    }
  },
  computed: {
    governorate() {
      return this.student.governorate;
    }
  }
};
</script>

<style scoped>
@import "static/assets/css/pages/timeline-vertical-horizontal.css";
</style>
<style>
.student-detialsbox .student-right {
  float: right;
  width: 30%;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 8px;
  background: #7daf52;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.timeline > li > .timeline-panel {
  width: 48% !important;
  padding: 15px !important;
  margin-left: -18px !important;
}
.timeline > li > .timeline-panel[data-v-517a297e]:before {
  content: " ";
  display: inline-block;
  position: absolute;
  top: 26px;
  right: -8px;
  border-top: 8px solid transparent;
  border-right: 0 solid rgba(120, 130, 140, 0.13);
  border-bottom: 8px solid transparent;
  border-left: 8px solid rgba(120, 130, 140, 0.13);
}
.student-detialsbox {
  width: 100%;
  float: left;
}
.timeline > li[data-v-517a297e] {
  position: relative;
  margin-bottom: 20px;
}
.timeline > li > .timeline-panel[data-v-517a297e] {
  float: left;
  position: relative;
  width: 46%;
  padding: 20px;
  border: 1px solid rgba(120, 130, 140, 0.13);
  border-radius: 3px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}
.timeline > li > .timeline-panel {
  width: 48% !important;
  padding: 15px !important;
  margin-left: -18px !important;
  margin-right: -15px;
}
.student-detialsbox .activity-left {
  float: left;
  width: 70%;
}
.student-detialsbox .activity-left h3 {
  font-size: 16px;
  color: #000;
  margin-bottom: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.activity-left .ditailbox {
  float: left;
  width: 100%;
}
.activity-left h3 figure {
  width: 30px;
  height: 30px;
  border-radius: 100px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin: 0 10px 0 0;
}
.activity-left h3 figure img {
  width: 30px;
  height: 30px;
}
.ditailbox .user-name {
  font-size: 14px;
  color: #000;
}
ul.gellry-imgbox {
  float: left;
  width: 100%;
  margin-top: 15px;
}
.student-detialsbox .student-right figure {
  width: 50px;
  margin: 8px auto 20px;
  height: 50px;
  border-radius: 100%;
  overflow: hidden;
}
.student-detialsbox .student-right figure img {
  width: 50px;
  height: 50px;
}
.student-detialsbox .student-right h4 {
  font-size: 16px;
  text-align: center;
  color: #fff;
  line-height: 20px;
  font-weight: 600;
}
.timeline > li > .timeline-badge[data-v-517a297e] {
  z-index: 10;
  position: absolute;
  top: 16px;
  left: 50%;
  width: 50px;
  height: 50px;
  margin-left: -25px;
  border-radius: 50% 50% 50% 50%;
  text-align: center;
  font-size: 1.4em;
  line-height: 50px;
  color: #fff;
  overflow: hidden;
}
.timeline-badge.success[data-v-517a297e] {
  background-color: #2dce89;
}
.timeline[data-v-517a297e]:before {
  content: " ";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  margin-left: -1.5px;
  background-color: #e9ecef;
}
.card .card-content {
  padding: 24px;
  border-radius: 0 0 8px 22px;
  padding: 22px 27px 25px 45px;
  border-radius: 0 0 2px 2px;
}
ul.gellry-imgbox li {
  width: 33%;
  display: inline-block;
  margin: 0 -2px;
}
ul.gellry-imgbox li img {
  width: 100%;
  height: 74px;
  padding: 5px;
}
</style>
