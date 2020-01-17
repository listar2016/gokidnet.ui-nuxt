<template>
  <div>
    <div class="col m10 s12 offset-m1">
      <div class="row valign-wrapper">
        <div class="col m6 s12">
          <div class="card">
            <div class="card-content">
              <div class>
                <div class="row">
                  <div class="col s6">
                    <div class="m-t-40">
                      <v-select
                        item-text="name"
                        item-value="code"
                        :items="typeItems"
                        v-model="invoice.type"
                        :label="$t('type')"
                      ></v-select>
                      <span
                        class="helper-text"
                        v-if="error !== false"
                        :data-error="error['type'] ? error['type'] : ''"
                        :data-success="$t('billing.plans.allRight')"
                      ></span>
                    </div>
                  </div>
                  <div class="col s6">
                    <div class="m-t-40">
                      <v-select
                        item-text="name"
                        item-value="code"
                        :items="dueOnItems"
                        v-model="invoice.due_on"
                        :label="$t('billings.dueOn')"
                      ></v-select>
                      <span
                        class="helper-text"
                        v-if="error !== false"
                        :data-error="error['due_on'] ? error['due_on'] : ''"
                        :data-success="$t('billings.allRight')"
                      ></span>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <div class="col s6">
                    <div class="m-t-40">
                      <MyDate
                        :value="invoice"
                        propName="plan_from"
                        :error.sync="error"
                        :name="$t('billings.planStartDate')"
                      />
                    </div>
                  </div>
                  <div class="col s6">
                    <div class="m-t-40">
                      <MyDate
                        :value="invoice"
                        propName="plan_to"
                        :error.sync="error"
                        :name="$t('billings.planEndDate')"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col s6">
                    <div class="m-t-40">
                      <input
                        :value="invoice"
                        prop-name="notify_before_days"
                        :error="error"
                        :name="$t('billings.notifyDays')"
                        type="number"
                        :placeholder="$t('billings.notifyDays')"
                      />
                      <span
                        class="helper-text"
                        v-if="error !== false"
                        :data-error="error['notify_before_days'] ? error['notify_before_days'] : ''"
                        :data-success="$t('billings.allRight')"
                      ></span>
                    </div>
                  </div>

                  <div class="col s6">
                    <div class="m-t-30">
                      <v-select
                        :items="periodItems"
                        item-text="name"
                        item-value="code"
                        v-model="invoice.for_period"
                        :label="$t('billings.invoiceSent')"
                      ></v-select>
                      <span
                        class="helper-text"
                        v-if="error !== false"
                        :data-error="error['for_period'] ? error['for_period'] : ''"
                        :data-success="$t('billings.allRight')"
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col m6 s12">
          <div class="card">
            <div class="card-content p-b-0">
              <div class="row valign-wrapper">
                <div class="col s12 m4">
                  <v-list-tile-action style="padding-left: 16px;">
                    <v-checkbox :label="$t('selectAll')" @change="selectAllVisible"></v-checkbox>
                  </v-list-tile-action>
                </div>
                <div class="col s6 m4">
                  <v-subheader class="input-field">
                    <input id="search" type="text" v-model="search" />
                    <label for="search" style="margin-left: 1em;">{{ $t('search') }}</label>
                  </v-subheader>
                </div>
                <div class="col s6 m4">
                  <v-subheader class="input-field">
                    <v-select
                      v-model="rooms_filter"
                      :label="$t('name')"
                      item-text="name"
                      :items="rooms"
                      :clearable="true"
                      :return-object="true"
                      :placeholder="$t('billings.rooms_groups)')"
                    />
                  </v-subheader>
                </div>
              </div>
            </div>
            <div class="card-content p-t-0" style="overflow-x: scroll; height: 532px;">
              <div class="row">
                <div class="col s12">
                  <v-list subheader three-line>
                    <transition-group name="fade" tag="div">
                      <v-list-tile
                        v-for="(student, i) in filtered_students"
                        :style="{transitionDelay: `${(i+1) * 0.05}s`}"
                        :key="`student_${i}`"
                        class="student-tile"
                        click
                      >
                        <v-list-tile-action>
                          <v-checkbox
                            :value="invoice.students.findIndex(el => { return el.id == (student.id)}) !== -1"
                            @change="addStudent(student)"
                          ></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content @click.prevent="addStudent(student)">
                          <v-list-tile-title>{{student.last_name}} {{student.first_name}}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </transition-group>
                  </v-list>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col s10 offset-s1">
      <div class="card">
        <div class="card-content">
          <div
            class="row"
            v-for="(item, i) in selected_billing_category"
            :key="`billing_item_${i}`"
          >
            <div class="col s2">
              <v-select
                item-text="title"
                :items="billingCategories"
                v-model="selected_billing_category[i]"
                :return-object="true"
                :label="$t('title')"
                :placeholder="$t('category')"
                @input="selectCategory($event, i)"
              />
              <!-- <vue-select
                v-model="selected_billing_category[i]"
                :reduce="item => item"
                :key="selected_billing_category.length"
                label="title"
                :options="billingCategories"
                placeholder="Category"
                style="margin-top: 21px"
                @input="selectCategory($event, i)"
              />-->
            </div>
            <div class="col s2">
              <v-select
                v-model="invoice.items[i]"
                item-text="title"
                :label="$t('title')"
                :return-object="true"
                :items="selected_billing_category[i].items"
                :placeholder="$t('item')"
                @input="selectItem($event, i)"
              />
            </div>
            <div class="col s2">
              <transition name="fade">
                <div class="col s12" :style="{transitionDelay: `${0.3}s`}" v-if="invoice.items[i]">
                  <div class="input-field" v-if="typeof invoice.items[i].item !== 'number'">
                    <input v-model="invoice.items[i].item.amount" placeholder="Amount" readonly />
                    <label class="active">{{ $t('billings.amount') }}</label>
                  </div>
                  <div class="input-field" v-else>
                    <input v-model="invoice.items[i].amount" placeholder="Amount" readonly />
                    <label class="active">{{ $t('billings.amount') }}</label>
                  </div>
                </div>
              </transition>
            </div>
            <div class="col s2">
              <transition name="fade">
                <div class="col s12" v-if="invoice.items[i]" :style="{transitionDelay: `${0.6}s`}">
                  <div class="input-field">
                    <input
                      v-model="invoice.items[i].discount"
                      :placeholder="$t('billings.discount')"
                      @input="changeTotal"
                    />
                    <label class="active">{{ $t('billings.discount') }}</label>
                  </div>
                </div>
              </transition>
            </div>
            <div class="col s2">
              <transition name="fade">
                <div class="col s12" v-if="invoice.items[i]" :style="{transitionDelay: `${0.9}s`}">
                  <div class="input-field">
                    <input v-model="invoice.items[i].notes" :placeholder="$t('billings.notes')" />
                    <label class="active">{{ $t('billings.notes') }}</label>
                  </div>
                </div>
              </transition>
            </div>

            <div class="col s2">
              <div class="mt-4"></div>
              <transition name="fade">
                <a
                  class="waves-effect waves-light btn red"
                  v-if="invoice.items[i]"
                  :style="{transitionDelay: `${1.2}s`}"
                  @click="deleteBilingItem(i)"
                >{{ $t('delete') }}</a>
              </transition>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col s2 right">
              <h5>{{ $t('billings.total') }}: {{ total }}</h5>
            </div>
            <div class="col s1 left">
              <a class="waves-effect waves-light btn indigo" @click="addNew">{{ $t('addNew') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Input from "~/components/ui/input";
import MyDate from "~/components/ui/date";

export default {
  name: "PlansForm",
  components: {
    Input,
    MyDate
  },
  props: {
    total: [Number],
    error: [Boolean, Object, Array],
    prepared: Boolean,
    invoice: Object,
    billingItems: Array,
    billingCategories: Array,
    students: Array,
    selected_billing_category: Array
  },
  model: {
    prop: "invoice",
    event: "change"
  },
  mounted() {
    this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        this.rooms = response.data.results;
      });
    this.$http.get("/billing_recurring_plans/periods/").then(response => {
      this.periodItems = response.data.choices;
      this.invoice.for_period = this.invoice.for_period
        ? this.invoice.for_period
        : response.data.default;
    });
    this.$http.get("/billing_recurring_plans/due_ons/").then(response => {
      this.dueOnItems = response.data.choices;
      this.invoice.due_on = this.invoice.due_on
        ? this.invoice.due_on
        : response.data.default;
    });
    this.$http.get("/billing_recurring_plans/types/").then(response => {
      this.typeItems = response.data.choices;
      this.invoice.type = this.invoice.type
        ? this.invoice.type
        : response.data.default;
    });
  },
  data: () => ({
    dueOnItems: [],
    typeItems: [],
    periodItems: [],
    search: "",
    rooms_filter: "",
    rooms: []
  }),
  computed: {
    filtered_students() {
      return this.students.filter(item => {
        var text = item.first_name + " " + item.last_name;
        var filtered_room = this.rooms_filter
          ? item.room.id == this.rooms_filter
          : true;
        return (
          text.toLowerCase().indexOf(this.search.toLowerCase()) !== -1 &&
          filtered_room
        );
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
  methods: {
    changeTotal() {
      this.$emit("changed-total");
    },
    addStudent(student) {
      let foundIndex = this.invoice.students.findIndex(el => {
        return el.id == student.id;
      });

      if (foundIndex == -1) {
        this.invoice.students.push({ id: student.id });
      } else {
        console.info("Index founded " + foundIndex);
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
      this.invoice.items[i] = {
        item: item.id,
        discount: 0,
        notes: "",
        amount: item.amount,
        name: item.title,
        title: item.title
      };
      this.invoice.amounts[i] = item.amount;
      this.billingItems[i].name = item.title;
      this.billingItems[i].amount = item.amount;
      this.$emit("changed-total");
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
            this.$router.push("/billing/invoices");
            this.error = false;
          }
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