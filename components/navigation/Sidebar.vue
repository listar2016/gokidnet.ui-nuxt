<template>
  <!-- ============================================================== -->
  <!-- Sidebar scss in sidebar.scss -->
  <!-- ============================================================== -->
  <aside class="left-sidebar">
    <ul id="slide-out" class="sidenav" data-sidebarbg="skin6">
      <li class="side-wrap">
        <ul class="collapsible">
          <!-- <li class="small-cap"><span class="hide-menu">PERSONAL</span></li> -->
          <nuxt-link tag="li" :to="('/rooms')">
            <a href="javascript: void(0);" class="collapsible-header">
              <i class="material-icons">dashboard</i>
              <span class="hide-menu">{{ $t('roomsW') }}</span>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" :to="('/students')">
            <a href="javascript: void(0);" class="collapsible-header">
              <i class="material-icons">school</i>
              <span class="hide-menu">{{ $t('students') }}</span>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" :to="('/billing')" class="multiple">
            <a class="collapsible-header has-arrow">
              <i class="material-icons">dashboard</i>
              <span class="hide-menu">{{ $t('billing') }}</span>
            </a>
            <div class="collapsible-body">
              <ul class="collapsible" data-collapsible="accordion">
                <li>
                  <nuxt-link
                    :to="({
                    path: '/billing/items'
                  })"
                  >
                    <span class="hide-menu">{{ $t('items') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="({
                      path: '/billing/invoices'
                    })"
                  >
                    <span class="hide-menu">{{ $t('invoices') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({ path: '/billing/plans'})">
                    <span class="hide-menu">{{ $t('recurringPlans') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/billing/report'})">
                    <span class="hide-menu">{{ $t('report') }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </nuxt-link>
          <nuxt-link tag="li" :to="('/learning')" class="multiple">
            <a href="javascript: void(0);" class="collapsible-header has-arrow">
              <i class="material-icons">assessment</i>
              <span class="hide-menu">{{ $t('learning') }}</span>
            </a>
            <div class="collapsible-body">
              <ul class="collapsible" data-collapsible="accordion">
                <li>
                  <nuxt-link :to="({path: '/learning/lessons'})">
                    <span class="hide-menu">{{ $t('lessonsW') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/learning/plans'})">
                    <span class="hide-menu">{{ $t('lessonsPlans') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/learning/categories'})">
                    <span class="hide-menu">{{ $t('lessonsCategories') }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </nuxt-link>
          <!-- <li class="multiple">
                        <a href="javascript: void(0);" class="collapsible-header has-arrow"><i class="material-icons">dashboard</i><span class="hide-menu"> Reports</span></a>
          </li>-->
          <nuxt-link tag="li" :to="('/management')" class="multiple">
            <a href="javascript: void(0);" class="collapsible-header has-arrow">
              <i class="material-icons">work_outline</i>
              <span class="hide-menu">{{ $t('management') }}</span>
            </a>
            <div class="collapsible-body">
              <ul class="collapsible" data-collapsible="accordion">
                <li>
                  <nuxt-link
                    :to="({path: '/management/school-profile'})"
                  >
                    <span class="hide-menu">{{ $t('schoolProfile') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <a href="javascript: void(0);" class="collapsible-header has-arrow">
                    <span class="hide-menu">{{ $t('reports') }}</span>
                  </a>
                  <ul class="submenu">
                    <li>
                      <nuxt-link
                        :to="({path: '/management/reports/student-age'})"
                      >
                        <span class="hide-menu">{{ $t('student.age') }}</span>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link
                        :to="({path: '/management/reports/student-contacts'})"
                      >
                        <span class="hide-menu">{{ $t('student.contact') }}</span>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link
                        :to="({path: '/management/reports/student-allergy'})"
                      >
                        <span class="hide-menu">{{ $t('student.studentAllergy') }}</span>
                      </nuxt-link>
                    </li>
                    <li>
                      <nuxt-link
                        :to="({path: '/management/reports/room_attendance'})"
                      >
                        <span class="hide-menu">{{ $t('student.reportAttendance') }}</span>
                      </nuxt-link>
                    </li>
                    <!-- <li>
                      <nuxt-link to="/management/reports/staff_attendance">
                        <span class="hide-menu">Staff Attendance</span>
                      </nuxt-link>
                    </li>-->
                  </ul>

                  <!-- <nuxt-link to="/management/reports/student-age">
                    <span class="hide-menu">Student Age</span>
                  </nuxt-link>-->
                </li>
                <li>
                  <nuxt-link
                    :to="({path: '/management/activities'})"
                  >
                    <span class="hide-menu">{{ $t('activities') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/management/events'})">
                    <span class="hide-menu">{{ $t('eventsCalendar') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="({path: '/management/menu-items'})"
                  >
                    <span class="hide-menu">{{ $t('menuItems') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link
                    :to="({path: '/management/meal-menus'})"
                  >
                    <span class="hide-menu">{{ $t('mealMenus') }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </nuxt-link>
          <nuxt-link tag="li" :to="('/staff')" class="multiple">
            <a href="javascript: void(0);" class="collapsible-header has-arrow">
              <i class="material-icons">people_outline</i>
              <span class="hide-menu">{{ $t('staff') }}</span>
            </a>
            <div class="collapsible-body">
              <ul class="collapsible" data-collapsible="accordion">
                <li>
                  <nuxt-link :to="({path: '/staff/list'})">
                    <span class="hide-menu">{{ $t('staffList') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/staff/payroll'})">
                    <span class="hide-menu">{{ $t('payroll') }}</span>
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link :to="({path: '/staff/payroll_report'})">
                    <span class="hide-menu">{{ $t('payrollReport') }}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </nuxt-link>
          <nuxt-link tag="li" :to="('/messaging')">
            <a href="javascript: void(0);" class="collapsible-header">
              <i class="material-icons">message</i>
              <span class="hide-menu">{{ $t('messagingW') }}</span>
            </a>
          </nuxt-link>
          <li class="small-cap">
            <span class="hide-menu">OTHER</span>
          </li>
          <nuxt-link tag="li" :to="('help')">
            <a href="javascript: void(0);" class="collapsible-header">
              <i class="material-icons">help</i>
              <span class="hide-menu">{{ $t('help') }}</span>
            </a>
          </nuxt-link>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: ["path"],
  methods: {
    changePath(path, path_name) {
      this.$emit("update:path", path_name);
      this.$router.push(("rooms"));
    }
  }
};
</script>
<style >
ul.submenu {
  position: absolute;
  left: 220px;
  width: 300px;
  background: #fff;
  display: none;
  top: 0;
}
aside.left-sidebar ul.sidenav .collapsible-body li:hover ul.submenu {
  display: block;
}
aside.left-sidebar
  ul.sidenav
  .collapsible-body
  li
  a.collapsible-header.has-arrow {
  font-weight: 300 !important;
  border-top: 1px solid #ccc;
}
aside.left-sidebar
  ul.sidenav
  .collapsible-body
  li
  a.collapsible-header.has-arrow
  span.hide-menu {
  font-weight: 300 !important;
}
aside.left-sidebar
  ul.sidenav
  .collapsible-body
  li:hover
  a.collapsible-header.has-arrow:after {
  transform: rotate(137deg) !important;
}
</style>