<template>
  <div class="row">
    <!-- <div class="col s10 offset-s1">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <nuxt-link to="invoices/new">
                <a class="waves-effect waves-light btn indigo" @click="openDialog">{{ $t('addNew') }}</a>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>-->

    <!-- <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
      <v-card>
        <v-card-title>
          <span class="headline">{{itemDetail.title}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h5 class="valign-wrapper">
              Internal Only:
              <label>
                <input type="checkbox" disabled="disabled" v-model="itemDetail.internal_only" />
                <span></span>
              </label>
            </h5>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="btn blue darken-1" @click="dialog=false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>-->

    <div class="col s10 offset-s1">
      <transition-group name="list-complete" tag="div" class="row">
        <div
          v-for="item in items"
          :key="item.id"
          @click="openDialog(item)"
          class="col s3 list-complete-item"
        >
          <div class="card card-hover">
            <div class="card-content">
              <div class="d-flex no-block align-items-center valign-wrapper">
                <div>
                  <h5 class="m-b-0">{{item.title}}</h5>
                  <h6 class="font-medium m-b-0">
                    <!-- <span
                      :class="!item.internal_only ? 'red-text' : 'green-text'"
                    >{{item.internal_only ? "YES" : "NO"}}</span>-->
                    <v-switch
                      :label="$t('internalOnly')"
                      v-model="item.internal_only"
                      @change="internalOnly(item)"
                    ></v-switch>
                  </h6>
                  <input type="checkbox" />
                </div>
                <div class="right-align">
                  <span class="blue-text display-6">
                    <img :src="item.icon" alt width="50px" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [],
      dialog: false,
      itemDetail: {}
    };
  },
  mounted() {
    this.$http.get("/activity_activities/").then(response => {
      this.items = response.data.results;
      console.log(this.items);
    });
  },
  methods: {
    openDialog(item) {
      this.dialog = true;
      this.itemDetail = item;
    },
    internalOnly(item) {
      this.$http
        .patch("/activity_activities/" + item.id + "/", {
          internal_only: item.internal_only
        })
        .then(response => {
          if (response.status == 200) {
            this.$toast.global.success();
          }
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    close() {
      this.dialog = false;
    }
  }
};
</script>
<style scoped>
.list-complete-item {
  transition: all 0.5s;
  /* display: inline-block; */
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>