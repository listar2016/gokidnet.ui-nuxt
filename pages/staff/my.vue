<template>
  <div class="row">
    <div class="col s12 m4">
      <div class="card col s12">
        <div class="card-content row">
          <div class="col s12 centered">
            <Photo :value="staff" prop-name="avatar" url="/my/profile" />
          </div>
        </div>
      </div>

      <div class="card col s12">
        <div class="card-content">
          <div class="row">
            <div class="col centered">
              <button class="btn waves-effect waves-light success" @click="save()">{{ $t('saveChanges') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col s12 m8">
      <div class="row">
        <div class="col s12">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s12 m3">
                  <Input
                    :value="staff"
                    :error.sync="error"
                    :name="$t('firstName')"
                    prop-name="first_name"
                  />
                </div>
                <div class="col s12 m3">
                  <Input :value="staff" :error.sync="error" :name="$t('lastName')" prop-name="last_name" />
                </div>
                <div class="col s12 m3">
                  <Input :value="staff" :name="$t('mobileNumber')" prop-name="mobile" />
                </div>
                <div class="col s12 m3">
                  <Input :value="staff" :error.sync="error" :name="$t('email')" prop-name="email" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <h5 class="p-l-10">My rooms</h5>
        <div v-for="room in rooms" :key="room.id" class="col m6 s12">
          <div class="card card-hover">
            <div class="row">
              <div class="col s12">
                <div class="light-blue darken-2 p-20">
                  <div class="center-align white-text display-6">{{ room.name }}</div>
                </div>
                <div class="card-content">
                  <div class="d-flex no-block align-items-center">
                    <div>
                      <h4 class="font-medium">{{room.students_count}}</h4>
                      <h6 class="cyan-text m-b-0">{{ $t('students') }}</h6>
                    </div>
                    <div class="right-align">
                      <h4 class="font-medium">{{ room.teachers_count }}</h4>
                      <h6 class="cyan-text m-b-0">{{ $t('teachers') }}</h6>
                    </div>
                  </div>
                </div>
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
import StaffForm from "~/components/StaffForm.vue";
import Input from "~/components/ui/input";
import Photo from "~/components/ui/photo";

export default {
  components: { StaffForm, Input, Photo },
  mounted() {
    this.$http
      .get("/my/profile")
      .then(response => {
        this.staff = response.data;
      })
      .catch(error => {
        console.log(error.response);
      });
    this.$http.get("/my/rooms/").then(response => {
      this.rooms = response.data.results;
    });
  },
  data() {
    return {
      rooms: [],
      staff: {
        id: null,
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        name: "",
        avatar: {
          id: null,
          url: "",
          thumbnail: null,
          thumbnail_150: null
        },
        mobile: ""
      },
      error: {},
      menu2: false,
      menu: false
    };
  },
  methods: {
    save() {
      this.$http
        .post("/my/profile/", this.staff)
        .then(response => {
          if (response.status == 200) {
            this.stuff = response.data;
            this.$toast.global.success();
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
};
</script>