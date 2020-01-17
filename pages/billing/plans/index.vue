<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <nuxt-link to="plans/new">
                <a class="waves-effect waves-light btn indigo">{{ $t('addNew') }}</a>
              </nuxt-link>
            </div>
            <div class="col s10">
              <div class="input-field">
                <input id="last_name" type="text" v-model="search" />
                <label for="last_name">{{ $t('search') }}</label>
              </div>
            </div>
          </div>
          <v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog === true">
            <v-card>
              <v-card-title>
                <span class="headline">{{editedIndex==-1 ? $t('billings.newInvoice') : $t('edit') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <div class="row">
                    <Input
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('billings.dueDate')"
                      prop-name="due_date"
                    />
                    <Date
                      :value="editedItem"
                      :error.sync="error"
                      :name="$t('billings.dueDate')"
                      prop-name="due_date"
                    />
                    <h6>Date of Service</h6>
                    <div class="row">
                      <div class="col m6">
                        <Date
                          :value="editedItem"
                          :error.sync="error"
                          :name="$t('billings.from')"
                          prop-name="dos_from"
                        />
                      </div>
                      <div class="col m6">
                        <Date 
                          :value="editedItem" 
                          :error.sync="error" 
                          :name="$t('billings.to')" 
                          prop-name="dos_to" 
                        />
                      </div>
                    </div>
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
          <v-toolbar flat color="white">
            <v-toolbar-title>{{ $t('billings.billingInvoices') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <div>
              <v-checkbox v-model="expand" :label="$t('billings.keepOtherRows')" class="normal-icon"></v-checkbox>
            </div>
          </v-toolbar>
          <v-data-table :headers="headers" :items="items" :expand="expand" item-key="id">
            <template v-slot:items="props">
              <tr @click="props.expanded = !props.expanded">
                <td>{{ dueOnItems[props.item.due_on] }}</td>
                <td>{{ periodItems[props.item.for_period] }}</td>
                <td>{{ props.item.notify_before_days }}</td>
                <td>{{ props.item.plan_from }}</td>
                <td>{{ props.item.plan_to }}</td>
                <td>{{ typeItems[props.item.type] }}</td>
                <td>{{ props.item.items.length }}</td>
                <td>{{ props.item.students.length }}</td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    tag="Resume plan"
                    @click.stop="start(props.item)"
                    v-if="props.item.pause"
                  >play_arrow</v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    tag="Pause plan"
                    @click.stop="start(props.item)"
                    v-else
                  >pause</v-icon>
                  <v-icon small class="mr-2" @click.stop="editItem(props.item)">edit</v-icon>
                  <v-icon small @click.stop="deleteItem(props.item)">delete</v-icon>
                </td>
              </tr>
            </template>
            <template v-slot:expand="props">
              <v-card flat :key="`expand_${props.item.id}`">
                <v-card-text>
                  <div class="row">
                    <v-list class="col s4" subheader>
                      <v-subheader>{{ $t('students') }}</v-subheader>
                      <v-list-tile
                        v-for="item in props.item.students"
                        :key="item.name"
                        avatar
                        ripple
                        class="expand-list-item"
                      >
                        <v-list-tile-avatar>
                          <img :src="item.photo" v-if="item.photo" />
                          <div class="avatar m-r-0" v-else></div>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-html="item.name"></v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>

                    <v-list class="col s4" subheader two-line>
                      <v-subheader>{{ $t('items') }}</v-subheader>
                      <v-list-tile
                        v-for="item in props.item.items"
                        :key="item.name"
                        avatar
                        ripple
                        class="expand-list-item"
                      >
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.item.title }}</v-list-tile-title>
                          <v-list-tile-sub-title class="text--primary">{{ item.category.title }}</v-list-tile-sub-title>
                          <v-list-tile-sub-title>{{ item.notes }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-list-tile-action-text>{{ $t('billings.amount') }}: {{ item.amount }}</v-list-tile-action-text>
                          <v-list-tile-action-text>{{ $t('billings.discount') }}: {{ item.discount }}</v-list-tile-action-text>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >{{ $t('rooms.yourSearch') }} "{{ search }}" {{ $t('rooms.foundNoResults') }}.</v-alert>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from "~/components/ui/input";
import Date from "~/components/ui/date";

export default {
  components: { Input, Date },
  data() {
    return {
      headers: [
        { text: this.$t('billings.dueOn'), value: "due_on" },
        { text: this.$t('billings.forPeriod'), value: "for_period" },
        {
          text: this.$t('billings.daysNotify'),
          value: "notify_before_days"
        },
        { text: this.$t('billings.dateFrom'), value: "plan_from" },
        { text: this.$t('billings.dateTo'), value: "plan_to" },
        { text: this.$t('type'), value: "type" },
        { text: this.$t('billings.itemsCount') },
        { text: this.$t('billings.studentsCount') },
        { text: this.$t('actions'), sortable: false, align: "center" }
      ],
      periodItems: {},
      dueOnItems: {},
      typeItems: {},
      items: [],
      expand: false,
      categories: [],
      search: "",
      editedIndex: -1,
      editedItem: {
        students: null,
        items: null,
        dos_to: null
      },
      defaultItem: {
        students: "Jane Doe",
        items: null,
        date_due: null,
        due_amount: null,
        balance_due: null
      },
      dialog: false,
      error: false
    };
  },
  mounted() {
    this.$http.get("/billing_recurring_plans/periods/").then(response => {
      var mapped = {};
      console.log(response.data.choices);
      for (var i in response.data.choices) {
        mapped[response.data.choices[i].code] = response.data.choices[i].name;
      }
      this.periodItems = mapped;
    });
    this.$http.get("/billing_recurring_plans/due_ons/").then(response => {
      var mapped = {};
      for (var i in response.data.choices) {
        console.log(i);
        mapped[response.data.choices[i].code] = response.data.choices[i].name;
      }
      this.dueOnItems = mapped;
    });
    this.$http.get("/billing_recurring_plans/types/").then(response => {
      var mapped = {};
      for (var i in response.data.choices) {
        console.log(i);
        mapped[response.data.choices[i].code] = response.data.choices[i].name;
      }
      this.typeItems = mapped;
    });
    this.$http
      .get("/billing_recurring_plans/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results;
        console.log(this.items);
      })
      .catch(e => {
        console.log(e.response);
      });
  },
  methods: {
    editItem(item) {
      this.$router.push("/billing/plans/" + item.id);
    },
    start(item) {
      this.$http
        .put("/billing_recurring_plans/" + item.id + "/pause/", {
          pause: !item.pause
        })
        .then(response => {
          const index = this.items.indexOf(item);
          this.items.splice(index, 1, response.data);
          this.$toast.global.success();
        })
        .catch(e => {
          this.$toast.global.error();
        });
    },
    deleteItem(item) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/billing_recurring_plans/" + item.id)
          .then(response => {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$toast.global.success();
          })
          .catch(e => {
            this.$toast.global.error();
          });
      }
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    save() {
      //запрос на добавление
      this.$http
        .post("/billing_invoices/", this.editedItem)
        .then(response => {
          this.items.push(response.data);
          this.close();
          this.$toast.global.success();
          this.error = false;
          this.$router.push(
            "/billing/invoices/" + response.data.id
          );
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    },
    openDialog() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
.normal-icon i.v-icon {
  height: 25px !important;
  line-height: 25px !important;
}

.expand-list-item a {
  width: 100%;
}
</style>