<template>
  <span>
    <div class="row spinner-cnt" v-if="loader">
      <v-progress-circular :size="50" color="primary" indeterminate />
    </div>

    <div class="row" v-else>
      <div class="col s3">
        <!-- <div class="card">
        <div class="card-content">
          <form class="m-t-3">
            <vue-select
              v-model="school"
              :reduce="item => item"
              label="name"
              :options="schools"
              placeholder="Schools"
              style="margin-top: 26px"
              @input="getItems"
            />
          </form>
        </div>
        </div>-->
        <transition-group name="slide-fade">
          <div class="card" v-if="school && changed" :key="1">
            <div class="card-content">
              <div class="row">
                <Photo :value="editedItem" prop-name="logo" />
              </div>
            </div>
          </div>
          <div class="card" v-if="school && changed" :key="2">
            <div class="card-content">
              <a
                class="centered waves-effect waves-light btn-large btn-round indigo"
                @click="save"
              >{{ $t('save') }}</a>
            </div>
          </div>
        </transition-group>
      </div>
      <transition name="slide-fade">
        <div class="col s9" v-if="school && changed">
          <div class="card">
            <div class="card-content">
              <div class="row">
                <div class="col s6">
                  <form class="m-t-3">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('management.schoolNumber')"
                      prop-name="name"
                    />
                  </form>
                </div>

                <div class="col s6">
                  <form class="m-t-3">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('streetAddress_1')"
                      prop-name="street1"
                    />
                  </form>
                </div>
              </div>
              <div class="row">
                <div class="col s6">
                  <form class="m-t-3">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('contactNumber')"
                      prop-name="phone"
                    />
                  </form>
                </div>

                <div class="col s6">
                  <form class="m-t-3">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('streetAddress_2')"
                      prop-name="street2"
                    />
                  </form>
                </div>

                <!-- // -->
                <!-- <div class="col s6">
                <form class="m-t-3">
                  <Input
                    :value="editedItem"
                    :error.sync="error"
                    name="Facebook page address"
                    prop-name="facebook"
                  />
                </form>
                </div>-->
              </div>
              <div class="row">
                <!-- /// -->
                <div class="col s6">
                  <form class="m-t-3">
                    <Input :value="editedItem" :error.sync="error" :name="$t('fax')" prop-name="fax" />
                  </form>
                </div>

                <div class="col s6">
                  <form class="m-t-3">
                    <Select
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('city')"
                      label="title"
                      prop-name="area"
                      :options="areas"
                    />
                  </form>
                </div>
              </div>
              <div class="row">
                <!-- <div class="col s6">
                <form class="m-t-3">
                  <Select
                    :value="editedItem"
                    :error.sync="error"
                    name="Rooms/Groups"
                    prop-name="rooms"
                    :options="rooms"
                    :multiple="true"
                    :reduce="item => {return {id: item.id}}"
                  />
                </form>
                </div>-->

                <!-- /// -->

                <!-- <div class="col s6">
                <form class="m-t-3">
                  <Select
                    :value="editedItem"
                    :error.sync="error"
                    name="Governorate"
                    prop-name="governorate"
                    label="title"
                    :options="governorates"
                  />
                </form>
                </div>-->
              </div>
              <div class="row">
                <!-- /// -->
                <div class="col s6">
                  <form class="m-t-3">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('website')"
                      prop-name="website"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-content">
              <span class="card-title">{{ $t('managements.schoolSettings') }}</span>
              <div class="row center-align">
                <div class="col">
                  <label>
                    <input type="checkbox" v-model="editedItem.parent_editor" />
                    <span>{{ $t('managements.parentCanEdit') }}</span>
                  </label>
                </div>
                <div class="col">
                  <label>
                    <input type="checkbox" v-model="editedItem.share_attendance_with_parent" />
                    <span>{{ $t('managements.shareParents') }}</span>
                  </label>
                </div>
                <div class="col">
                  <label>
                    <input type="checkbox" v-model="editedItem.parent_pin" />
                    <span>{{ $t('managements.parentCheck') }}</span>
                  </label>
                </div>
                <div class="col">
                  <label>
                    <input type="checkbox" v-model="editedItem.staff_use_admin_device" />
                    <span>{{ $t('managements.staffCheck') }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </span>
</template>
<script>
import Input from "~/components/ui/input";
import Select from "~/components/ui/select";
import Photo from "~/components/ui/photo";
export default {
  components: {
    Input,
    Select,
    Photo
  },
  watch: {
    $route: {
      handler: "fetchData",
      immediate: true
    },
    governorate() {
      this.refreshAreas();
    }
  },
  data() {
    return {
      loader: false,
      schools: [],
      rooms: [],
      governorates: [],
      areas: [],
      editedItem: {
        name: "",
        phone: "",
        fax: "",
        website: "",
        facebook: "",
        street1: "",
        street2: "",
        governorate: 0,
        area: 0,
        parent_editor: true,
        parent_pin: true,
        share_attendance_with_parent: true,
        staff_use_admin_device: true,
        start_of_the_week: "MONDAY",
        rooms: []
      },
      defaultItem: {
        name: "",
        phone: "",
        fax: "",
        website: "",
        facebook: "",
        street1: "",
        street2: "",
        governorate: 0,
        area: 0,
        parent_editor: true,
        parent_pin: true,
        share_attendance_with_parent: true,
        staff_use_admin_device: true,
        start_of_the_week: "MONDAY",
        rooms: []
      },
      school: null,
      error: false,
      changed: false,
      profile_school_id: false
    };
  },
  methods: {
    async fetchData() {
      this.loader = true;
      await this.$http
        .get("school_schools/", { params: { page_size: 25 } })
        .then(response => {
          this.schools = response.data.results;
        });
      // await this.$http
      //   .get("room_rooms/", { params: { page_size: 25 } })
      //   .then(response => {
      //     this.rooms = response.data.results;
      //   });
      // await this.$http
      //   .get("reference_governorates/", { params: { page_size: 25 } })
      //   .then(response => {
      //     this.governorates = response.data.results;
      //   });

      await this.$http
        .get("/my/profile")
        .then(res => {
          if (res && res.data && res.data.school && res.data.school.id) {
            // console.log("school id", res.data.school.id);

            if (this.schools && this.schools.length) {
              const schoolObj = this.schools.find(
                item => item.id == res.data.school.id
              );

              if (schoolObj) {
                this.school = schoolObj;
                this.getItems(schoolObj);
              }
            }
          }
        })
        .catch(error => {
          console.log(error.response);
        });

      this.loader = false;
    },
    getItems(item) {
      // console.log("getItems", item);
      this.editedItem = item;
      this.refreshAreas();
      this.changed = false;
      setTimeout(() => {
        this.changed = true;
      }, 600);
    },
    save() {
      this.error = false;
      this.$http
        .put("/school_schools/" + this.editedItem.id + "/", this.editedItem)
        .then(response => {
          console.log(response);
          this.$toast.global.success();
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    },
    refreshAreas() {
      if (!this.editedItem.governorate) return;

      let governorate = this.editedItem.governorate.id
        ? this.editedItem.governorate.id
        : this.editedItem.governorate;

      this.areas = [];
      this.$http
        .get("reference_areas/", {
          params: { page_size: 25, governorate: governorate }
        })
        .then(response => {
          this.areas = response.data.results;
        });
    }
  },
  computed: {
    governorate() {
      return this.editedItem.governorate;
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>