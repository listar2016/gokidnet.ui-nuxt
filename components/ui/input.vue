<template>
	<div class="col s12">
		<div class="input-field">
			<input v-model="value[propName]" :type="type" :class="{invalid: error[propName], valid: error !== false}" :placeholder="name">
			<label class="active">{{name}}</label>
			<span class="helper-text" v-if="error !== false" :data-error="error[propName] ? error[propName] : ''" :data-success="$t('billings.allRight')"></span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		value: {type: Object},
		error: [Object, Boolean],
		name: {type: String},
		propName: {type: String},
		type: {type: String, default: 'text'}
	}
};
</script>