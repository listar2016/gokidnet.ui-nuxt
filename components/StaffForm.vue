<template>
  <div>
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <div class="row">
              <div class="col s3">
                <Input :value="staff" :error.sync="error" :name="$t('mobileNumber')" prop-name="mobile" />
              </div>
              <div class="col s3">
                <Input :value="staff" :error.sync="error" :name="$t('emailAddress')" prop-name="email" />
              </div>
              <div class="col s3">
                <Select
                  :value="staff"
                  :error.sync="error"
                  :name="$t('status')"
                  prop-name="status"
                  :reduce="item => item.code"
                  :options="statuses"
                  label="name"
                />
              </div>
              <div class="col s3">
                <Select
                  :value="staff"
                  :error.sync="error"
                  :name="$t('payroll')"
                  prop-name="payroll"
                  :reduce="item => 0"
                  :options="payrolls"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s12 m8">
        <div class="row">
          <div class="col s5">
            <div class="card">
              <div class="card-content">
                <div class="row">
                  <Photo :value="staff" prop-name="photo" :url="'/staff_staffs/'+this.$route.params.id+'/'" :buttons="method != 'post'"/>
                </div>
              </div>
            </div>
          </div>
          <div class="col s7">
            <div class="card employment-card">
              <div class="card-content">
                <h2 class="card-title">{{ $t('employmentDetails') }}</h2>
                <div class="row">
                  <div class="row">
                    <div class="col s12">
                      <Input
                        :value="staff"
                        :error.sync="error"
                        :name="$t('billings.notes')"
                        prop-name="employment_notes"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card col s12">
          <div class="card-content">
            <h2 class="card-title">Personal details</h2>
            <div class="row">
              <div class="col s6">
                <Input :value="staff" :error.sync="error" :name="$t('firstName')" prop-name="first_name" />
              </div>
              <div class="col s6">
                <Input :value="staff" :error.sync="error" :name="$t('lastName')" prop-name="last_name" />
              </div>
            </div>

            <div class="row">
              <div class="col s4">
                <Date :value="staff" :error.sync="error" :name="$t('birthday')" prop-name="birthday" />
              </div>
              <div class="col s4">
                <Select
                  :value="staff"
                  :error.sync="error"
                  :name="$t('gender')"
                  prop-name="gender"
                  :reduce="item => item.code"
                  :options="genders"
                  label="name"
                />
              </div>
              <div class="col s4">
                <Select
                  :value="staff"
                  :error.sync="error"
                  :name="$t('nationality')"
                  prop-name="nationality"
                  :reduce="item => item.id"
                  :options="nationalities"
                  label="title"
                />
              </div>
            </div>
            <div class="row">
              <Input :value="staff" :error.sync="error" :name="$t('billings.notes')" prop-name="personal_notes" />
            </div>
          </div>
        </div>
      </div>
      <div class="col m4 s12">
        <div class="card col s12">
          <div class="card-content">
            <h2 class="card-title">{{ $t('assignedRooms')}}</h2>
            <div class="row">
              <Select
                :value="staff"
                :error.sync="error"
                :name="$t('selectRoom')"
                prop-name="rooms"
                :reduce="room => {return {id: room.id}}"
                :options="rooms"
                label="name"
                multiple
              />
            </div>
          </div>
        </div>

        <div class="card col s12">
          <div class="card-content">
            <h2 class="card-title">{{ $t('role') }}</h2>
            <div class="row">
              <Select
                :value="staff"
                :error.sync="error"
                :name="$t('selectRole')"
                prop-name="role"
                :reduce="role => role.code"
                :options="roles"
                label="name"
              />
            </div>
          </div>
        </div>

        <div class="card col s12">
          <div class="card-content">
            <h2 class="card-title">{{ $t('address') }}</h2>
            <div class="row">
              <Input
                :value="staff"
                :error.sync="error"
                :name="$t('streetAddress_1')"
                prop-name="street1"
              />
              <Input
                :value="staff"
                :error.sync="error"
                :name="$t('streetAddress_2')"
                prop-name="street2"
              />
              <Select
                :value="staff"
                :error.sync="error"
                :name="$t('governorate')"
                prop-name="governorate"
                :reduce="item => item.id"
                :options="governorates"
                label="title"
              />
              <Select
                :value="staff"
                :error.sync="error"
                :name="$t('area')"
                prop-name="area"
                :reduce="item => item.id"
                :options="areas"
                label="title"
              />
            </div>
          </div>
        </div>

        <div class="card col s12">
          <div class="card-content">
            <div class="row centered">
              <div class="col s6">
                <button class="btn waves-effect waves-light success" @click="save()">{{ $t('saveChanges') }}</button>
              </div>
              <div class="col s6">
                <button class="btn waves-effect waves-light default" @click="$router.go(-1)">{{ $t('cancel') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Input from "~/components/ui/input";
import Date from "~/components/ui/date";
import Select from "~/components/ui/select";
import Photo from "~/components/ui/photo";

export default {
  name: "StaffForm",
  props: {
    staff: Object,
    statuses: Array,
    payrolls: Array,
    nationalities: Array,
    genders: Array,
    roles: Array,
    rooms: Array,
    areas: Array,
    governorates: Array,
    method: {
      type: String,
      default: "post"
    }
  },
  components: { Input, Select, Date, Photo },
  data() {
    return {
      default_staff: {
        avatar: {},
        mobile: "",
        email: "",
        status: "",
        first_name: "",
        last_name: "",
        birthday: "",
        gender: "",
        personal_notes: "",
        role: null,
        street1: "",
        street2: "",
        city: null,
        governorate: null,
        nationality: null,
        payroll: null,
        employment_notes: ""
      },
      error: false,
      menu2: false,
      menu: false
    };
  },
  mounted() {
    Vue.unloadScript("/assets/js/custom.min.js").then(() => {
      Vue.loadScript("/assets/js/custom.min.js");
    });
  },
  methods: {
    save() {
      if (this.method === "post") {
        this.$http.post("/staff_staffs/", this.staff)
                .then(data => {
                  if (data.status === 201) {
                    this.$toast.global.success();
                    this.$router.push("/staff");
                    this.error = false;
                  }
                })
                .catch(e => {
                  this.$toast.global.error();
                  this.error = e.response.data;
                });
      } else {
        let url = `/staff_staffs/${ this.$route.params.id }/`;
        this.$http[this.method](url, this.staff)
                .then(data => {
                  this.$toast.global.success();
                  this.error = false;
                })
                .catch(e => {
                  this.$toast.global.error();
                  this.error = e.response.data;
                });
      }
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
.flex {
  display: flex;
}
.s4col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
input[readonly="readonly"] {
  border-bottom: none !important;
}
.employment-card {
  min-height: 312px;
}
</style>

