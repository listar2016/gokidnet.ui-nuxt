<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <nuxt-link
                      to="/staff/new"
                      class="waves-effect waves-light btn indigo"
              >{{ $t('addNew') }}
              </nuxt-link>
            </div>
            <div class="col s10">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
          </div>
          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('title')" prop-name="title" />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('billings.amount')"
                      prop-name="amount"
                      type="number"
                    />
                    <div class="col s12">
                      <v-select
                        v-model="editedItem.category"
                        :reduce="category => category.id"
                        label="title"
                        :options="categories"
                        :placeholder="$t('category')"
                        v-if="categories.length"
                        :class="{invalid: error.category, valid: error !== false}"
                      ></v-select>
                    </div>
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
                  <div
                    v-if="props.item.photo"
                    :style="{'background-image': 'url('+props.item.photo.url+')'}"
                    class="avatar"
                  ></div>
                  <div v-else class="avatar"></div>
                  {{ props.item.last_name }} {{ props.item.first_name }}
                </div>
              </td>
              <td class="text-xs-left">
                {{props.item.email}}
                <br />
                {{props.item.mobile}}
              </td>
              <td class="text-xs-left">{{ $t('noInfo') }}</td>
              <td class="text-xs-left">{{props.item.role}}</td>
              <td class="text-xs-left">{{props.item.status}}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="$router.push( '/staff/' + props.item.id)"
                >edit</v-icon>
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

export default {
  components: { Input },
  data() {
    return {
      headers: [
        { text: this.$t('name'), value: "first_name" },
        { text: this.$t('email') + "/" + this.$t('phone'), value: "email" },
        { text: this.$t('roomsW'), value: "", sortable: false },
        { text: this.$t('role'), value: "role" },
        { text: this.$t('status'), value: "status" },
        { text: this.$t('actions'), value: "name", sortable: false, align: "center" }
      ],
      items: [],
      categories: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        title: "",
        amount: 0,
        category: null
      },
      defaultItem: {
        title: "",
        amount: 0,
        category: null
      },
      dialog: false,
      error: false
    };
  },
  mounted() {
    this.$http
      .get("/staff_staffs/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results;
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
          .delete("/staff_staffs/" + item.id)
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
          .put("/staff_staffs/" + this.editedItem.id + "/", this.editedItem)
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
          .post("/staff_staffs/", this.editedItem)
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