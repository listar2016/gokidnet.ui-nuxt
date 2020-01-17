<template>
  <div name="fade">
    <div class="row" v-show="!prepared">
      <div class="col m10 s12 offset-m1">
        <div class="card">
          <div class>
            <div class="row">
              <div class="col s3 left">
                <h5 style="padding: 16px 0 0 24px;">{{ $t('billings.newInvoice') }}</h5>
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
        :rooms="rooms"
        :invoice="invoice"
        :selected_billing_category="selected_billing_category"
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
                  <button id="myBtn"
                    class="waves-effect waves-light btn-large indigo"
                    style="font-size: 2em;"
                    @click="sendInvoice"
                  >{{ $t('sendInvoice') }}</button>
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
  components: {
    Input,
    cDate,
    PreparedInvoice,
    InvoiceForm
  },

  mounted() {
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
            this.billing_categories.push({ ...item.category, items: [item] });
          }
        }
      })
      .catch(e => {});
    this.$http.get("/student_students/", { params: { status: 'ACTIVE' } })
      .then(response => {
        this.students = response.data.results;
      })
      .catch(e => {});
    this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        this.rooms = response.data.results;
      });
  },
  watch: {
    prepared() {
      this.changeTotal();
    }
  },
  data() {
    return {
      total: 0,
      students: [],
      billing_categories: [],
      selected_billing_category: [
        {
          items: []
        }
      ],
      rooms: [],
      prepared: false,
      error: false,
      search: "",
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
      document.getElementById("myBtn").disabled = true;
      this.$http
        .post("/billing_invoices/", this.invoice)
        .then(response => {
          if (response.status === 201) {
            document.getElementById("myBtn").disabled = false;
            this.$router.push( "/billing/plans");
          }
          this.$toast.global.success();
          document.getElementById("myBtn").disabled = false;
        })
        .catch(e => {
          this.$toast.global.error();
          document.getElementById("myBtn").disabled = false;
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