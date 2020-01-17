<template>
  <div>
    <v-list>
      <p v-if="!todayEvents.length">{{ $t('events.noEvents') }}</p>
      <v-list-tile
        v-for="(item, i) in todayEvents"
        :key="`event_${i}`"
        dense
        three-lines
        @click="$emit('edit-item', item)"
        class="event-tile"
      >
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title>
            <i>{{ item.notes }}</i>
          </v-list-tile-sub-title>
          <template v-if="item.rooms">
            <v-list-tile-sub-title>{{ parseRooms(item.rooms) }}</v-list-tile-sub-title>
            <!-- <v-list-tile-sub-title v-for="(room, j) in item.rooms" :key="`event_${i}_${j}`">{{ room.id }} - {{ room.name }}</v-list-tile-sub-title> -->
          </template>
        </v-list-tile-content>

        <v-list-tile-avatar>
          <img :src="item.avatar" />
        </v-list-tile-avatar>
      </v-list-tile>
    </v-list>
  </div>
</template>
<script>
import EventBus from "~/assets/js/EventBus";
export default {
  name: "Events",
  props: {
    items: Array
  },
  mounted() {
    EventBus.$on("calendar-emit", this.handleCalendarEmit);
  },
  data: () => ({
    selectedMonth: new Date().getMonth()
  }),
  methods: {
    parseRooms(arg) {
      return arg && arg.map(item => item.name).join(", ");
    },
    handleCalendarEmit(arg) {
      this.selectedMonth = arg;
    }
  },
  computed: {
    todayEvents() {
      return this.items
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .filter(item =>
          this.selectedMonth != -1
            ? this.selectedMonth == new Date(item.created_date).getMonth()
            : item.created_date &&
              new Date(item.created_date).getMonth() == new Date().getMonth()
        );
    }
  }
};
</script>
<style >
.event-tile .v-list__tile {
  height: 80px !important;
  /* border-bottom: 1px solid #000; */
}
</style>