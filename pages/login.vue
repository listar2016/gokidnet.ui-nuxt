<template>
  <div
    class="auth-wrapper d-flex no-block justify-content-center align-items-center"
    style="background:url(/assets/images/big/auth-bg2.jpg) no-repeat left center;"
  >
    <div class="container">
      <div class="auth-box auth-sidebar">
        <div id="loginform">
          <div class="p-l-10">
            <h5 class="font-medium m-b-0 m-t-40">{{ $t('signIn.title')}}</h5>
            <small>{{ $t('signIn.subTitle')}}</small>
          </div>
          <div class="p-l-10" v-if="$store.state.user.error != ''">
            <small class="error">{{$store.state.user.error}}</small>
          </div>
          <!-- Form -->
          <div class="row">
            <div class="col s12" @keyup.enter="login(user)">
              <!-- username -->
              <div class="row">
                <div class="input-field col s12">
                  <input
                    id="username"
                    type="text"
                    class="validate"
                    v-model="user.username"
                    required
                  />
                  <label for="username">{{ $t('signIn.mobileNumberOrEmail') }}</label>
                </div>
              </div>
              <!-- pwd -->
              <div class="row">
                <div class="input-field col s12">
                  <input
                    id="password"
                    type="password"
                    class="validate"
                    v-model="user.password"
                    required
                  />
                  <label for="password">{{ $t('signIn.password') }}</label>
                </div>
              </div>
              <!-- pwd -->
              <div class="row m-t-5">
                <div class="col s7">
                  <label>
                    <input type="checkbox" v-model="remember" />
                    <span>{{ $t('signIn.rememberMe') }}</span>
                  </label>
                </div>
              </div>
              <!-- pwd -->
              <div class="row m-t-40">
                <div class="col s12">
                  <button
                    class="btn-large w100 blue accent-4"
                    type="submit"
                    @click="login(user)"
                  >{{ $t('signIn.login') }}</button>
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
  import {mapState} from "vuex";

  export default {
  layout: "auth",
  data() {
    return {
      ...mapState({
        error: state => state.user.error
      }),
      user: {
        username: "",
        password: ""
      },
      remember: false
    };
  },
  methods: {
    login() {
      if (this.user.username && this.isNumeric(this.user.username) && this.user.username.startsWith("0")) {
        this.user.username = '+2' + this.user.username
      }
      try {
        this.$store.dispatch("user/login", this.user).then(res => {
          // console.log(res)
          if (res) return this.$router.push(this.localePath("index"));
        });
      } catch (error) {
        console.log(error);
      }
    },
    isNumeric(num){
      return !isNaN(num)
    }
  }
};
</script>
