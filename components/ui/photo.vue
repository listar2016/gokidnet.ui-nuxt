<template>
  <ClientOnly>
    <div class="col s12">
      <div class="row">
        <div class="col s12">
          <div class="avatar" :style="{'background-image': background}">
            <transition name="fade">
              <Loader v-if="loading" />
            </transition>
          </div>
        </div>
      </div>
      <div>
        <div class="col s12">
          <div class="input-field">
            <div class="upload-btn-wrapper">
              <label for="photoInput" class="btn waves-effect waves-light teal lighten-1">
                {{ $t('ui.upload') }}
                <i class="material-icons right">cloud_upload</i>
              </label>
              <input id="photoInput" type="file" ref="file" accept="image/*" @change="onFileChange" />
              <transition name="fade">
                <div @click="save" v-if="buttons && !uploaded" class="btn  waves-effect waves-light teal lighten-1" style="margin-left: 15px;">
                  <i class="material-icons">save</i>
                </div>
              </transition>
              <transition name="fade">
                <div @click="remove" v-if="buttons && value[propName] != null && uploaded === true && !loading" class="btn  waves-effect waves-light red lighten-2" style="margin-left: 15px;">
                  <i class="material-icons">delete</i>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<script>
import Loader from "./loader";
import ClientOnly from 'vue-client-only'

export default {
  props: {
    value: { type: Object },
    propName: { type: String },
    url: {default: ''},
    buttons: {type: Boolean, default: true}
  },
  data() {
    return {
      loading: false,
      uploaded: true
    };
  },
  components: { Loader, ClientOnly },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.loading = true;
      var file = files[0];
      var data = new FormData();
      data.append("images", file);
      this.$http
        .post("/upload/", data)
        .then(response => {
          this.$toast.global.success();
          this.value[this.propName] = {
            id: response.data[0].id,
            url: response.data[0].url
          };
          setTimeout(() => {
            this.loading = false;
            this.uploaded = false;
          }, 1000);
        })
        .catch(e => {
          this.$toast.global.error();
          this.loading = false;
        });
    },
    save() {
      this.loading = true
      let data = {}
      data[this.propName] = this.value[this.propName]
      this.$http
        .patch(this.url, data)
        .then(response => {
          this.$toast.global.success();
          this.loading = false;
          this.uploaded = true
        })
        .catch(e => {
          this.$toast.global.error();
          this.loading = false;
        });
    },
    remove() {
      this.value[this.propName] = null
      this.save()
      this.$forceUpdate()
    }
  },
  computed: {
    background() {
      if (this.value[this.propName] && this.value[this.propName].url)
        return `url('${this.value[this.propName].url}')`;
      return null;
    }
  }
};
</script>
<style scoped>
.upload-btn-wrapper {
  position: relative;
  /* overflow: hidden; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 11px;
}

/* .btn {
  border: 2px solid gray;
  color: gray;
  background-color: white;
  border-radius: 8px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
} */

.upload-btn-wrapper input[type="file"] {
  display: none;
  /* font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  margin-top: 11px; */
}
.avatar {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background-image: url(/assets/images/default-user.png);
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
