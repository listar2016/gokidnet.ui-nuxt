<template>
  <div>
    <StaffForm
      methods="post"
      :staff="staff"
      :statuses="statuses"
      :payrolls="payrolls"
      :nationalities="nationalities"
      :genders="genders"
      :roles="roles"
      :rooms="rooms"
      :areas="areas"
      :governorates="governorates"
    />
  </div>
</template>
<script>
import Vue from "vue";
import StaffForm from "~/components/StaffForm.vue";

export default {
  components: { StaffForm },

  async asyncData(context) {
    let statuses = await context.app.$http
      .get("/staff_staffs/statuses/")
      .then(response => {
        let data = response.data.choices;
        return data;
      });
    let payrolls = await context.app.$http
      .get("/staff_payrolls/")
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let nationalities = await context.app.$http
      .get("/reference_nationalities/")
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let governorates = await context.app.$http
      .get("/reference_governorates/")
      .then(response => {
        let data = response.data.results;
        return data;
      });
    //  let areas = await context.app.$http
    //   .get("/reference_areas/")
    //   .then(response => {
    //     let data = response.data.results;
    //     return data;
    //   });
    let rooms = await context.app.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let roles = await context.app.$http
      .get("/staff_staffs/roles/")
      .then(response => {
        let data = response.data.choices;
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
      statuses: statuses,
      payrolls: payrolls,
      nationalities: nationalities,
      genders: genders,
      roles: roles,
      rooms: rooms,
      // areas: areas,
      governorates: governorates
    };
  },
  data() {
    return {
      staff: {
        mobile: "",
        email: "",
        status: null,
        first_name: "",
        last_name: "",
        birthday: "",
        gender: null,
        personal_notes: "",
        role: null,
        street1: "",
        street2: "",
        city: null,
        governorate: null,
        nationality: null,
        payroll: null,
        employment_notes: "",
        photo: {},
        rooms: []
      },
      error: {},
      menu2: false,
      menu: false,
      areas: []
    };
  },
  mounted() {
    this.refreshAreas()
  },
	computed: {
		governorate() {
			return this.staff.governorate
		}
	},
	watch: {
		governorate() {
			this.refreshAreas()
		}
  },
  methods: {
		refreshAreas() {
			if(!this.staff.governorate)
				return
			
			let governorate = this.staff.governorate.id ? this.staff.governorate.id : this.staff.governorate
			
			this.areas = []
			this.$http.get("reference_areas/", { params:  { page_size: 10000, governorate: governorate } }).then(response => {
				this.areas = response.data.results;
			});
		}
  }
};
</script>


