<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <ul class="timeline">
            <li
              v-for="(activity, index) in activities"
              :class="{'timeline-inverted': index & 1}"
              :key="activity.id"
            >
              <div class="timeline-badge success">
                <img class="responsive-img" alt="user" :src="activity.activity.icon_url" />
              </div>
              <div class="timeline-panel">
                <div class="student-detialsbox">
                  <div class="activity-left">
                    <h3>
                      <figure>
                        <img class="responsive-img" alt="user" :src="activity.activity.icon_url" />
                      </figure>
                      {{activity.activity.title}}
                    </h3>
                    <div class="ditailbox">
                      <h5 class="user-name">
                        <div class="row">
                          <div class="col s2">
                            <i class="fa fa-user-circle" aria-hidden="true"></i>
                          </div>
                          <div class="col s10">
                            {{activity.initiator.name}}
                          </div>
                        </div>
                      </h5>
                      <h5 class="user-name">
                        <div class="row">
                          <div class="col s2">
                            <i class="far fa-clock" aria-hidden="true"></i>
                          </div>
                          <div class="col s10">
                            {{activity.time | formatDate}}
                          </div>
                        </div>
                      </h5>

                      <h5 class="user-name">
                        <div class="row">
                          <div class="col s2">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                          </div>
                          <div class="col s10">
                            <span v-if="activity.extras && activity.extras.length">
                              {{activity.extras ? activity.extras.length ? activity.extras[0].name: ' ' : ''}}:
                              <span v-html="getExtrasValue(activity.extras)"/>
                            </span>
                            <span v-else>{{ $t('rooms.na') }}</span>
                          </div>
                        </div>
                      </h5>

                      <h5 class="user-name">
                        <div class="row">
                          <div class="col s2">
                            <i class="fa fa-sticky-note" aria-hidden="true"></i>
                          </div>
                          <div class="col s10">
                        <span v-if="activity.notes">
                          {{activity.notes}}
                        </span>
                            <span v-else>{{ $t('rooms.na') }}</span>
                          </div>
                        </div>
                      </h5>
                      <ul v-if="activity.photos.length <= 3" class="gellry-imgbox">
                        <li
                          v-for="photo in activity.photos"
                          :key="photo.id"
                          @click="showThumb(activity.photos)"
                        >
                          <img class="responsive-img" alt="user" :src="photo.url" />
                        </li>
                      </ul>
                      <ul v-if="activity.photos.length > 3" class="gellry-imgbox">
                        <li
                          v-for="photo in 3"
                          :key="activity.photos[photo].id"
                          @click="showThumb(activity.photos)"
                        >
                          <img class="responsive-img" alt="user" :src="activity.photos[photo].url" />
                        </li>
                        <span class="length_numb">+{{activity.photos.length - 3}}</span>
                      </ul>
                    </div>
                  </div>
                  <div class="student-right">
                    <figure v-if="activity.students.length > 0 && activity.students[0].photo">
                      <img class="responsive-img" alt="user" :src="activity.students[0].photo ? activity.students[0].photo.url : '' " />
                    </figure>
                    <figure v-else class="avatar"></figure>
                    <h4 v-if="activity.students.length > 0">
                      {{activity.students[0].first_name}}
                      <br>
                      <span>{{activity.students[0].last_name}}</span>
                    </h4>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="dialog"
      class="thumbnail-popup"
      width="750"
      style="width: 750px; height: 450px;"
      :key="dialog"
    >
      <v-carousel class="act-img__cnt">
        <v-carousel-item v-for="thumb in thumbnails" :key="thumb.id">
          <img
            class="responsive-img"
            alt="user"
            :src="thumb.url"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </v-carousel-item>
      </v-carousel>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["activities"],
  data() {
    return {
      dialog: false,
      thumbnails: []
    };
  },
  methods: {
    showThumb(photos) {
      this.thumbnails = [];
      this.thumbnails = photos;
      this.dialog = true;
    },
    getExtrasValue(extras) {
      if (extras[0].name === 'bottle') {
        return extras[0].value + ' ml'
      } else if (extras[0].name === 'food') {
        if (extras.length > 1) {
          var text = []
          extras[1].value.forEach(item => {
            text.push(item.name)
          })
          return extras[0].value ? 'Ate ' + extras[0].value + ' <br>' + text.join(", ") : text.join(", ")
        } else {
          return 'N/A'
        }
      } else {
        if (extras.length >= 1) {
          var text = []
          if (Array.isArray(extras[0].value)) {
            extras[0].value.forEach(item => {
              text.push(item)
            })
            return text.join(", ")
          } else {
            return extras[0].value
          }
        } else {
          return 'N/A'
        }
      }
    }
  }
};
</script>

<style scoped>
@import "static/assets/css/pages/timeline-vertical-horizontal.css";
</style>
<style>
.student-detialsbox .activity-left h3 {
  font-size: 16px;
  color: #000;
  margin-bottom: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.activity-left h3 figure {
  width: 30px;
  height: 30px;
  border-radius: 100px;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin: 0 10px 0 0;
}
.activity-left h3 figure img {
  width: 30px;
  height: 30px;
}
.student-detialsbox .activity-left {
  float: left;
  width: 70%;
}
.activity-left .ditailbox {
  float: left;
  width: 100%;
}
.ditailbox .user-name {
  font-size: 14px;
  color: #000;
}
.ditailbox .user-name figure {
  display: inline-block;
  width: 20px;
  border-radius: 20px;
  overflow: hidden;
  height: 20px;
  vertical-align: middle;
  margin: 0 12px 0 8px;
}
.ditailbox .user-name figure img {
  width: 20px;
}
.timeline > li > .timeline-panel {
  width: 48% !important;
  padding: 15px !important;
  margin-left: -18px !important;
}
.student-detialsbox .student-right {
  float: right;
  width: 30%;
}
.student-detialsbox .student-right {
  float: right;
  width: 30%;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 8px;
  background: #7daf52;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.student-detialsbox {
  width: 100%;
  float: left;
}
.student-detialsbox .student-right figure {
  width: 50px;
  margin: 8px auto 20px;
  height: 50px;
  border-radius: 100%;
  overflow: hidden;
}
.student-detialsbox .student-right figure img {
  width: 50px;
  height: 50px;
}
.student-detialsbox .student-right h4 {
  font-size: 16px;
  text-align: center;
  color: #fff;
  line-height: 20px;
  font-weight: 600;
}
ul.gellry-imgbox {
  float: left;
  width: 100%;
  margin-top: 15px;
  position: relative;
}
ul.gellry-imgbox li {
  width: 33%;
  display: inline-block;
  margin: 0 -2px;
}
ul.gellry-imgbox li img {
  width: 100%;
  height: 74px;
  cursor: pointer;
}
li.timeline-inverted .timeline-panel {
  margin-right: -18px !important;
  margin-left: 0 !important;
}
.ditailbox .user-name i {
  margin-left: 8px;
  margin-right: 18px;
  font-size: 16px;
  display: inline-block;
  vertical-align: middle;
}
ul.gellry-imgbox span.length_numb {
  position: absolute;
  top: 0;
  right: 12px;
  width: 77px;
  bottom: 6px;
  background: rgba(255, 255, 255, 0.78);
  text-align: center;
  line-height: 78px;
  font-weight: 600;
  font-size: 18px;
  color: #444;
}
</style>