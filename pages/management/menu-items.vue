<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <a class="waves-effect waves-light btn indigo" @click="openDialog">{{ $t('addNew') }}</a>
            </div>
            <div class="col s5">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
            <div class="col s5">
                <vue-select v-model="category"
                    :reduce="item => item.code"
                    label="name"
                    :options="categories"
                    :placeholder="$t('category')"
                    style="margin-top: 26px"
                    @input="getItems" />
            </div>
          </div>
          <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
            <v-card>
              <ImageUpload :value.sync="editedItem" prop-name="image" />
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('name')" prop-name="name" />
                    <Select
                      :value="editedItem" :error.sync="error" :name="$t('category')" prop-name="category" :options="categories" label="name" :reduce="item => item.code"/>
                    <Textarea :value="editedItem" :error.sync="error" :name="$t('description')" prop-name="description"/>
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
              <td class="text-xs-left">
                  <div class="student">
                      <div v-if="props.item.image" :style="{'background-image': 'url('+props.item.image.url+')'}" class="avatar"></div>
                      <div v-else class="avatar"></div>
                      {{ props.item.name }}
                  </div>
              </td>
              <td class="text-xs-left">{{ props.item.category }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
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
import ImageUpload from '~/components/ui/image';
import Textarea from "~/components/ui/textarea";

export default {
  components: { Input, Select, ImageUpload, Textarea },
  data() {
    return {
      headers: [
        { text: this.$t('name'), value: "name" },
        { text: this.$t('category'), value: "category" },
        { text: this.$t('description'), value: "description" },
        { text: this.$t('actions'), value: "name", sortable: false, align: "center" }
      ],
      items: [],
      categories: [],
      category: null,
      sites: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        name: "",
        category: null,
        description: "",
        image: ""
      },
      defaultItem: {
        name: "",
        category: null,
        description: "",
        image: ""
      },
      dialog: false,
      error: false
    };
  },
  mounted() {
    this.getItems()
    this.$http
      .get("/school_mealitems/categories/")
      .then(response => {
        this.categories = response.data.choices;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    getItems() {
        this.$http
        .get("/school_mealitems/", { params: { page_size: 50, category: this.category } })
        .then(response => {
            this.items = response.data.results;
        })
        .catch(e => {
            console.log(e.response);
        });
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/school_mealitems/" + item.id)
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
          .put("/school_mealitems/" + this.editedItem.id + "/", this.editedItem)
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
          .post("/school_mealitems/", this.editedItem)
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