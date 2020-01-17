<template>
  <div>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.student_name }}</td>
        <td class="text-xs-left">{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.contact }}</td>
        <td class="text-xs-left">{{ props.item.status }}</td>
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
</template>
<script>
export default {
  name: "Parents",
  components: {},
  props: {
    room: [Number, String]
  },

  mounted() {
    this.$http
      .get("/room_rooms/"+this.room+"/parents/", { params: { page_size: 25 } })
      .then(response => {
        this.items = response.data.results.map((item) => {
          item.student_name = item.student.first_name + ' ' + item.student.last_name
          item.contact = item.phone + "\n" + item.email
          return item
        });
      })
      .catch(e => {
      });
  },
  data() {
    return {
      search: "",
      items: [],
      headers: [
        { text: this.$t('rooms.student'), value: "student_name" },
        { text: this.$t('rooms.parent'), value: "name" },
        { text: this.$t('rooms.contact'), value: "contact" },
        { text: this.$t('rooms.status'), value: "status" }
      ]
    };
  }
};
</script>
<style scoped>
</style>