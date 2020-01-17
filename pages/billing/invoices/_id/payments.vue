<template>
  <div class="row">
    <div class="col s6">
      <Info :invoice="invoice" :total="invoice.total" />
    </div>
    <div class="col s6">
      <div class="row">
          <div class="col m3">
            <a :disabled="invoice.total - invoice.paid <= 0" class="waves-effect waves-light btn indigo" @click="openDialog">{{ $t('billings.addTransaction')}}</a>
          </div>
          <div class="col m9">
            <h3>{{ $t('Amount Due') }}: {{ invoice.total - invoice.paid }}</h3>
          </div>
      </div>
      <div class="row">
          <Transaction @refund="refund" @edit="editItem" v-for="transaction in transactions" :key="transaction.id" :data="transaction" />
      </div>
    </div>
    <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
        <v-card>
            <v-card-title>
            <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit')}}</span>
            </v-card-title>
            <v-card-text>
            <v-container grid-list-md>
                <div class="row">
                    <Input :value="editedItem" :error.sync="error" :name="$t('billings.amount')" prop-name="amount" type="number" />
                    <Select
                        :value="editedItem" :error.sync="error" :name="$t('billings.paymentMethod')" prop-name="method" :options="methods" label="name" :reduce="item => item.code"/>
                    <MyDate :value="editedItem" :error.sync="error" :name="$t('billings.paymentDate')" prop-name="transaction_date" />
                    <Textarea :value="editedItem" :error.sync="error" :name="$t('billings.notes')" prop-name="note"/>
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
  </div>
</template>
<script>
import Info from "~/components/billing/invoices/info";
import Transaction from "~/components/billing/invoices/transaction";
import Input from "~/components/ui/input";
import Textarea from "~/components/ui/textarea";
import Select from "~/components/ui/select";
import MyDate from "~/components/ui/date";

export default {
  components: {
    Info,
    Transaction,
    Input,
    Textarea,
    Select,
    MyDate
  },
  data: () => ({
    invoice: {},
    transactions: [],
    methods: [],
    dialog: false,
    error: false,
    editedIndex: -1,
    editedItem: {
      invoice: 0,
      note: "",
      amount: 0,
      refund: false,
      refunded: null,
      transaction_date: null,
      method: ""
    },
    defaultItem: {
      invoice: 0,
      note: "",
      amount: 0,
      refund: false,
      refunded: null,
      transaction_date: null,
      method: ""
    }
  }),
  mounted() {
      this.defaultItem.invoice = this.$route.params.id
      this.editedItem.invoice = this.$route.params.id
    this.$http.get('/billing_transactions/', { params: { invoice: this.$route.params.id } })
      .then(response => {
          this.transactions = response.data.results
        for (const transaction of this.transactions) {
          if (transaction.amount < 0) {
            this.refunded = true
          }
        }
      })
    this.$http.get('/billing_transactions/methods/')
      .then(response => {
          this.methods = response.data.choices
      })
    this.$http
      .get("/billing_invoices/" + this.$route.params.id)
      .then(response => {
        this.invoice = { ...this.invoice, ...response.data };
        this.billing_items = this.invoice.items.map(item => {
          return { category: item.category.id, item: item.item.id };
        });
        return this.billing_items;
      })
      .then(billing_items => {
        this.$http
          .get("/billing_items/", { params: { page_size: 50 } })
          .then(response => {
            for (var i in response.data.results) {
              let item = response.data.results[i];
              let foundIndex = this.billing_categories.findIndex(category => {
                return category.id == item.category.id;
              });
              if (foundIndex !== -1) {
                this.billing_categories[foundIndex].items.push(item);
              } else {
                this.billing_categories.push({
                  ...item.category,
                  items: [item]
                });
              }
            }
            return {
              categories: this.billing_categories,
              billing_items: billing_items
            };
          })
          .then(items => {
            this.selected_billing_category = [];
            for (var i in items.billing_items) {
              var billing_item = items.billing_items[i];
              this.selected_billing_category.push(
                items.categories.find(x => {
                  return x.id == billing_item.category;
                })
              );
            }
          })
          .catch(e => {});
      });
  },
  methods: {
    refund(item) {
      if(!confirm(this.$t('billings.quizRefund')))
        return;
      this.editedIndex = -1;
      this.editedItem = Object.assign(this.defaultItem, item);
      this.editedItem.refund = true
      debugger
      this.editedItem.refunded = this.editedItem.id
      this.save()
    },
    editItem(item) {
      this.editedIndex = this.transactions.indexOf(item);
      this.editedItem = Object.assign(this.defaultItem, item);
      this.dialog = true;
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
          .put("/billing_transactions/" + this.editedItem.id + "/", this.editedItem)
          .then(response => {
            this.invoice.paid = parseFloat(this.invoice.paid) - parseFloat(this.transactions[this.editedIndex].amount) + parseFloat(response.data.amount)
            this.transactions.splice(this.editedIndex, 1, response.data);
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
          .post("/billing_transactions/", this.editedItem)
          .then(response => {
            this.transactions.splice(0, 0, response.data);
            this.close();
            this.$toast.global.success();
            this.error = false;
            this.invoice.paid = parseFloat(this.invoice.paid) + parseFloat(response.data.amount)
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
<style scoped>
.date-header {
  margin: 10px 0 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.remove {
  font-size: 26pt;
  color: #fff;
  background-color: rgb(230, 54, 54);
  padding: 0 0.2em;
  border-radius: 0.1em;
  transition: 0.3s;
  /* width: 0%; */
}
.remove:hover {
  cursor: pointer;
}
.student-block:hover .student {
  margin-left: 0px;
  transition: 0.4s;
}
.student {
  margin-left: -60px;
  padding-left: 1em;
  background-color: #fff;
  transition: 0.4s;
  /* transition-delay: 2s; */
}

input[type="text"]:not(.browser-default)[readonly="readonly"] {
  border-bottom: 1px dotted transparent;
}
</style>
