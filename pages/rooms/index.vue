<template>
  <div class="row">
    <div class="col s12">
      <div class="card elevation-4">
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
          <v-dialog persistent v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">
                  {{
                  editedIndex == -1 ? $t('newItem') : $t('edit')
                  }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('name')" prop-name="name" />
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
              <td class="text-xs-left">{{ props.item.students_count }}</td>
              <td class="text-xs-left">{{ props.item.teachers_count }}</td>
              <td class="text-xs-left">{{ ratio(props.item) }}</td>
              <td class="justify-center layout px-0">
                <v-icon
                  small
                  class="mr-2"
                  @click="$router.push( '/rooms/' + props.item.id)"
                >remove_red_eye</v-icon>
                <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click.stop="deleteItem(props.item)">delete</v-icon>
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
        { text: this.$t('name'), value: "name" },
        { text: this.$t('students'), value: "students_count" },
        { text: this.$t('teachers'), value: "teachers_count" },
        { text: this.$t('ratio'), sortable: "false", sortable: false },
        { text: this.$t('actions'), value: "name", sortable: false, align: "center" }
      ],
      items: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        name: ""
      },
      defaultItem: {
        name: ""
      },
      dialog: false,
      error: false
    };
  },
  mounted() {
    this.$http
      .get("/room_rooms/", { params: { page_size: 25 } })
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
          .delete("/room_rooms/" + item.id)
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
          .put("/room_rooms/" + this.editedItem.id + "/", this.editedItem)
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
          .post("/room_rooms/", this.editedItem)
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
  },
  computed: {
    ratio() {
      return item => {
        if (item.teachers_count == 0) {
          return this.$t('noInfo');
        }
        return "1:" + (item.students_count / item.teachers_count).toFixed(2);
      };
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
</style>
