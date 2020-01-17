<template>
  <div class="container">
    <div class="row">
      <nuxt-link to="/students">
        <div class="col l3 m6 s12">
          <div class="card danger-gradient card-hover">
            <div class="card-content">
              <div class="d-flex no-block align-items-center">
                <div>
                  <h2 class="white-text m-b-5">{{ animatedStudents }}</h2>
                  <h6 class="white-text op-5 light-blue-text">{{ $t('students')}}</h6>
                </div>
                <div class="ml-auto">
                  <span class="white-text display-6">
                    <i class="material-icons">school</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link to="/staff/list">
        <div class="col l3 m6 s12">
          <div class="card info-gradient card-hover">
            <div class="card-content">
              <div class="d-flex no-block align-items-center">
                <div>
                  <h2 class="white-text m-b-5">{{ animatedEmployees }}</h2>
                  <h6 class="white-text op-5">{{ $t('employees') }}</h6>
                </div>
                <div class="ml-auto">
                  <span class="white-text display-6">
                    <i class="material-icons">dashboard</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link to="/rooms">
        <div class="col l3 m6 s12">
          <div class="card success-gradient card-hover">
            <div class="card-content">
              <div class="d-flex no-block align-items-center">
                <div>
                  <h2 class="white-text m-b-5">{{ animatedRooms }}</h2>
                  <h6 class="white-text op-5 text-darken-2">{{ $t('roomsW') }}</h6>
                </div>
                <div class="ml-auto">
                  <span class="white-text display-6">
                    <i class="material-icons">dashboard</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>

      <nuxt-link to="/billing/invoices">
        <div class="col l3 m6 s12">
          <div class="card success-gradient card-hover">
            <div class="card-content">
              <div class="d-flex no-block align-items-center">
                <div>
                  <h2 class="white-text m-b-5">{{ animatedInvoices }}</h2>
                  <h6 class="white-text op-5 text-darken-2">{{ $t('invoices') }}</h6>
                </div>
                <div class="ml-auto">
                  <span class="white-text display-6">
                    <i class="material-icons">attach_money</i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div class="col s12">
      <h5 class="card-title m-t-40">{{ $t('quickActions') }}</h5>
    </div>

    <div class="row">
      <div class="col m6">
        <!-- <nuxt-link to="/athletes/new" class="card green darken-1 card-hover" tag="div"> -->
        <div class="card green darken-1 card-hover">
          <div class="card-content cursor-hand" @click="newStudent">
            <div class="d-flex align-items-center">
              <div>
                <i class="material-icons white-text" style="font-size: 2em;">directions_run</i>
              </div>
              <div class="m-l-10">
                <h5 class="m-b-0 white-text">{{ $t('addNewStudent') }}</h5>
              </div>
            </div>
          </div>
        </div>
        <!-- </nuxt-link> -->
      </div>
      <div class="col m6">
        <!-- <nuxt-link to="/staff/new" class="card blue darken-1 card-hover" tag="div"> -->
        <div class="card blue darken-1 card-hover">
          <div class="card-content cursor-hand" @click="newStaff">
            <div class="d-flex align-items-center">
              <div>
                <i class="material-icons white-text" style="font-size: 2em;">group_add</i>
              </div>
              <div class="m-l-10">
                <h5 class="m-b-0 white-text">{{ $t('addNewStaffMember') }}</h5>
              </div>
            </div>
          </div>
        </div>
        <!-- </nuxt-link> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students: 0,
      employees: 0,
      rooms: 0,
      invoices: 0,

      tweenedStudents: 0,
      tweenedEmployees: 0,
      tweenedRooms: 0,
      tweenedInvoices: 0
    };
  },
  mounted() {
    this.$http
      .get("/student_students", { params: { page_size: 1 } })
      .then(response => {
        this.students = response.data.count;
      });
    this.$http
      .get("/staff_staffs", { params: { page_size: 1 } })
      .then(response => {
        this.employees = response.data.count;
      });
    this.$http
      .get("/room_rooms", { params: { page_size: 1 } })
      .then(response => {
        this.rooms = response.data.count;
      });
    this.$http
      .get("/billing_invoices", { params: { page_size: 1 } })
      .then(response => {
        this.invoices = response.data.count;
      });

    // this.expand = this.$cookies.get('expand') ? this.$cookies.get('expand')  : this.expand;
  },
  methods: {
    newStudent() {
      localStorage.setItem("new", "true");
      this.$router.push(this.localePath("students"));
    },
    newStaff() {
      // localStorage.setItem('new', 'true');
      this.$router.push("/staff/new");
    }
  },
  computed: {
    animatedStudents: function() {
      return this.tweenedStudents.toFixed(0);
    },
    animatedEmployees: function() {
      return this.tweenedEmployees.toFixed(0);
    },
    animatedRooms() {
      return this.tweenedRooms.toFixed(0);
    },
    animatedInvoices() {
      return this.tweenedInvoices.toFixed(0);
    }
  },
  watch: {
    students: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedStudents: newValue });
    },
    employees: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedEmployees: newValue });
    },
    rooms(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedRooms: newValue });
    },
    invoices(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedInvoices: newValue });
    }
  }
};
</script>

<style scoped>
ul li {
  padding: 0.5rem;
  display: inline;
  margin: 0 0.5rem;
}
ul {
  text-align: center;
}

.selected {
  background-color: #fff;
  color: #fff;
  transition: 0.3s;
}
.nSelect {
  transition: 0.3s;
}

.list-complete-item {
  transition: all 0.5s;
  display: inline-block;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(-92px);
}
.list-complete-move {
  transition: 0.5s;
}
.list-complete-leave-active {
  position: absolute;
}
.list-complete-enter-active {
  position: absolute;
}
.ml-auto {
  text-align: right;
}

.fade-enter,
.fade-leave-to {
  height: 0;
  opacity: 0;
}
.fade-enter-to,
.fade-leave {
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
</style>
