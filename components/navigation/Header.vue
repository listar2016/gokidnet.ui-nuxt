<template>
  <header class="topbar">
    <nav data-navbarbg="skin1">
      <div class="nav-wrapper">
        <nuxt-link to="/" class="brand-logo">
          <span class="icon">
            <img class="light-logo" src="/assets/images/logo-light-icon.png" />
            <img class="dark-logo" src="/assets/images/logo-icon.png" />
          </span>
          <span class="text">
            <img class="light-logo" src="/assets/images/logo-light-text.png" />
            <img class="dark-logo" src="/assets/images/logo-text.png" />
          </span>
        </nuxt-link>
        <ul class="left">
          <li class="hide-on-med-and-down">
            <a href="javascript: void(0);" class="nav-toggle">
              <span class="bars bar1"></span>
              <span class="bars bar2"></span>
              <span class="bars bar3"></span>
            </a>
          </li>
          <li class="hide-on-large-only">
            <a href="javascript: void(0);" class="sidebar-toggle">
              <span class="bars bar1"></span>
              <span class="bars bar2"></span>
              <span class="bars bar3"></span>
            </a>
          </li>
        </ul>
        <ul class="right">
          <li>
            <v-flex xs12>
              <div class="text-center">
                <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-width="200"
                        min-width="290px"
                        offset-y
                        transition="slide-y-transition"
                >
                  <template v-slot:activator="{ on }">
                    <img v-if="profile.avatar" :src="profile.avatar.url" alt="user" class="circle profile-pic"  v-on="on"/>
                    <img v-else src="/assets/images/users/2.jpg" alt="user" class="circle profile-pic"  v-on="on"/>
                  </template>

                  <v-card>
                    <v-list class="dw-user-box">
                      <div class="row">
                        <div class="col s12 p-0-0">
                          <div class="col s4">
                            <v-list-tile-avatar size="80">
                              <img v-if="this.profile.avatar" :src="this.profile.avatar.url" alt="user" class="profile-pic-bordered" />
                              <img v-else src="/assets/images/users/2.jpg" class="profile-pic-bordered" alt="user"/>
                            </v-list-tile-avatar>
                          </div>
                          <div class="col s8 right-align">
                            <div class="u-text">
                              <p>{{profile.email}}</p>
                              <nuxt-link
                                      :to="( '/staff/my')"
                                      class="waves-effect waves-light btn-small red white-text"
                              >{{ $t('viewProfile') }}
                              </nuxt-link>
                            </div>
                              <v-menu offset-y>
                                <template v-slot:activator="{ on }">
                                  <v-btn color="primary" dark v-on="on" class="picked-lang-item lang-button">
                                    <img
                                            src="~/assets/images/globus.png"
                                            width="18"
                                            height="18"
                                            style="margin-right: 10px"
                                            alt="lang"
                                    />
                                    {{selectedLang}}
                                  </v-btn>
                                </template>
                                <ul>
                                  <li>
                                    <v-list class="col s4" subheader>
                                      <v-list-tile
                                              v-for="(locale, i) in $i18n.locales"
                                              :key="i"
                                              avatar
                                              class="lang-elem-list"
                                              ripple
                                              @click="changeLanguage($event, locale.code)"
                                      >
                                        <div class="lang-item">{{locale.name}}</div>
                                      </v-list-tile>
                                    </v-list>
                                  </li>
                                </ul>
                              </v-menu>
                          </div>
                        </div>
                      </div>
                    </v-list>
                    <ul>
                      <li role="separator" class="divider" tabindex="-1"></li>
                      <li @click="logout">
                        <a href="#" class="logout-btn">
                          <i class="material-icons">power_settings_new</i>
                          {{ $t('logout') }}
                        </a>
                      </li>
                    </ul>
                  </v-card>
                </v-menu>
              </div>
            </v-flex>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  mounted() {
    try {
      this.$http.get("/my/profile/").then(response => {
        if (response && response.data) {
          this.profile = response.data;
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      menu: false,
      selectedLang: this.$i18n.locale,
      profile: {}
    };
  },
  computed: {
    langObj() {
      return this.$i18n.locales.find(item => item.code === this.$i18n.locale);
    }
  },
  methods: {
    changeLanguage (event, lang) {
      event.preventDefault();
      if (this.$i18n.locale === lang) return
      this.selectedLang = lang

      this.loadLanguageFile(lang).then(msgs => {
        this.$i18n.setLocaleMessage(lang, msgs.default || msgs)
        this.$i18n.locale = lang
      })
    },
    loadLanguageFile (lang) {
      return import(`@/lang/${lang}.js`)
    },
    logout () {
      this.$store.dispatch("user/resetAuth")
      this.$router.push({name: "/login"})
    }
  }
};
</script>

<style scoped>
.profile-pic-bordered {
    border-radius: 5px;
}
.lang-button {
  margin: 13px 0px 0px 0;
}
.text-center {
  padding: 0 14px;
}
.u-text p {
  margin: 2px 0 6px 0;
  font-size: 12px;
  color: #9098ac;
}

.logout-btn {
  line-height: 44px;
  font-size: 16px;
  color: #9098ac;
}
.logout-btn i {
  height: inherit;
  line-height: inherit;
  float: left;
  margin: 0px 24px 0px 0px;
  width: 24px;
  margin-right: 19px;
  padding: 0 16px;
}
.profile-pic {
  height: 36px !important;
  width: 36px !important;
  vertical-align: middle;
  margin-top: -5px;
}
</style>
