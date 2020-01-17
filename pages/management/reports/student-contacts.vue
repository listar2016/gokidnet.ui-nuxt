<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <v-toolbar flat color="white">
            <v-toolbar-title>{{ $t('managements.contacts') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <download-excel
              class   = "file-excel"
              :data   = this.students
              :fields = "json_fields"
              worksheet = "My Worksheet"
              name  = "student_contact_report.xls">
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
                :label="$t('managements.studentStatus')"
                :items="statuses"
                item-text="name"
                item-value="code"
                v-model="statusVal"
                @change="onStatusChange"
                ></v-select>
              </div>
              <div class="select-field select-one">
                <v-select
                label="Type of Contact"
                :items="contactType"
                item-text="name"
                item-value="code"
                v-model="typeVal"
                @change="onTypeChange"
                ></v-select>
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
              </template>
              <template slot="items" slot-scope="props">
                  <tr>
                    <td class="text-xs-left">
                      <div class="student">
                        {{ props.item.name }}
                      </div>
                    </td>
                    <td class="text-xs-left">
                      {{ props.item.room && props.item.room.title != null?props.item.room.title:$t('noInfo') }}
                    </td>
                    <td>
                      <span v-for="itemss in props.item.parents" :key="itemss.id">
                        <p>{{itemss.type}}</p>
                      </span>
                    </td>
                    <td>
                      <span v-for="itemss in props.item.parents" :key="itemss.id">
                        <p>{{itemss.name}}</p>
                      </span>
                    </td>
                    <td>
                      <span v-for="itemss in props.item.parents" :key="itemss.id">
                        <p>{{itemss.phone}}</p>
                      </span>
                    </td>
                    <td>
                      <span v-for="itemss in props.item.parents" :key="itemss.id">
                        <p>{{itemss.email}}</p>
                      </span>
                    </td>
                      <!-- <td class="text-xs-left">
                      <div class="student">
                          {{ props.item.name }}
                      </div>
                      </td>
                      <td class="text-xs-left">{{ props.item.room && props.item.room.title != null?props.item.room.title:'NO INFO' }}</td>
                        <span v-for="itemss in props.item.parents" :key="itemss.id">
                          <td class="text-xs-left">{{itemss.type}}</td>
                          <td class="text-xs-left">{{itemss.name}}</td>
                          <td class="text-xs-left">{{itemss.phone}}</td>
                          <td class="text-xs-left">{{itemss.email}}</td>
                        </span> -->
                      <!-- <td class="text-xs-left">{{ props.item.status }}</td>
                      <td class="text-xs-left">
                      {{ props.item.birthday | formatDateOnly }}
                      </td>
                      <td class="text-xs-left">
                      {{ props.item.age }}
                      </td> -->
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
Vue.use(Print);
Vue.component('downloadExcel', JsonExcel)
export default {
  components: { Input, Select },
  data: () => ({
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
    pagination: {
      sortBy: 'name'
    },
    selected: [],
    headers: [
      { text: "Student", value: "name"},
      { text: "Room", value: "Room" },
      { text: "Relationship", value: "status" },
      { text: "Name", value: "name"},
      { text: "Phone", value: "phone"},
      { text: "Email", value: "email"}
    ],
    filters: {
      Room: [],
      status: [],
    },
    students: [],
    rooms: [],
    contactType: [],
    statuses: [],
    search: "",
    error: false,
    pagination: {
          ascending: true,
          sortBy:"name",
          rowsPerPage: 10,
          page: 1
    },
    picker: new Date().toISOString().substr(0, 10),
    roomVal : '',
    statusVal : '',
    typeVal: '',
    json_fields: {
        'Student': 'name',
        'Room': 'Room',
        'Relationship': 'status',
        'Name': 'name',
        'Phone': 'phone',
        'Email': 'email',
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
      //let currentDate = moment().format('YYYY-MM-DD')
      let paramVal = { page_size: 50 }
      //paramVal.as_of_date=currentDate
      this.$http
      .get("/report/student/by_contacts/", { params: paramVal })
      .then(response => {
          let studentData = response.data.results
          this.students = studentData;
          //console.log(this.students)

      })
      .catch(e => {
          console.log(e.response);
      });
      this.$http
      .get("/room_rooms/", { params: { page_size: 25 } })
      .then(response => {
          this.rooms = response.data.results;
          //console.log(this.rooms)
      })
      .catch(e => {
          console.log(e.response);
      });
      this.$http
      .get("/student_students/contact_types/")
      .then(response => {
          this.contactType = response.data.choices
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
    onRoomChange() {
      this.filterData()
    },
    onStatusChange() {
      this.filterData()
    },
    onTypeChange() {
      this.filterData()
    },
    filterData() {
      console.log(this.roomVal +"||"+ this.statusVal +'||'+ this.typeVal)
      var roomJson = { page_size: 50}
      if(this.roomVal){
        roomJson.room = this.roomVal
      }
      if(this.statusVal){
        roomJson.status = this.statusVal
      }
      if(this.typeVal){
        roomJson.contact_type = this.typeVal
      }
      this.$http
      .get("/report/student/by_contacts/", { params: roomJson })
      .then(response => {
          let studentData = response.data.results
          this.students = studentData;
          //console.log(this.students);
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
