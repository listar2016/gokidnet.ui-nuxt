<template>
  <ClientOnly>
    <div class="col m12">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        locale="ru-ru"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="value[propName]"
            :label="name"
            prepend-icon="event"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="value[propName]" @input="menu = false"></v-date-picker>
      </v-menu>
      <span
        v-if="error !== false && error[propName]"
        class="invalid"
      >{{ error[propName] ? error[propName][0] : '' }}</span>
      <span v-if="error !== false && !error[propName]" class="valid">{{ $t('billings.allRight') }}</span>
    </div>
  </ClientOnly>
</template>

<script>
import ClientOnly from 'vue-client-only'

export default {
  components: {
    ClientOnly
  },
  props: {
    value: { type: Object },
    error: [Object, Boolean],
    name: { type: String },
    propName: { type: String }
  },
  data(vm) {
    return {
      menu: false
    };
  },
  mounted() {},
  methods: {}
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
