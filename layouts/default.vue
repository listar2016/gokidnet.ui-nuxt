<template>
  <v-app>
    <div
      class="main-wrapper"
      id="main-wrapper"
      data-layout="horizontal"
      data-sidebartype="mini-sidebar"
    >
      <!-- ============================================================== -->
      <!-- Preloader - style you can find in spinners.css -->
      <!-- ============================================================== -->
      <!-- <div class="preloader">
        <div class="loader">
          <div class="loader__figure"></div>
          <p class="loader__label">Material Admin</p>
        </div>
      </div>-->
      <Header />
      <Sidebar :path.sync="path" />
      <!-- ============================================================== -->
      <!-- Page wrapper scss in scafholding.scss -->
      <!-- ============================================================== -->
      <div class="page-wrapper">
        <!-- ============================================================== -->
        <!-- Title and breadcrumb -->
        <!-- ============================================================== -->
        <div class="page-titles">
          <div class="d-flex align-items-center">
            <h5 class="font-medium m-b-0">
              {{
              routes[routes.length - 1]
              ? routes[routes.length - 1].name.indexOf('___') != -1 ? routes[routes.length - 1].name.slice(0, -5) : routes[routes.length - 1].name
              : $t('home')
              }}
            </h5>
            <div class="custom-breadcrumb ml-auto">
              <a :href="localePath('index')" class="breadcrumb">{{ $t('home') }}</a>
              <router-link
                :to="localePath({name: route.name.indexOf('___') != -1 ? route.name.slice(0, -5).toLowerCase() : route.name.toLowerCase()})"
                class="breadcrumb"
                v-for="route in routes"
                :key="`breadcrumb_${route.name}`"
              >{{ route.name.indexOf('___') != -1 ? route.name.slice(0, -5) : route.name }}</router-link>
            </div>
          </div>
        </div>
        <!-- ============================================================== -->
        <!-- Container fluid scss in scafholding.scss -->
        <!-- ============================================================== -->
        <div class="container-fluid">
          <nuxt />
        </div>
      </div>
      <!-- ============================================================== -->
      <!-- Page wrapper scss in scafholding.scss -->
      <!-- ============================================================== -->

      <!-- change default password modal -->
      <v-dialog persistent v-model="changeDefaultPassphraseModal" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">
              {{ $t('youLoggedIn') }}
              <br />{{ $t('pleaseCreate') }}:
            </span>
          </v-card-title>
          <v-card-text>
            <Input
              :value="modalField"
              :error.sync="error"
              type="password"
              :name="$t('newPassword')"
              prop-name="newpass"
            />
          </v-card-text>

          <v-card-text>
            <Input
              :value="retry"
              :error.sync="error"
              type="password"
              :name="$t('passwordConfirmation')"
              prop-name="newpass"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="closeModal">{{ $t('cancel') }}</v-btn>
            <v-btn color="blue darken-1" flat @click="save">{{ $t('save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app>
</template>

<script>
function cfl(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
import Header from "~/components/navigation/Header";
import Sidebar from "~/components/navigation/Sidebar";
import Input from "~/components/ui/input";
export default {
  components: { Header, Sidebar, Input },
  middleware ({ store, redirect }) {
    if (!store.state.user.accessToken) {
      return redirect('/login')
    }
  },
  mounted() {
    require("~/static/assets/js/materialize.min.js");
    require("~/static/assets/js/custom.min.js");

    try {
      this.$http.get("/my/profile").then(res => {
        // console.log("my/profile", res);
        if (res && res.data) {
          this.profile = res.data;
          if (!res.data.password_updated) {
            this.changeDefaultPassphraseModal = true;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  data: () => ({
    path: "Main",
    changeDefaultPassphraseModal: false,
    modalField: {
      newpass: ""
    },
    profile: null,
    error: false,
    retry: {
      newpass: ""
    }
  }),
  computed: {
    routes() {
      if (!this.$route.name) return [];
      let splited = this.$route.name.split("-");
      var routes = [];
      if (this.$route.path != "/") {
        for (var i in splited) {
          let name =
            i == splited.length - 1 && this.$store.state.user.title
              ? this.$store.state.user.title
              : cfl(splited[i]);
          routes[i] = {
            name: name,
            path: routes[i - 1]
              ? routes[i - 1].path + "/" + splited[i]
              : "/" + splited[i]
          };
        }
      }
      return routes;
    }
  },
  methods: {
    closeModal() {
      this.changeDefaultPassphraseModal = false;
    },
    save() {
      if (!this.modalField.newpass) {
        this.error = {
          newpass: this.$t('requiredField')
        };

        return;
      }

      if (this.modalField.newpass.length < 6) {
        this.error = {
          newpass: this.$t('passwordSix')
        };

        return;
      }

      if (
        this.modalField.newpass.toLowerCase() !=
        this.retry.newpass.toLowerCase()
      ) {
        this.error = {
          newpass: this.$t('passwordNotMatch')
        };
        return;
      }

      this.$http
        .post("/my/change-password/", {
          username: this.profile.username,
          password: this.modalField.newpass
        })
        .then(res => {
          // console.log("save", res.data);
          this.closeModal();
        })
        .catch(err => {
          // console.log("change pass", err);
          this.closeModal();
        });
    }
  }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.centered {
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
}

input[type="text"]:not(.browser-default)[readonly="readonly"] {
  border-bottom: none !important;
}
input[type="search"] {
  border: none !important;
  height: auto !important;
  width: auto !important;
  margin: 0 !important;
  font-size: 1em !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
.v-select.valid .vs__dropdown-toggle {
  border-bottom: 2px solid rgb(76, 175, 80);
  padding: 4px 0 12px;
  width: 100%;
}
.v-select.invalid .vs__dropdown-toggle {
  border-bottom: 2px solid rgb(244, 67, 54);
  padding: 4px 0 12px;
  width: 100%;
}
.collapsible-body li + li a {
  border-top: 1px solid #ccc;
}
.collapsible-body li a.nuxt-link-exact-active {
  border-left: 3px solid #14d8e2;
  color: #14d8e2;
}
button.vs__clear {
  display: none;
}
.vs__dropdown-option--highlight {
  background: #ebebeb !important;
  color: #5e35b1 !important;
}
.vs__dropdown-option {
  line-height: 1.42857143;
  clear: both;
  white-space: nowrap;
  font-size: 16px !important;
  color: #5e35b1 !important;
  display: block;
  line-height: 22px !important;
  padding: 14px 16px !important;
  cursor: pointer;
}
.vs__dropdown-option:hover {
  background-color: #ebebeb;
}
span.vs__selected {
  position: absolute;
  margin: 0;
}
.multiply span.vs__selected {
  position: relative;
  background: linear-gradient(to right, #11d7e4 0%, #48eaa1 100%);
  border: none;
  padding: 5px;
  color: white;
  font-weight: 700;
  margin-top: -8px;
  margin-right: 10px;
}
span.vs__selected button {
  margin-left: 12px;
}
.vs--searchable .vs__dropdown-toggle {
  cursor: text;
  margin-bottom: 2rem;
  border: transparent;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0px;
  padding: 0.3em 0 12px;
}
.vs--open .vs__dropdown-toggle,
.vs--searchable .vs__dropdown-toggle:focus {
  border-bottom: 1px solid #5e35b1;
  box-shadow: 0 1px 0 0 #5e35b1;
}

.vs--searchable .vs__dropdown-toggle:placeholder:focus {
  color: #5e35b1;
}

.left-sidebar .sidenav ul > li.nuxt-link-active > .collapsible-header,
.left-sidebar .sidenav ul > li.nuxt-link-exact-active > .collapsible-header {
  background-color: #11d7e4;
  background-image: -moz-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background-image: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, #11d7e4),
    color-stop(100%, #48eaa1)
  );
  background-image: -webkit-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background-image: -o-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background: -ms-linear-gradient(left, #11d7e4 0%, #48eaa1 100%);
  background: linear-gradient(to right, #11d7e4 0%, #48eaa1 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$from', endColorstr='$to',GradientType=1 );
  border-radius: 60px;
}
#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li.nuxt-link-active
  > .collapsible-header,
#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li.nuxt-exact-link-active
  > .collapsible-header {
  color: white;
}
.student {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  margin-right: 15px;
  background-image: url("./../static/assets/images/default-user.png");
}
.nuxt-link-active a i {
  color: white !important;
}

#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li:hover
  > .collapsible-header
  .hide-menu {
  color: #4f5467;
  font-weight: 700;
}

#main-wrapper[data-layout="horizontal"]
  .left-sidebar
  .sidenav[data-sidebarbg="skin6"]
  ul
  li.nuxt-link-active:hover
  > .collapsible-header
  .hide-menu {
  color: white;
  font-weight: 700;
}

@media screen and (min-width: 768px) {
  #main-wrapper[data-layout="horizontal"]
    aside
    > .sidenav:not(.right-sidenav)
    > .side-wrap
    > .collapsible
    > li {
    width: 12.5%;
  }
}

.m-t-7 {
  margin-top: 7px !important;
}
.main-wrapper {
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.95),
      rgba(78, 78, 78, 0.3)
    ),
    url("https://www.maxpixel.net/static/photo/1x/Star-Magic-Sparkle-Literature-Open-Book-Read-Book-2160539.png");
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-size: cover, cover, cover;
}
</style>
