<template>
  <div name="fade">
    <div class="row" v-show="!prepared">
      <div class="col m10 s12 offset-m1">
        <div class="card">
          <div class>
            <div class="row">
              <div class="col s3 left">
                <h5 style="padding: 16px 0 0 24px;">{{ $t('billings.editInvoice') }}</h5>
              </div>
              <div class="col s3 right" style="text-align: right;">
                <a
                  class="waves-effect waves-light btn-large indigo"
                  style="font-size: 2em;"
                  @click="prepared = true"
                >{{ $t('next') }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvoiceForm
        :billing-items="billing_items"
        :billing-categories="billing_categories"
        :students="students"
        :selected_billing_category="selected_billing_category"
        :invoice="invoice"
        :rooms="rooms"
        :total="total"
        @changed-total="changeTotal"
      />
    </div>

    <div class="row" v-show="prepared">
      <div class="row">
        <div class="col s8 offset-s2">
          <div class="card">
            <div class>
              <div class="row">
                <div class="col s3 left">
                  <h5 style="padding: 16px 0 0 24px;">{{ $t('billings.confirmAndSend') }}</h5>
                </div>
                <div class="col s5 right" style="text-align: right;">
                  <a
                    class="waves-effect waves-light btn-large orange"
                    style="font-size: 2em;"
                    @click="prepared = false"
                  >{{ $t('back') }}</a>
                  <a
                    class="waves-effect waves-light btn-large indigo"
                    style="font-size: 2em;"
                    @click="sendInvoice"
                  >{{ $t('billings.sendInvoice') }}</a>
                </div>
              </div>
            </div>
          </div>
          <PreparedInvoice
            :invoice="invoice"
            :students="students"
            :billingItems="billing_items"
            :total="total"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import cDate from "~/components/ui/date";
import InvoiceForm from "~/components/billing/invoices/form";
import PreparedInvoice from "~/components/billing/invoices/prepared";
export default {
  name: "editInvoice",
  head: {
    title: $('editInvoice')
  },
  components: {
    Input,
    cDate,
    PreparedInvoice,
    InvoiceForm
  },
  computed: {
    filtered_students() {
      return this.students.filter(item => {
        var text = item.first_name + " " + item.last_name;
        return text.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
      });
    },
    selected_students() {
      return this.students.filter(item => {
        return (
          this.invoice.students.findIndex(x => {
            return x.id == item.id;
          }) !== -1
        );
      });
    }
  },
  mounted() {
    this.$store.commit("user/setTitle", "Edit invoice");

    this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        this.rooms = response.data.results;
      });
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
            this.changeTotal();
          })
          .catch(e => {});
      });

    this.$http
      .get("/student_students/", { params: { page_size: 50 } })
      .then(response => {
        this.students = response.data.results;
      })
      .catch(e => {});
  },

  watch: {
    prepared() {
      this.changeTotal();
    }
  },
  data() {
    return {
      students: [],
      total: 0,
      billing_categories: [],
      selected_billing_category: [
        {
          items: []
        }
      ],
      prepared: false,
      error: "",
      editedItem: "",
      search: "",
      selected_rooms: "",
      rooms: [],
      billing_items: [{ category: "", item: "", amount: "", name: "" }],
      invoice: {
        due_date: "",
        dos_from: "",
        dos_to: "",
        students: [],
        amounts: [],
        notes: [],
        discounts: [],
        items: []
      }
    };
  },
  methods: {
    changeTotal() {
      var sum = {};
      for (var i in this.invoice.items) {
        var item = this.invoice.items[i];
        sum[i] = item.amount - item.discount;
      }
      var total = 0;
      for (var i in sum) {
        total += sum[i];
      }
      this.total = total;
    },
    sendInvoice() {
      var data = { ...this.invoice };
      data.items = this.invoice.items.map(x => {
        return {
          id: x.id,
          discount: x.discount,
          notes: x.notes,
          category: x.category.id
        };
      });
      data.amounts = data.notes = data.discounts = undefined;
      this.$http
        .put(`/billing_invoices/${data.id}/`, data)
        .then(response => {
          if (response.status == 201) {
            this.$router.push( "/billing/invoices");
          }
          this.$toast.global.success();
        })
        .catch(e => {
          this.$toast.global.error();
        });
    }
  }
};
</script>
<style scoped>
/* @import "vuetify/dist/vuetify.min.css"; вот он ломал верстку ъуъ сука */
@import "vue-select/dist/vue-select.css";

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
.date-setttings {
  display: grid;
  height: 100%;
  align-items: center;
}
.student-tile {
  cursor: pointer;
}
</style>