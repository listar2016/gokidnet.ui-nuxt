<template>
  <Plan :rooms="rooms" :statuses="statuses" :lessons="lessons" />
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
    return {
      rooms: rooms,
      statuses: statuses,
      lessons: lessons
    };
  }
}
</script>