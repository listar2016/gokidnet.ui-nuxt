<template>
  <div class="col s12 root" v-if="options.length !== 0">
    <label class="active">{{name}}</label>
    <vue-select
      v-model="value[propName]"
      v-if="options.length"
      :reduce="reduce"
      :label="label"
      :options="options"
      :placeholder="name"
      :class="{invalid: error[propName], valid: error !== false, multiply: multiple}"
      :multiple="multiple"
    ></vue-select>
    <span
      v-if="error !== false && error[propName]"
      class="invalid"
    >{{ error[propName] ? error[propName][0] : '' }}</span>
    <span v-if="error !== false && !error[propName]" class="valid">{{ $t('billings.allRight') }}</span>
  </div>
</template>
<script>
export default {
  render: {
    ssr: false
  },
  props: {
    value: { type: Object },
    error: [Object, Boolean],
    name: { type: String },
    propName: { type: String },
    options: { type: Array },
    label: { type: String, default: "name" },
    reduce: { type: Function, default: item => item.id },
    multiple: { type: Boolean, default: false }
  }
};
</script>

<style scoped>
span {
  position: relative;
  min-height: 18px;
  display: block;
  font-size: 12px;
  margin-top: -23px;
}
span.valid {
  color: #4caf50;
}
span.invalid {
  color: #f44336;
}
.root {
  text-align: left;
}

.dropdown-menu {
  z-index: 10030 !important;
}
</style>