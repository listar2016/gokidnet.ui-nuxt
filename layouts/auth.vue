<template>
  <div class="main-wrapper">
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <!-- <div class="preloader">
      <div class="loader">
        <div class="loader__figure"></div>
        <p class="loader__label">Dashboard</p>
      </div>
    </div> -->
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- Login box.scss -->
    <!-- ============================================================== -->
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    require("~/static/assets/js/materialize.min.js");
    require("~/static/assets/js/custom.min.js");
  }
}
</script>

<style>
@import '~/assets/css/pages/authentication.css';
</style>
