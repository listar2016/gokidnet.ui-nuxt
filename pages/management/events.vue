<template>
  <div class="row v-application">
    <div class="col s12">
      <div class="card elevation-2">
        <div class="card-header calendar">
          <h4>{{ $t('calendar') }}</h4>
        </div>
        <div class="card-content p-0-0">
          <CalendarComponent @sync="calendar = {...arguments}"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarComponent from "~/components/events/calendar-component";
import EventBus from "@/assets/js/EventBus";
export default {
  name: "Events",
  components: {
    CalendarComponent
  },
  data: () => ({
    events: [],
    calendar: {}
  })
};
</script>
<style scoped>
.card-header {
  padding: 0.7em;
}
.card-header.calendar {
  background: linear-gradient(to left, #66c5cc 0%, #48eaa1 100%);
}
.card-content {
  position: relative;
}
.card-header.events {
  background: linear-gradient(to right, #66c5cc 0%, #48eaa1 100%);
  /* background: linear-gradient(to left, #92cc66 0%, #48aeea 100%); */
}
.card-header h4 {
  color: white;
  text-align: center;
  font-weight: 700;
  margin: 0;
}
</style>
