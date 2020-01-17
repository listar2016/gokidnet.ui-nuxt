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
                        name="Category"
                        :items="categories"
                        :label="$t('category')"
                        item-text="title"
                        :clearable="true"
                        :return-object="true"
                      />
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
              <td class="text-xs-left">{{ props.item.title }}</td>
              <td class="text-xs-left">{{ props.item.category?props.item.category.title:$t('noInfo') }}</td>
              <td class="text-xs-left">{{ props.item.amount }}</td>
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
import Select from "~/components/ui/select";

export default {
  components: { Input, Select },
  data() {
    return {
      headers: [
        { text: this.$t('item'), value: "title" },
        { text: this.$t('category'), value: "category.title" },
        { text: this.$t('billings.amount'), value: "amount" },
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
      .get("/billing_items/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/billing_categories/", { params: { page_size: 25 } })
      .then(response => {
        this.categories = response.data.results;
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
          .delete("/billing_items/" + item.id)
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
          .put("/billing_items/" + this.editedItem.id + "/", this.editedItem)
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
          .post("/billing_items/", this.editedItem)
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