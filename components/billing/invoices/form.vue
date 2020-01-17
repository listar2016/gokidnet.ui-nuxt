<template>
  <div>
    <div class="col m10 s12 offset-m1">
      <div class="row valign-wrapper">
        <div class="col m6 s12">
          <div class="card">
            <div class="card-content">
              <div class>
                <div class="row">
                  <div class="col s12">
                    <h4 class="date-header centered">{{ $t('billings.dueDate') }}</h4>
                    <form class="m-t-40">
                      <MyDate
                        :value="invoice"
                        propName="due_date"
                        error.sync="error"
                        :name="$t('billings.dueDate')"
                      />
                    </form>
                  </div>
                </div>
                <hr />
                <div class="row">
                  <h4 class="date-header centered">{{ $t('billings.dateOfService') }}</h4>
                  <div class="col s6">
                    <form class="m-t-40">
                      <MyDate :value="invoice" propName="dos_from" error.sync="error" :name="$t('billings.from')" />
                    </form>
                  </div>
                  <div class="col s6">
                    <form class="m-t-40">
                      <MyDate :value="invoice" propName="dos_to" error.sync="error" :name="$t('billings.to')" />
                    </form>
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
                    <vue-select
                      v-model="rooms_filter"
                      :reduce="item => item.id"
                      label="name"
                      :options="rooms"
                      :placeholder="$t('billings.rooms_groups')"
                      style="margin-top: 21px"
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
                v-model="selected_billing_category[i]"
                :key="selected_billing_category.length"
                :label="$t('billings.category')"
                item-text="title"
                :return-object="true"
                :items="billingCategories"
                :placeholder="$t('billings.category')"
                @input="selectCategory(item, i)"
              />
            </div>
            <div class="col s2">
              <v-select
                v-model="selected_billing_category[i].items[i]"
                :key="'category_' + i"
                :label="$t('item')"
                :item-text="$t('title')"
                :return-object="true"
                :items="selected_billing_category[i].items"
                :placeholder="$t('item')"
                @input="selectItem(arguments[0], i)"
              />
            </div>
            <div class="col s2">
              <transition name="fade">
                <div class="col s12" :style="{transitionDelay: `${0.3}s`}" v-if="invoice.items[i]">
                  <div class="input-field" v-if="typeof invoice.items[i].item !== 'number'">
                    <input v-model="invoice.items[i].item.amount" :placeholder="$t('billings.amount')" readonly />
                    <label class="active">{{ $t('billings.amount') }}</label>
                  </div>
                  <div class="input-field" v-else>
                    <input v-model="invoice.items[i].amount" :placeholder="$t('billings.amount')" readonly />
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
  name: "InvoiceForm",
  components: {
    Input,
    MyDate
  },
  props: {
    prepared: Boolean,
    total: Number,
    invoice: Object,
    billingItems: Array,
    billingCategories: Array,
    students: Array,
    rooms: Array,
    selected_billing_category: Array
  },
  model: {
    prop: "invoice",
    event: "change"
  },
  mounted() {},
  data: () => ({
    search: "",
    rooms_filter: ""
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
      console.log("selectItem", item);
      this.invoice.items[i] = {
        item: item.id,
        discount: 0,
        notes: "",
        amount: item.amount,
        name: item.title || this.$t('billings.noTitle'),
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