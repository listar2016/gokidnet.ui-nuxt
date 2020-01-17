<template>
  <Plan :rooms="rooms" :statuses="statuses" :lessons="lessons" :plan="plan" method="put" :url="'/lesson_plans/'+$route.params.id+'/'" />
</template>

<script>
import Plan from '~/components/lessons/plan'
export default {
  components: { Plan },
  async asyncData(context) {
    let rooms = await context.app.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let statuses = await context.app.$http
      .get("/lesson_plans/status/")
      .then(response => {
        let data = response.data.choices;
        return data;
      });
    let lessons = await context.app.$http
      .get("/lesson_lessons/", { params: { page_size: 50 } })
      .then(response => {
        let data = response.data.results;
        return data;
      });
    let plan = await context.app.$http
      .get("/lesson_plans/"+context.params.id)
      .then(response => {
          let data = response.data;
          data.timeslots = data.timeslots.map((el) => {
              el.start = el.start.substr(0, 5)
              el.end = el.end.substr(0, 5)
              return el
          });
          console.log(data)
          return data
      });
    return {
      rooms: rooms,
      statuses: statuses,
      lessons: lessons,
      plan: plan
    };
  }
}
</script>