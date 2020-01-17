<template>
  <div class="row">
    <div class="col s12">
      <div class="card">
        <div class="card-content">
          <div class="row centered">
            <div class="col s2 centered">
              <nuxt-link to="meal-menus/new">
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

          <span v-if="loading">{{ $t('loading') }}</span>
          <span v-else>
            <v-data-table :headers="headers" :items="items" :search="search">
              <template v-slot:items="props">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.from_date }}</td>
                <td class="text-xs-left">{{ props.item.to_date }}</td>
                <td class="text-xs-left">{{ props.item.status }}</td>
                <td class="justify-center layout px-0">
                  <nuxt-link
                    tag="v-icon"
                    :to="localePath({name: 'management-meal-menus-id', params: { id: props.item.id}})"
                    small
                    class="mr-2"
                  >edit</nuxt-link>
                  <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </template>
              <template v-slot:no-results>
                <v-alert
                  :value="true"
                  color="error"
                  icon="warning"
                >{{ $t('rooms.yourSearch') }} "{{ search }}" {{ $t('rooms.foundNoResults') }}.</v-alert>
              </template>
            </v-data-table>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from "~/components/ui/input";
import Date from "~/components/ui/date";

export default {
  mounted() {
    this.fetchData();
  },
  components: { Input, Date },
  data() {
    return {
      loading: false,
      headers: [
        { text: this.$t('name'), value: "name" },
        { text: this.$t('lessons.activeFrom'), value: "active_from" },
        { text: this.$t('lessons.expiresOn'), value: "expires_on" },
        { text: this.$t('status'), value: "status" },
        { text: this.$t('actions'), sortable: false, align: "center" }
      ],
      items: [],
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
  methods: {
    fetchData() {
      this.loading = true;
      this.$http
        .get("/school_mealmenus")
        .then(response => {
          console.log(response.data);
          this.items = response.data.results;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    deleteItem(arg) {
      if (confirm(this.$t('quizDelete'))) {
        this.$http
          .delete("/school_mealmenus/" + arg.id)
          .then(response => {
            console.log("deleteItem", response.data);
            this.fetchData();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style>
@import "vuetify/dist/vuetify.min.css";
@import "vue-select/dist/vue-select.css";
</style>