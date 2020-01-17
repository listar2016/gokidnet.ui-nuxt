<template>
  <div class="card">
    <div :class="'card-header ' + type.toLowerCase()">
      <h4>{{type}} {{ $t('messaging.toRecieve') }}}:</h4>
    </div>
    <div class="card-content p-b-0">
      <div class="row valign-wrapper">
        <div class="col s12 m3">
          <v-list-tile-action>
            <v-checkbox :label="$t('selectAll')" @change="selectAllVisible"></v-checkbox>
          </v-list-tile-action>
        </div>
        <div class="col s6 m4">
          <v-subheader class="input-field">
            <input id="search" type="text" v-model="search" />
            <label for="search" style="margin-left: 1em;">{{ $t('search') }}</label>
          </v-subheader>
        </div>
        <div class="col s6 m4">
          <v-subheader class="input-field">
            <v-select
              v-model="rooms_filter"
              :label="$t('name')"
              item-text="name"
              :items="rooms"
              :clearable="true"
              :return-object="true"
              :placeholder="$t('billings.rooms_groups')"
            />
          </v-subheader>
        </div>
      </div>
    </div>
    <div class="card-content p-t-0" style="overflow-x: scroll; height: 532px;">
      <div class="row">
        <div class="col s12">
          <v-list subheader three-line>
            <transition-group name="fade" tag="div">
              <v-list-tile
                v-for="(item, i) in filtered_items"
                :style="{transitionDelay: `${(i+1) * 0.05}s`}"
                :key="`item_${i}`"
                class="item-tile"
                click
              >
                <v-list-tile-action>
                  <v-checkbox
                    :value="selectedItems.findIndex(el => { return el == (item.id)}) !== -1"
                    @change="addRecipient(item)"
                  ></v-checkbox>
                </v-list-tile-action>

                <v-list-tile-content @click.prevent="addRecipient(item)">
                  <v-list-tile-title>{{item.last_name}} {{item.first_name}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </transition-group>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$http
      .get("/room_rooms/", { params: { page_size: 50 } })
      .then(response => {
        this.rooms = response.data.results;
      });
  },
  name: "SelectRecipients",
  props: {
    items: Array,
    type: String,
    selectedItems: Array
  },
  data: () => ({
    search: "",
    rooms_filter: "",
    rooms: []
  }),
  computed: {
    filtered_items() {
      return this.items
        .filter(item =>
          this.rooms_filter && this.rooms_filter.id && item.room
            ? item.room.id == this.rooms_filter.id
            : item
        )
        .filter(item =>
          this.rooms_filter && this.rooms_filter.id && item.rooms
            ? item.rooms &&
              item.rooms.length &&
              item.rooms.some(r => r.id == this.rooms_filter.id)
            : item
        )
        .filter(item => {
          let text = item.first_name + " " + item.last_name;
          return text.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
        });
    }
  },
  methods: {
    addRecipient(item) {
      this.$emit("add-recipient", this.type, item);
    },
    selectAllVisible() {
      for (var i in this.filtered_items) {
        this.$emit("add-recipient", this.type, this.filtered_items[i]);
      }
    }
  }
};
</script>
<style scoped>
.card-header {
  padding: 0.7em;
}
.card-header.students {
  background: linear-gradient(to left, #66c5cc 0%, #48eaa1 100%);
}
.card-header.staffs {
  background: linear-gradient(to left, #92cc66 0%, #48aeea 100%);
}
.card-header h4 {
  color: white;
  text-align: center;
  font-weight: 700;
  margin: 0;
}
</style>
