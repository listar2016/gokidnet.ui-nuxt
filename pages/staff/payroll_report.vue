<template>
    <div class="row">
        <div class="col s12">
            <div class="card">
                <div class="card-content">
                    <v-toolbar flat color="white">
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
                                            v-model="datePickerFormattedDate"
                                            label="Month"
                                            prepend-icon="event"
                                            readonly
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker type="month" v-model="date" no-title scrollable
                                               @input="menu2 = false"></v-date-picker>
                            </v-menu>
                        </div>
                    </v-toolbar>
                    <table>
                        <thead>
                        <tr>
                            <th v-for="header in headers"> {{ header.text }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in items">
                            <td class="text-xs-left">
                                <div class="student">
                                    {{ item.name }}
                                </div>
                            </td>
                            <td class="text-xs-left">
                                <div class="student">
                                    {{ item.role ? item.role : 'N/A' }}
                                </div>
                            </td>
                            <td class="text-xs-left">
                                <div class="student">
                                    {{ item.status ? item.status : 'N/A' }}
                                </div>
                            </td>
                            <td class="text-xs-left">
                                <div class="student">
                                    {{ item.payroll ? item.payroll : 'N/A'}}
                                </div>
                            </td>
                            <td class="text-xs-left">
                                <div class="student">
                                    {{ item.amount ? item.amount : '0.00' }}
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="row totals">
                        <div class="col s7 justify-content-end">
                        </div>
                        <div class="col s5 justify-content-end">
                            <div class="row">
                                <div class="col s12">
                                <div class="col s8 right-align">
                                    Total:
                                </div>
                                <div class="col s4 right-align">
                                    {{ total ? total : '0.00' }}
                                </div>
                                <div class="col s8 right-align">
                                    Revenue before payroll:
                                </div>
                                <div class="col s4 right-align">
                                    {{ revenue ? revenue : '0.00' }}
                                </div>
                                <div class="col s8 right-align">
                                    Net revenue:
                                </div>
                                <div class="col s4 right-align">
                                    {{ revenue ? total ? revenue - total : revenue ? revenue : '0.00' : '0.00'}}
                                </div>
                                </div>
                            </div>
                        </div>
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
  import moment from 'moment'
  import JsonExcel from 'vue-json-excel'
  import Print from 'vue-print-nb'

  Vue.use(Print);
  Vue.component('downloadExcel', JsonExcel)
  export default {
    components: {Input, Select},
    data: () => ({
      menu2: false,
      datePickerFormattedDate: moment(new Date()).format('MMMM-YYYY'),
      date: moment(new Date()).format(),
      headers: [
        {text: "Staff name", value: "name"},
        {text: "Role", value: "role"},
        {text: "Status", value: "status"},
        {text: "Payroll", value: "payroll"},
        {text: "Amount", value: "amount"}
      ],
      items: [],
      total: null,
      revenue: null,
      error: false
    }),

    mounted() {
      var payrollJson = {page_size: 50}
      payrollJson.year = moment(this.date).year()
      payrollJson.month = moment(this.date).month() + 1
      this.$http
        .get("/report/room/payroll/", {params: payrollJson})
        .then(response => {
          if (response.data && response.data.payrolls) {
            this.items = response.data.payrolls.items
            this.total = response.data.payrolls.total
            this.revenue = response.data.revenue
          }
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    watch: {
      date(currentdate) {
        this.datePickerFormattedDate = moment(currentdate).format('MMMM-YYYY');
        this.filterData(currentdate)
      },
    },
    methods: {
      filterData(date) {
        var payrollJson = {page_size: 50}
        payrollJson.year = moment(date).year()
        payrollJson.month = moment(date).month() + 1
        this.$http.get("/report/room/payroll/", {params: payrollJson})
          .then(response => {
            if (response.data.payrolls) {
              this.items = response.data.payrolls.items
              this.total = response.data.payrolls.total
              this.revenue = response.data.revenue
            }
          })
          .catch(e => {
            this.$toast.global.error();
            console.log(e);
          });
      }
    }
  };
</script>
<style>
    .select-one {
        width: 30%;
        float: left;
        padding: 0px 29px 0px;
    }

    .file-excel img {
        background-color: #040404;
        cursor: pointer;
    }

    .printBttn button {
        display: inline-flex;
        margin: 0 auto;
        margin-left: -20px;
        cursor: pointer;
    }

    .totals {
        padding-top: 20px;
        font-weight: 600;
    }

    .printBttn button:focus {
        background: none;
    }
</style>