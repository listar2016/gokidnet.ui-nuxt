<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s12">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
          </div>
          <v-data-table :headers="headers" :items="students" :search="search">
            <template v-slot:items="props">
              <tr>
                <td class="text-xs-left">
                  <div class="student">
                    <div
                      v-if="props.item.photo"
                      :style="{'background-image': 'url('+props.item.photo.url+')'}"
                      class="avatar"
                    ></div>
                    <div v-else class="avatar"></div>
                    {{ props.item.fullName }}
                  </div>
                </td>
                <td class="text-xs-left">{{ props.item.status }}</td>
              </tr>
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
import Select from "~/components/ui/select";
import Input from "~/components/ui/input";

export default {
  props: ["room"],
  components: { Input, Select },
  data() {
    return {
      headers: [
        { text: this.$t('rooms.student'), value: "fullName" },
        { text: this.$t('rooms.status'), value: "status" }
      ],
      students: [],
      rooms: [],
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
      error: false
    };
  },
  mounted() {
    this.$http
      .get("/student_students/", {
        params: { page_size: 25, room: this.room }
      })
      .then(response => {
        this.students = response.data.results.map((item) => {
          item.fullName = item.first_name + ' ' + item.last_name
          return item
        });
      })
      .catch(e => {});
    this.$http
      .get("/room_rooms/", { params: { page_size: 25 } })
      .then(response => {
        this.rooms = response.data.results;
      })
      .catch(e => {});
  },
  methods: {
    /*editItem (item) {
		this.editedIndex = this.students.indexOf(item)
		this.editedItem = Object.assign({}, item)
		this.editedItem.room = this.editedItem.room?this.editedItem.room.id:null
		this.dialog = true
	},*/
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
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    }
  }
};
</script>