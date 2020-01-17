<template>
  <div name="fade">
    <div class="row" v-show="!prepared">
      <div class="col m10 s12 offset-m1">
        <div class="card">
          <div class>
            <div class="row">
              <div class="col s3 left">
                <h5 style="padding: 16px 0 0 24px;">{{ $t('billings.newPlan') }}</h5>
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
      <PlansForm
        :billing-items="billing_items"
        :billing-categories="billing_categories"
        :students="students"
        :error="error"
        :invoice="invoice"
        :total="total"
        @changed-total="changeTotal"
        :selected_billing_category="selected_billing_category"
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
          <PreparedPlan :invoice="invoice" :students="students" :billingItems="billing_items" :total="total" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import cDate from "~/components/ui/date";
import PlansForm from "~/components/billing/plans/form";
import PreparedPlan from "~/components/billing/plans/prepared";
export default {
  components: {
    Input,
    cDate,
    PlansForm,
    PreparedPlan
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
    this.$http
      .get("/student_students/", { params: { page_size: 50 } })
      .then(response => {
        this.students = response.data.results;
      })
      .catch(e => {});
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
      prepared: false,
      error: false,
      search: "",
      billing_items: [{ category: "", item: "", amount: "", name: "" }],
      invoice: {
        for_period: "",
        due_on: "",
        type: "",
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

  watch: {
    prepared() {
      this.changeTotal();
    }
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
      this.$http
        .post("/billing_recurring_plans/", this.invoice)
        .then(response => {
          if (response.status == 201) {
            this.$router.push("/billing/invoices");
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