<template>
  <div class="wrapper pb-50">
    <div class="row">
      <div class="col s12">
        <div class="card">
          <div class="card-content">
            <div class="row">
              <div class="col s3">
                <Input :value="schedule" :error="error" :name="$t('name')" prop-name="name" />
              </div>
              <div class="col s3">
                <Date :value="schedule" :error="error" :name="$t('lessons.activeFrom')" prop-name="from_date" />
              </div>
              <div class="col s3">
                <Date :value="schedule" :error="error" :name="$t('lessons.expiresOn')" prop-name="to_date" />
              </div>
              <div class="col s3">
                <Select
                  :value="schedule"
                  :error="error"
                  :name="$t('status')"
                  prop-name="status"
                  :options="[{code: 'ACTIVE', 'name': 'Active'}, {code: 'INACTIVE', 'name': 'Inactive'}]"
                />
              </div>
            </div>
            <div class="row">
              <button class="btn waves-effect waves-light success" @click="save">{{ $t('save') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row heading">
      <div class="heading-block" v-for="day in days" :key="day.code">{{ day.name }}</div>
    </div>
    <div class="row menu" v-for="category in categories" :key="category.code">
      <div class="category-heading">
        <div>
          {{ category.name }}
          <!-- <span :style="{fontSize: '12px'}">{{ category.code }}</span> -->
        </div>
      </div>
      <div class="menu-block" v-for="day in days" :key="day.code">
        <Select
          :value="schedule.meal_menu_days[mealMenuInd(day.code, category.code)]"
          :error.sync="error"
          :name="$t('emptyAdd')"
          prop-name="meals"
          :options="items.filter(item => item.category == category.code || category.code.indexOf(item.category) != -1)"
          label="name"
          :reduce="item => {return {id: item.id}}"
          multiple
        />
      </div>
    </div>
  </div>
</template>

<script>
import Input from "~/components/ui/input";
import Date from "~/components/ui/date";
import Select from "~/components/ui/select";

export default {
  components: { Select, Input, Date },
  async asyncData(context) {
    // console.log("context", context);
    let categories = await context.app.$http
      .get("/school_mealitems/categories/")
      .then(response => {
        return response.data.choices;
      });
    let items = await context.app.$http
      .get("/school_mealitems/")
      .then(response => {
        return response.data.results;
      });
    let days = await context.app.$http
      .get("/school_mealmenus/week_days/")
      .then(response => {
        return response.data.choices;
      });

    const schedule = await context.app.$http
      .get("/school_mealmenus/" + context.params.id)
      .then(response => response.data);

    return {
      categories: categories,
      items: items,
      days: days,
      schedule: schedule
    };
  },
  data() {
    return {
      schedule: {
        name: "",
        from_date: null,
        to_date: null,
        status: null,
        meal_menu_days: []
      },
      error: false,
      form: null
    };
  },
  methods: {
    save() {
      const { id, ...props } = this.schedule;

      props.meal_menu_days =
        props.meal_menu_days.filter(item => item.meals && item.meals.length) ||
        [];

      this.$http
        .put("/school_mealmenus/" + this.$route.params.id + "/", props)
        .then(response => {
          // console.log("save", response.data);
          this.$toast.global.success();
          this.error = false;
          this.$router.go(-1);
        })
        .catch(e => {
          this.$toast.global.error();
          this.error = e.response.data;
        });
    }
  },
  computed: {
    mealMenuInd() {
      return (week_day, category) => {
        let tmp = this.schedule.meal_menu_days.filter(
          day => day.week_day == week_day && day.category == category
        );
        if (!tmp[0]) {
          this.schedule.meal_menu_days.push({
            week_day: week_day,
            category: category,
            meals: []
          });
        }
        for (var i = 0; i < this.schedule.meal_menu_days.length; i++) {
          if (
            this.schedule.meal_menu_days[i].week_day == week_day &&
            this.schedule.meal_menu_days[i].category == category
          ) {
            return i;
          }
        }
      };
    }
  }
};
</script>

<style scoped>
.wrapper {
  padding: 0 30px;
}

.slide-enter {
  max-height: 0px;
  transition: all 0.3s ease;
}
.slide-enter-to {
  max-height: 60px;
  transition: all 0.3s ease;
}

.row.menu {
  height: 150px;
  margin-bottom: 15px;
  display: flex;
}

.row.heading {
  height: auto;
  display: flex;
}

.category-heading {
  height: 100%;
  width: 70px;
  background: #1abc9c;
  border-radius: 35px 0 0 35px;
  color: white;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  overflow: hidden;
}

.category-heading > div {
  flex: 1;
  transform: rotate(-90deg);

  white-space: nowrap;
  text-overflow: ellipsis;
}

.menu-block {
  width: calc(14.28% - 10px);
  height: 100%;
  border: 1px solid #1abc9c;
  background: white;
}

.heading-block:first-child {
  margin-left: 70px;
}

.heading-block {
  width: calc(14.28% - 10px);
  text-align: center;
  font-weight: 700;
}
.meal-item {
  margin: 5px;
  background: #66cc66;
  border-radius: 10px;
  text-align: center;
  color: white;
}
.multiply span.vs__selected {
  margin-top: 2px;
}
.menu-block >>> .root label,
.menu-block >>> .root .vs__actions {
  display: none;
}
.menu-block >>> .root .vs--searchable .vs__dropdown-toggle {
  border-bottom: none !important;
}
.menu-block >>> .root,
.menu-block >>> .root .v-select.vs--searchable.multiply,
.menu-block >>> .root .vs__dropdown-toggle {
  height: 100%;
}
.menu-block >>> .root .vs__selected {
  height: fit-content;
}
.menu-block >>> .root input {
  color: gray;
}
.menu-block >>> .root .vs__selected-options {
  padding-top: 8px;
}

.pb-50 {
  padding-bottom: 25rem;
}
</style>