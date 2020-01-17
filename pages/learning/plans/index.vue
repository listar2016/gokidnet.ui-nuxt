<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <nuxt-link
                to="plans/new"
                class="waves-effect waves-light btn indigo"
              >{{ $t('addNew') }}</nuxt-link>
            </div>
            <div class="col s5">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
            <div class="col s5">
              <vue-select
                v-model="selected_rooms"
                class="multiply"
                :reduce="item => item.id"
                label="name"
                :options="rooms"
                :placeholder="$t('billings.rooms_groups')"
                multiple
                style="margin-top: 26px"
                @input="getItems"
              />
            </div>
          </div>
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.active_from }}</td>
              <td class="text-xs-left">{{ props.item.active_to }}</td>
              <td class="text-xs-left">{{ props.item.rooms.map(a => a.name).join(', ') }}</td>
              <td class="text-xs-left">{{ props.item.status }}</td>
              <td class="justify-center layout px-0">
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >{{ $t('rooms.yourSearch') }} "{{ search }}" {{ $t('rooms.foundNoResults') }}.</v-alert>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: this.$t('title'), value: "title" },
        { text: this.$t('lessons.activeFrom'), value: "active_from" },
        { text: this.$t('lessons.expiresOn'), value: "active_to" },
        { text: this.$t('billings.rooms_groups'), sortable: false },
        { text: this.$t('status'), value: "status" },
        { text: this.$t('actions'), sortable: false }
      ],
      items: [],
      statuses: [],
      search: "",
      rooms: [],
      selected_rooms: [],
      error: false
    };
  },
  mounted() {
    this.getItems();
    this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        this.rooms = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    getItems() {
      this.$http
        .get("/lesson_plans/", {
          params: { page_size: 25, rooms: this.selected_rooms.join(",") }
        })
        .then(response => {
          this.items = response.data.results;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    editItem(item) {
      this.$router.push( "/learning/plans/" + item.id);
    },
    deleteItem(item) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/lesson_plans/" + item.id)
          .then(response => {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$toast.global.success();
          })
          .catch(e => {
            this.$toast.global.error();
          });
      }
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
</style>