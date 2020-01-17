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
          <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog">
            <v-card>
              <v-card-title>
                <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('name')" prop-name="name" />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('billings.amount')"
                      prop-name="amount"
                      type="number"
                    />
                    <Select
                      :value="editedItem"
                      :error.sync="error"
                      :reduce="status => status.code"
                      :options="statuses"
                      label="name"
                      :name="$t('status')"
                      prop-name="status"
                    />
                    <Select
                      :value="editedItem"
                      :error.sync="error"
                      :reduce="type => type.code"
                      :options="types"
                      label="name"
                      :name="$t('category')"
                      prop-name="type"
                    />
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
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.created_date }}</td>
              <td class="text-xs-left">{{ props.item.modified_date }}</td>
              <td class="text-xs-left">{{ props.item.type }}</td>
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
              >{{ rooms.yourSearch }} "{{ search }}" {{ rooms.foundNoResults }}.</v-alert>
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
        { text: this.$t('name'), value: "first_name" },
        { text: this.$t('dateCreated'), value: "created_date" },
        { text: this.$t('dateModified'), value: "modified_date" },
        { text: this.$t('type'), value: "type" },
        { text: this.$t('status'), value: "status" },
        { text: this.$t('actions'), sortable: false, align: "center" }
      ],
      items: [],
      categories: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        name: "",
        amount: null,
        type: "",
        status: ""
      },
      defaultItem: {
        name: "",
        amount: null,
        type: "",
        status: ""
      },
      dialog: false,
      error: false,

      statuses: [],
      types: []
    };
  },
  mounted() {
    this.$http
      .get("/staff_payrolls/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/staff_payrolls/statuses", { params: { page_size: 50 } })
      .then(response => {
        this.statuses = response.data.choices;
        this.defaultItem.status = response.data.default;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/staff_payrolls/types", { params: { page_size: 50 } })
      .then(response => {
        this.types = response.data.choices;
        this.defaultItem.type = response.data.default;
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
          .delete("/staff_payrolls/" + item.id)
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
          .put("/staff_payrolls/" + this.editedItem.id + "/", this.editedItem)
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
          .post("/staff_payrolls/", this.editedItem)
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