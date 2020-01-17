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

          <table class="table-section-bordered">
            <thead>
            <tr>
              <th> {{ $t('type') }} </th>
              <th> {{ $t('description') }} </th>
              <th class="text-xs-center"> {{ $t('billings.amount') }} </th>
            </tr>
            </thead>

            <invoiceTreeTable :name="'Credits'" :item="credits"></invoiceTreeTable>
            <invoiceTreeTable :name="'Debits'" :item="debits"></invoiceTreeTable>
            <tfoot>
            <tr>
              <th class="text-xs-left">Net Revenue</th>
              <th class="text-xs-left"/>
              <th class="text-xs-center">{{ net_revenue ? net_revenue : '0.00' }}</th>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Select from "~/components/ui/select";
  import Input from "~/components/ui/input";
  import invoiceTreeTable from "~/components/billing/invoices/invoice-tree-table";
  import moment from 'moment'
  import JsonExcel from 'vue-json-excel'
  import Print from 'vue-print-nb'

  Vue.use(Print);
  Vue.component('downloadExcel', JsonExcel)
  export default {
    components: {Input, Select, invoiceTreeTable},
    data: () => ({
      loading: false,
      menu2: false,
      datePickerFormattedDate: moment(new Date()).format('MMMM-YYYY'),
      date: moment(new Date()).format(),
      credits: {},
      debits: {},
      net_revenue: null,
      revenue: null,
      error: false
    }),

    mounted() {
      this.loading = true;
      var payrollJson = {page_size: 50}
      payrollJson.year = moment(this.date).year()
      payrollJson.month = moment(this.date).month() + 1
      this.$http.get("/report/room/invoices/", {params: payrollJson})
              .then(response => {
                if (response.data) {
                  this.credits = response.data.credits
                  this.debits = response.data.debits
                  this.net_revenue = response.data.net_revenue
                }
                this.loading = false;
              })
              .catch(e => {
                console.log(e.response);
                this.loading = false;
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
        this.loading = true;
        var payrollJson = {page_size: 50}
        payrollJson.year = moment(date).year()
        payrollJson.month = moment(date).month() + 1
        this.$http.get("/report/room/invoices/", {params: payrollJson})
                .then(response => {
                  if (response.data) {
                    this.credits = response.data.credits
                    this.debits = response.data.debits
                    this.net_revenue = response.data.net_revenue
                  }
                  this.loading = false;
                })
                .catch(e => {
                  console.log(e.response);
                  this.loading = false;
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
  .table-section-bordered thead{
    border-bottom:1px solid rgba(0, 0, 0, 0.7);
  }
  .table-section-bordered thead th{
    font-size: 1.2rem;
    font-weight: normal;
  }
  .table-section-bordered tbody th, .table-section-bordered tfoot th{
    font-size: 1.4rem;
    font-weight: normal;
  }
  .table-section-bordered tbody{
      border-bottom:1px solid rgba(0, 0, 0, 0.12);
    }
  .table-section-bordered tr{
    border:none;
  }
  .table-section-bordered td, .table-section-bordered th{
    padding: 8px 5px;
  }
  .table-section-bordered tr.depth-3 td{
    font-size: 0.9rem;
  }
  .totals {
    padding-top: 20px;
    font-weight: 600;
  }
</style>