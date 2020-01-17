<template>
  <div class="row">
    <div class="col s6">
      <div class="card printableArea">
        <div class="card-content">
          <div class="row">
            <div class="col s6 left">
              <address>
                <h5>
                  <b class="red-text">{{ $t('billings.babyAcademy') }}</b>
                </h5>
                <p class="m-l-5">
                  F-1, Soccer House,
                  <br />opp. Castelldefels,
                  <br />Barcelona-1478,
                  <br />Catalonia,
                  <br />Spain
                </p>
              </address>
            </div>
            <div class="col s6 right">
              <div class="right right-align">
                <address>
                  <h5>{{ $t('billings.to') }},</h5>
                  <h5 class="font-bold">Gaala &amp; Sons</h5>
                  <p class="m-l-30">
                    E 101, Peace Villa,
                    <br />Nr. Lords Street,
                    <br />Washington-254865,
                    <br />USA
                  </p>
                </address>
              </div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col left">
              <h5>{{ $t('billings.items') }}</h5>
            </div>
            <div class="col right">
              <h5>{{ $t('billings.amount') }}</h5>
            </div>
          </div>
          <template v-for="(item, i) in invoice.items">
            <div class="row" :key="`prepared_items_${i}`">
              <div class="col left">
                <span>{{item.name}}</span>
              </div>
              <div class="col right">
                <span>{{ parseInt(item.amount).toFixed(2)}}</span>
              </div>
            </div>
            <div class="row" :key="`prepared_items_discount_${i}`">
              <div class="col left">
                <span>{{ $t('billings.discount') }}</span>
              </div>
              <div class="col right">
                <span>- {{ parseInt(item.discount).toFixed(2) }}</span>
              </div>
            </div>
            <hr :key="`prepared_items_hr2_${i}`" />
          </template>
          <div class="row">
            <div class="col left">
              <h5><strong>{{ $t('billings.total') }}</strong></h5>
            </div>
            <div class="col right">
              <h5><strong>{{parseInt(total).toFixed(2)}}</strong></h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col s6">
      <div class="card">
        <div class="card-content">
          <v-list subheader three-line>
            <v-subheader>
              <h4>{{ invoice.students.length }} {{ $t('students_invoiced') }}</h4>
            </v-subheader>
            <transition-group name="fade" tag="div">
              <v-list-tile
                v-for="(student, i) in selected_students"
                :key="`selected_student_${i}`"
                click
                class="student-block"
              >
                <v-list-tile-action>
                  <i
                    class="material-icons remove"
                    @click.prevent="addStudent(student)"
                  >remove_circle</i>
                </v-list-tile-action>

                <v-list-tile-content class="student" @click.prevent="addStudent(student)">
                  <v-list-tile-title>{{student.last_name}} {{student.first_name}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </transition-group>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import MyDate from "~/components/ui/date";

export default {
  name: "PreparedInvoice",
  components: {
    Input,
    MyDate
  },
  props: {
    prepared: Boolean,
    invoice: Object,
    billingItems: Array,
    billingCategories: Array,
    students: Array,
    total: Number
  },
  model: {
    prop: "invoice",
    event: "change"
  },
  mounted() {
    this.students = this.students;
  },

  data: () => ({
    search: "",
    selected_billing_category: [
      {
        items: []
      }
    ]
  }),
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
    },
  },
  methods: {
    addStudent(student) {
      let foundIndex = this.invoice.students.findIndex(el => {
        return el.id == student.id;
      });

      if (foundIndex == -1) {
        this.invoice.students.push({ id: student.id });
      } else {
        this.invoice.students.splice(foundIndex, 1);
      }
      return 0;
    },
    selectCategory(item, i) {
      this.invoice.items.splice(i, 1);
    },
    addNew() {
      this.billingItems.push({
        category: "",
        item: "",
        amount: 0
      });
      this.selected_billing_category.push({ items: [] });
    },
    deleteBilingItem(i) {
      this.billingItems.splice(i, 1);
      this.invoice.items.splice(i, 1);
    },
    selectItem(item, i) {
      this.invoice.items[i] = { item: item.id, discount: 0, notes: "" };
      this.invoice.amounts[i] = item.amount;
      this.billingItems[i].name = item.title;
      this.billingItems[i].amount = item.amount;
    },
    selectAllVisible() {
      let visibleStudents = this.filtered_students;
      for (var i in visibleStudents) {
        this.addStudent(visibleStudents[i]);
      }
    },
    sendInvoice() {
      this.$http
        .post("/billing_invoices/", this.invoice)
        .then(response => {
          if (response.status == 201) {
            // this.$router.push( '/' + this.$i18n.locale + "/billing/invoices");
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