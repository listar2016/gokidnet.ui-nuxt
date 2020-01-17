<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <v-toolbar flat color="white">
            <v-toolbar-title>{{ $t('managements.ageReport') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <download-excel
              class   = "file-excel"
              :data   = this.students
              :fields = "json_fields"
              worksheet = "My Worksheet"
              name  = "student_age_report.xls">
              <img src="/assets/images/excel.png">
              <span class="hide-menu">{{ $t('exportToExcel') }}</span>
            </download-excel>
            <div class="printBttn"><button v-print="'#printMe'"><i class="material-icons">print</i>{{ $t('print') }}</button></div>
          </v-toolbar>
          <div class="row centered">
            <div class="col s10">
              <div class="select-field select-one">
                <v-select
                :label="$t('roomsW')"
                :items="rooms"
                item-text="name"
                item-value="id"
                @change="onRoomChange"
                v-model="roomVal"
                ></v-select>
              </div>
              <div class="select-field select-one">
                <v-select
                :label="$t('status')"
                :items="statuses"
                item-text="name"
                item-value="code"
                v-model="statusVal"
                @change="onStatusChange"
                ></v-select>
              </div>
              <div class="select-one">
                  <v-menu
                    v-model="menu2"
                    lazy
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <v-text-field
                        v-model="date"
                        :label="$t('management.ageAsOf')"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" no-title scrollable @input="menu2 = false"></v-date-picker>
                </v-menu>
                 <!-- <v-date-picker v-model="picker"></v-date-picker> -->
              </div>
            </div>
          </div>
          <div id="printMe">
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
                <!-- <tr class="grey lighten-3">
                  <th
                    v-for="header in props.headers"
                    :key="header.text"
                  >
                    <div v-if="filters.hasOwnProperty(header.value)">
                      <v-select flat hide-details small multiple clearable :items="columnValueList(header.value)" v-model="filters[header.value]" :label="header.value">
                      </v-select>

                    </div>
                  </th>
                </tr> -->
              </template>
              <template slot="items" slot-scope="props">
                <tr>
                    <td class="text-xs-left">
                    <div class="student">
                        {{ props.item.name }}
                    </div>
                    </td>
                    <td class="text-xs-left">{{ props.item.Room?props.item.Room:$t('noInfo') }}</td>
                    <td class="text-xs-left">{{ props.item.status }}</td>
                    <td class="text-xs-left">
                    {{ props.item.birthday | formatDateOnly }}
                    </td>
                    <td class="text-xs-left">
                    {{ props.item.age }}
                    </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Select from "~/components/ui/select";
import Input from "~/components/ui/input";
import * as moment from 'moment';
import JsonExcel from 'vue-json-excel'
import Print from 'vue-print-nb'
export const $t = sign => Vue.prototype.$nuxt.$options.i18n.t(sign);

Vue.use(Print);
Vue.component('downloadExcel', JsonExcel)
export default {
  components: { Input, Select },
  data: () => ({
      date: null,
      // date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
    pagination: {
      sortBy: 'first_name'
    },
    selected: [],
    headers: [
      { text: "Student", value: "name"},
      { text: "Room", value: "Room" },
      { text: "Status", value: "status" },
      { text: "Date of Birth", value: "name", sortable: false, align: "center" },
      { text: "As of", value: "name", sortable: false, align: "center" }
    ],
    filters: {
      Room: [],
      status: [],
    },
    students: [],
    rooms: [],
    statuses: [],
    search: "",
    error: false,
    pagination: {
          ascending: true,
          sortBy:"first_name",
          rowsPerPage: 10,
          page: 1
    },
    picker: new Date().toISOString().substr(0, 10),
    roomVal : '',
    statusVal : '',
    json_fields: {
        'Student': 'name',
        'Room': 'Room',
        'Status': 'status',
        'Date of Birth': 'birthday',
        'Age Of': 'age',
    },
    json_meta: [
      [
          {
              'key': 'charset',
              'value': 'utf-8'
          }
      ]
    ],
  }),
  computed: {
    filteredDesserts() {
      return this.students.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    }
  },
  mounted() {
      let currentDate = moment().format('YYYY-MM-DD')
      let paramVal = { page_size: 50 }
      paramVal.as_of_date=currentDate
      this.$http
      .get("/report/student/by_age/", { params: paramVal })
      .then(response => {
          let studentData = response.data.results
          this.showList(studentData)
      })
      .catch(e => {
          console.log(e.response);
      });
      this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
          this.rooms = response.data.results;
          //console.log(this.rooms)
      })
      .catch(e => {
          console.log(e.response);
      });
      this.$http
      .get("/student_students/statuses/")
      .then(response => {
          this.statuses = response.data.choices
      })
      .catch(e => {
          console.log(e.response);
      });
  },
  watch: {
    date(currentdate) {
      //console.log(currentdate)
      this.filterData(currentdate)
    }
  },
  methods: {
    changeSort (column) {
    if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
    } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
    }
    },
    columnValueList(val) {
    return this.students.map(d => d[val])
    },
    // asDate(birthdate,currentdate){
    //   let asOf = ''
    //   if(birthdate){
    //     let currentDate = moment(currentdate);
    //     let birthDate = moment(birthdate);
    //     let years = currentDate.diff(birthDate, 'year');
    //     birthDate.add(years, 'years');
    //     var months = currentDate.diff(birthDate, 'months');
    //     birthDate.add(months, 'months');
    //     asOf = years+ ' years ' + months + ' months ';
    //     return asOf
    //   }
    //   return asOf
    // },
    showList(studentData) {
      let studentArr = []
      studentData.forEach(data => {
      if(data.room){
          data['Room'] = data.room.title
      }
      else {
        data['Room'] = ''
      }
      // data['ageOf'] = this.asDate(data.birthday,currentDate)
      studentArr.push(data)
      });
      this.students = studentArr;
      //console.log(this.students)
    },
    onRoomChange() {
      this.filterData(this.date)
    },
    onStatusChange() {
      this.filterData(this.date)
    },
    filterData(currentDate) {
      var roomJson = { page_size: 50}
      roomJson.as_of_date=currentDate
      if(this.roomVal){
          roomJson.room = this.roomVal
        }
      if(this.statusVal){
        roomJson.status = this.statusVal
      }
      this.$http
      .get("/report/student/by_age/", { params: roomJson })
      .then(response => {
          let studentData = response.data.results
          this.showList(studentData)
      })
      .catch(e => {
          console.log(e.response);
      });
    }
  }
};
</script>
<style scoped>
.select-one {
    width: 30%;
    float: left;
    padding: 0px 29px 0px;
}
.file-excel img {
    cursor: pointer;
}
.printBttn button {
    display: inline-flex;
    margin: 0 auto;
    margin-left: -20px;
    cursor: pointer;
}
.file-excel span.hide-menu {
    vertical-align: super;
    margin-right: 33px;
    cursor: pointer;
}
.printBttn button i.material-icons {
    padding: 0px 7px 0px 0px;
    cursor: pointer;
}
.printBttn button:focus {
    background: none;
}
</style>
