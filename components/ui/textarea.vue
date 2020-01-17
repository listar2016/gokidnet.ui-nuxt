<template>
	<div class="col s12 root">
		<div class="input-field">
			<textarea v-model="value[propName]" :class="{invalid: error[propName], valid: error !== false}" :placeholder="name" rows="4"></textarea>
			<label class="active">{{name}}</label>
			<span v-if="error !== false && error[propName]" class="invalid">
				{{ error[propName] ? error[propName][0] : '' }}
			</span>
			<span v-if="error !== false && !error[propName]" class="valid">
				{{ $t('billings.allRight') }}
			</span>
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
	}
};
</script>

<style scoped>
	.root {
		margin-top: 15px;
	}
	textarea {
		min-height: 80px;
		max-height: 320px;
		border-bottom: 2px solid rgb(197, 196, 196);
	}
	textarea.valid {
		border-bottom: 2px solid rgb(76, 175, 80);
	}
	textarea.invalid {
		border-bottom: 2px solid #F44336;
	}
    span {
        position: relative;
        min-height: 18px;
        display: block;
        font-size: 12px;
    }
    span.valid {
        color: #4CAF50;
    }
    span.invalid {
        color: #F44336;
    }

</style>