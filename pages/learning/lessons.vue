<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <a class="waves-effect waves-light btn indigo" @click="openDialog">{{ $t('addNew') }}</a>
            </div>
            <div class="col s10">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
          </div>
          <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
            <v-card>
              <v-card-title>
                <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('title')" prop-name="title" />
                    <Select
                      :value="editedItem" :error.sync="error" :name="$t('category')" prop-name="category" :options="categories" label="title"/>
                    <Input :value="editedItem" :error.sync="error" :name="$t('lessons.ageGroupFrom')" prop-name="age_group_start" type="number" />
                    <Input :value="editedItem" :error.sync="error" :name="$t('lessons.ageGroupTo')" prop-name="age_group_end" type="number" />
                    <Select
                      :value="editedItem" :error.sync="error" :name="$t('lessons.duration')" prop-name="duration_start" :options="durations" :reduce="item => item.id" label="text"/>
                    <Select
                      :value="editedItem" :error.sync="error" :name="$t('lessons.site')" prop-name="site" :options="sites" :reduce="item => item.code" label="name"/>
                    <Input :value="editedItem" :error.sync="error" :name="$t('lessons.brief')" prop-name="brief_description" />
                    <Textarea :value="editedItem" :error.sync="error" :name="$t('description')" prop-name="full_description"/>
                  </div>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="close">{{ $t('cancel') }}</v-btn>
                <v-btn color="blue darken-1" flat @click="save">{{ $t('save') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-data-table :headers="headers" :items="items" :search="search">
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.brief_description }}</td>
              <td class="text-xs-left">{{ props.item.age_group_start }}</td>
              <td class="text-xs-left">{{ props.item.age_group_end }}</td>
              <td class="text-xs-left">{{ props.item.site }}</td>
              <td class="text-xs-left">{{ props.item.category?props.item.category.title:$t('noInfo') }}</td>
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
import Input from "~/components/ui/input";
import Select from '~/components/ui/select';
import Textarea from "~/components/ui/textarea";

export default {
  components: { Input, Select, Textarea },
  data() {
    return {
      headers: [
        { text: this.$t('title'), value: "title" },
        { text: this.$t('lessons.brief'), value: "brief_description" },
        { text: this.$t('lessons.ageGroupFrom'), value: "age_group_start" },
        { text: this.$t('lessons.ageGroupTo'), value: "age_group_end" },
        { text: this.$t('lessons.site'), value: "site" },
        { text: this.$t('category'), value: "category.title" },
        { text: this.$t('actions'), value: "name", sortable: false, align: "center" }
      ],
      items: [],
      categories: [],
      sites: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        title: "",
        rooms: [],
        category: null,
        age_group_start: null,
        age_group_end: null,
        duration_start: null,
        site: "",
        brief_description: "",
        full_description: ""
      },
      defaultItem: {
        title: "",
        rooms: [],
        category: null,
        age_group_start: null,
        age_group_end: null,
        duration_start: null,
        site: "",
        brief_description: "",
        full_description: ""
      },
      durations: [
        {id: 15, text: "15 " + this.$t('mins')},
        {id: 30, text: "30 " + this.$t('mins')},
        {id: 45, text: "45 " + this.$t('mins')},
        {id: 60, text: "1 " + this.$t('hour')},
        {id: 75, text: "1 " + this.$t('hour') + " 15 " + this.$t('mins')},
        {id: 90, text: "1 " + this.$t('hour') + " 30 " + this.$t('mins')},
        {id: 105, text: "1 " + this.$t('hour') + " 45 " + this.$t('mins')},
        {id: 120, text: "2 " + this.$t('hours')},
        {id: 135, text: "2 " + this.$t('hours') +  " 15 " + this.$t('mins')},
        {id: 150, text: "2 " + this.$t('hours') + " 30 " + this.$t('mins')},
        {id: 165, text: "2 " + this.$t('hours') + " 45 " + this.$t('mins')},
        {id: 180, text: "3 " + this.$t('hours')},
      ],
      dialog: false,
      error: false
    };
  },
  mounted() {
    this.$http
      .get("/lesson_lessons/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/lesson_categories/", { params: { page_size: 50 } })
      .then(response => {
        this.categories = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/lesson_lessons/sites")
      .then(response => {
        this.sites = response.data.choices;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem.room = this.editedItem.room
        ? this.editedItem.room.id
        : null;
      this.dialog = true;
    },
    deleteItem(item) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/lesson_lessons/" + item.id)
          .then(response => {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$toast.global.success();
          })
          .catch(e => {
            this.$toast.global.error();
          });
      }
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    save() {
      if (this.editedIndex > -1) {
        //запрос на изменение
        this.$http
          .put("/lesson_lessons/" + this.editedItem.id + "/", this.editedItem)
          .then(response => {
            this.items.splice(this.editedIndex, 1, response.data);
            this.close();
            this.$toast.global.success();
            this.error = false;
          })
          .catch(e => {
            this.$toast.global.error();
            this.error = e.response.data;
          });
      } else {
        //запрос на добавление
        this.$http
          .post("/lesson_lessons/", this.editedItem)
          .then(response => {
            this.items.push(response.data);
            this.close();
            this.$toast.global.success();
            this.error = false;
          })
          .catch(e => {
            this.$toast.global.error();
            this.error = e.response.data;
          });
      }
    },
    openDialog() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = true;
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
</style>