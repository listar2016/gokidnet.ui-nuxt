<template>
  <v-layout wrap>
    <v-flex>
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="time" :label="name" prepend-icon="access_time" readonly v-on="on"></v-text-field>
        </template>
        <v-time-picker v-if="menu" v-model="time" full-width @click:minute="$refs.menu.save(time)"></v-time-picker>
      </v-menu>
      <span
        v-if="error !== false && error[propName]"
        class="invalid"
      >{{ error[propName] ? error[propName][0] : '' }}</span>
      <span v-if="error !== false && !error[propName]" class="valid">{{ $t('billings.allRight') }}</span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    value: { type: Object },
    error: [Object, Boolean],
    name: { type: String },
    propName: { type: String },
    defaultTimestamp: { type: [String, Number, Object] }
  },
  mounted() {
    this.time = this.value[this.propName];
  },
  data() {
    return {
      time: null,
      menu: false,
      modal: false
    };
  },
  watch: {
    time() {
      this.save();
    },
    defaultTimestamp(val) {
      this.value[this.propName] = val.format("HH:mm:ss");
    }
  },
  methods: {
    save() {
      this.value[this.propName] = this.time;
    }
  }
};
</script>
<style scoped>
span {
  position: relative;
  min-height: 18px;
  display: block;
  font-size: 12px;
  margin-top: -13px;
}
span.valid {
  color: #4caf50;
}
span.invalid {
  color: #f44336;
}
</style>