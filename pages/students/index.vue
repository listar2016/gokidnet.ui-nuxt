<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <a class="waves-effect waves-light btn indigo" @click="dialog=true">{{ $t('addNew') }}</a>
            </div>
            <div class="col s10">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
              <!-- <div class="select-field">
                <v-select
                label="Room"
                :items="rooms"
                item-text="name"
                item-value="name"
                @change="onRoomChange"
                ></v-select>
              </div>
              <div class="select-field">
                <v-select
                label="Status"
                :items="statuses"
                item-text="code"
                item-value="code"
                @change="onStatusChange"
                ></v-select>
              </div>-->
            </div>
          </div>
          <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
            <v-card>
              <v-card-title>
                <span class="headline">{{ $t('newItem') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Select
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('rooms.room')"
                      prop-name="room"
                      :reduce="room => room.id"
                      :options="rooms"
                    />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('firstName')"
                      prop-name="first_name"
                    />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('lastName')"
                      prop-name="last_name"
                    />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('firstNameArabic')"
                      prop-name="first_name_ar"
                    />
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('lastNameArabic')"
                      prop-name="last_name_ar"
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
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="filteredDesserts"
            :pagination.sync="pagination"
            :search="search"
            select-all
            item-key="name"
            class="elevation-1"
          >
            <template slot="headers" slot-scope="props">
              <tr>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
              <tr class="grey lighten-3">
                <th v-for="header in props.headers" :key="header.text">
                  <div v-if="filters.hasOwnProperty(header.value)">
                    <v-select
                      flat
                      hide-details
                      small
                      multiple
                      clearable
                      :items="columnValueList(header.value)"
                      v-model="filters[header.value]"
                      :label="header.value"
                    ></v-select>
                  </div>
                </th>
              </tr>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td class="text-xs-left">
                  <div class="student">
                    <div
                      v-if="props.item.photo"
                      :style="{'background-image': 'url('+props.item.photo.url+')'}"
                      class="avatar"
                    ></div>
                    <div v-else class="avatar"></div>
                    {{ props.item.first_name }} {{ props.item.last_name }}
                  </div>
                </td>
                <td class="text-xs-left">{{ props.item.room?props.item.Room:$t('noInfo') }}</td>
                <td class="text-xs-left">{{ props.item.status }}</td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="$router.push('/students/'+props.item.id)"
                  >edit</v-icon>
                  <v-icon small @click.stop="deleteItem(props.item)">delete</v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from "~/components/ui/select";
import Input from "~/components/ui/input";

export default {
  components: { Input, Select },
  data() {
    return {
      pagination: {
        sortBy: "first_name"
      },
      selected: [],
      headers: [
        { text: this.$t('rooms.student'), value: "first_name" },
        { text: this.$t('rooms.room'), value: "Room" },
        { text: this.$t('rooms.status'), value: "status" },
        { text: this.$t('actions'), value: "name", sortable: false, align: "center" }
      ],
      filters: {
        Room: [],
        status: []
      },
      students: [],
      rooms: [],
      statuses: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        first_name: "",
        last_name: "",
        first_name_ar: "",
        last_name_ar: "",
        room: null
      },
      defaultItem: {
        first_name: "",
        last_name: "",
        first_name_ar: "",
        last_name_ar: "",
        room: null
      },
      dialog: false,
      error: false,
      pagination: {
        ascending: true,
        sortBy: "first_name",
        rowsPerPage: 25,
        page: 1
      }
    }
  },
  computed: {
    filteredDesserts() {
      return this.students.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f]);
        });
      });
    }
  },
  mounted() {
    if (localStorage.getItem("new") === "true") {
      localStorage.removeItem("new");
      this.dialog = true;
    }
    this.$http
      .get("/student_students/", { params: { page_size: 25 } })
      .then(response => {
        let studentArr = [];
        let studentData = response.data.results;
        studentData.forEach(data => {
          if (data.room) {
            data["Room"] = data.room.name;
            studentArr.push(data);
          }
        });
        //console.log(studentArr)
        this.students = studentArr;
        //console.log(this.students)
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/room_rooms/", { params: { page_size: 25 } })
      .then(response => {
        this.rooms = response.data.results;
      })
      .catch(e => {
        console.log(e.response);
      });
    this.$http
      .get("/student_students/statuses/")
      .then(response => {
        this.statuses = response.data.choices;
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    deleteItem(item) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/student_students/" + item.id)
          .then(response => {
            const index = this.students.indexOf(item);
            this.students.splice(index, 1);
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
      this.error = false;
      //запрос на добавление
      this.$http
        .post("/student_students/", this.editedItem)
        .then(response => {
          this.students.push(response.data);
          this.close();
          this.$toast.global.success();
          this.$router.push("/students/" + response.data.id);
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    },
    onRoomChange(value) {
      this.search = value;
    },
    onStatusChange(value) {
      this.search = value;
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    columnValueList(val) {
      return this.students.map(d => d[val]);
      // if(val == 'room'){ console.log('rooom')
      //   let roomData = []
      //   let data = this.students.map(d => d[val])
      //   Array.from(data).forEach(user => {
      //     if(user != null){
      //       roomData.push(user.name)
      //     }
      //   })
      //   console.log(roomData)
      //   return roomData
      // }
      // else
      // {
      //   //console.log('status')
      //   console.log(this.students.map(d => d[val]))
      //   return this.students.map(d => d[val])
      // }
    }
  }
};
</script>