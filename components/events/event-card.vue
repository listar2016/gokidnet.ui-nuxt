<template>
  <div class="card card-hover" :class="color">
    <div class="card-content">
      <div class="d-flex no-block align-items-center m-r-15">
        <i class="white-text material-icons display-6 m-r-15">event_note</i>
        <div class="m-t-10">
          <h5 class="white-text font-medium">{{item.title}}</h5>
          <h6 class="white-text">{{ athleteName(item.athleteId) }}</h6>
        </div>
        <div class="ml-auto m-t-15">
          <div class="crypto"></div>
        </div>
      </div>

      <div class="row text-center white-text m-t-30">
        <span class="font-14">{{item.description}}</span>
      </div>
      <div class="row text-center white-text m-t-30">
        <div class="col s4">
          <p class="font-medium right-align">
            <i class="material-icons">alarm</i>
            {{item.startDate | moment("D.MM.YY, HH:mm.")}}
          </p>
        </div>
        <div class="col s4">
          <p class="font-medium right-align">
            <i class="material-icons">alarm_on</i>
            {{item.endDate | moment("D.MM.YY, HH:mm.")}}
          </p>
        </div>
        <div class="col s4">
          <p class="font-medium">
            <i class="material-icons">event_available</i>
            {{item.type | translate}}
          </p>
        </div>
      </div>
    </div>
    <div class="icons" v-if="$cookies.get('role') == 'Admin'">
      <v-icon class="white-text delete" @click.stop="remove">delete</v-icon>
      <v-icon class="white-text edit" @click.stop="edit">edit</v-icon>
    </div>
  </div>
</template> 
<script>
export default {
  props: ["data", "athletes"],
  data() {
    return {
      item: this.data
    };
  },
  methods: {
    copy(){
      this.$emit('copy-schedule', this.data.id)
    },
    getChar(string) {
      return string ? string[0] + "." : "";
    },
    remove() {
      this.$emit('delete', this.item)
    },
    edit() {
      this.$emit('edit', this.item)
    }
  },
  computed: {
    color() {
      switch (this.item.type) {
        case "Event":
          return "blue darken-1";
        case "Measuring":
          return "orange lighten-1";
        case "Competition":
          return "green darken-1";
      }
    },
    athleteName() {
      return (athleteId) => {
        return this.athletes.filter(athlete => athlete.athleteId == athleteId)[0].name
      }
    }
  }
};
</script>
<style scoped>
.delete {
  position: absolute;
  top: .6em;
  right: .6em;
  padding: 0;
}
.edit {
  position: absolute;
  top: .6em;
  right: 1.9em;
}
.copy {
  position: absolute;
  top: .6em;
  right: 3em;
}
.icons {
  font-size: 1.3em;
}
</style>