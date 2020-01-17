<template>
  <v-list subheader three-line>
    <transition-group name="fade" tag="div">
      <v-list-tile
        v-for="(student, i) in students"
        class="student-tile"
        :style="{transitionDelay: `${(i+1) * 0.05}s`}"
        :key="`student_${i}`"
        click
      >
        <v-list-tile-action>
          <v-checkbox
            :value="student.id"
            v-model="selectedUsers[i]"
            @change="addStudent(student)"
          ></v-checkbox>
        </v-list-tile-action>

        <v-list-tile-content @click.prevent="addStudent(student)">
          <v-list-tile-title>{{student.last_name}} {{student.first_name}}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </transition-group>
  </v-list>
</template>
<script>
export default {
    name: 'SelectStudents',
    props: {
        students: {
            type: Array,
            default: () => ([])
        },
        selectedUsers: {
            type: Array,
            default: () =>([])
        }
    },
    methods: {
        addStudent(student) {
            this.$emit('select-student', student)
        }
    }
};
</script>
<style scoped>
.student-tile {
  cursor: pointer;
}
</style>