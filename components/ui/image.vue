<template>
    <div class="row">
        <div class="image-preview warning-gradient" :style="{'background-image': background}"></div>
        <div class="file-upload">
            <label for="upload" class="file-upload__label">{{ $t('ui.uploadImage') }}</label>
            <input id="upload" class="file-upload__input" type="file" name="file-upload" @change="onFileChange">
        </div>
    </div>
</template>

<script>
export default {
	props: {
		value: {type: Object},
		propName: {type: String}
	},
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            var file = files[0];
            var data = new FormData()
            data.append('images', file)
            this.$http.post('/upload/', data).then((response) => {
                this.$toast.global.success()
                this.value[this.propName] = {id: response.data[0].id, url: response.data[0].url}
            }).catch((e) => {
                this.$toast.global.error()
            })
        },
    },
    computed: {
        background() {
            if(!this.value[this.propName]) return false
            return `url('${this.value[this.propName].url}')`
        }
    }
}
</script>

<style scoped>
    .row {
        text-align: center;
    }
    .image-preview {
        width: 100%;
        height: 200px;
        background-position: center;
        background-size: cover;
        margin-bottom: -28px;
    }
    .file-upload {
        position: relative;
        display: inline-block;
    }

    .file-upload__label {
        display: block;
        padding: 1em 2em;
        color: #fff;
        background: #222;
        border-radius: .4em;
        transition: background .3s;
        border: 1px solid white;
    }
    .file-upload__label:hover {
        cursor: pointer;
        background: #000;
    }
    
    .file-upload__input {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        font-size: 1;
        width:0;
        height: 100%;
        opacity: 0;
    }
</style>