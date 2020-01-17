<template>
	<div class="row">
		<div class="col s12">
			<div class="card">
				<div class="card-content">
					<div class="row centered">
						<div class="col s2 centered">
							<a class="waves-effect waves-light btn indigo" @click="openDialog">{{ $t('addNew') }}</a>
						</div>
						<div class="col s10">
							<div class="input-field">
		                        <input id="last_name" type="text" v-model="search">
		                        <label for="last_name">{{ $t('search') }}</label>
		                    </div>
						</div>
					</div>
					<v-dialog persistent v-model="dialog" max-width="500px" v-if="dialog">
				        <v-card>
				          <v-card-title>
				            <span class="headline">{{editedIndex==-1 ? $t('newItem') : $t('edit') }}</span>
				          </v-card-title>
				          <v-card-text>
				            <v-container grid-list-md>
				              <div class="row">
							  	<Input :value="editedItem" :error.sync="error" :name="$t('medical.allergies')" prop-name="allergies"/>
							  	<Input :value="editedItem" :error.sync="error" :name="$t('medical.medications')" prop-name="medications"/>
							  	<Input :value="editedItem" :error.sync="error" :name="$t('medical.notes')" prop-name="notes"/>
							  	<Input :value="editedItem" :error.sync="error" :name="$t('medical.doctorName')" prop-name="doctor_name"/>
							  	<Input :value="editedItem" :error.sync="error" :name="$t('medical.doctorNumber')" prop-name="doctor_number"/>
				              </div>
				            </v-container>
				          </v-card-text>

				          <v-card-actions>
				            <v-spacer></v-spacer>
				            <v-btn color="blue darken-1" flat @click="close">{{ $t('cancel') }}</v-btn>
				            <v-btn color="blue darken-1" flat @click="save">{{ $t('save') }}</v-btn>
				          </v-card-actions>
				        </v-card>
				      </v-dialog>
					<v-data-table
				      :headers="headers"
				      :items="items"
				      :search="search"
				    >
				      <template v-slot:items="props">
				        <td class="text-xs-left">{{ props.item.allergies }}</td>
				        <td class="text-xs-left">{{ props.item.medications }}</td>
				        <td class="text-xs-left">{{ props.item.notes }}</td>
				        <td class="text-xs-left">{{ props.item.doctor_name }}</td>
				        <td class="text-xs-left">{{ props.item.doctor_number }}</td>
		                <td class="justify-center layout px-0">
				          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
				          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
				        </td>
				      </template>
				      <template v-slot:no-results>
				        <v-alert :value="true" color="error" icon="warning">
				          {{ $t('yourSearch') }} "{{ search }}" {{ $t('foundNoResults') }}.
				        </v-alert>
				      </template>
				    </v-data-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Input from '~/components/ui/input'

export default {
  components: {Input},
  props: ['id'],
  data() {
  	return {
  		headers: [
          { text: this.$t('medical.allergies'), value: 'allergies' },
          { text: this.$t('medical.medications'), value: 'medications' },
          { text: this.$t('medical.notes'), value: 'notes' },
          { text: this.$t('medical.doctorName'), value: 'doctor_name' },
          { text: this.$t('medical.doctorNumber'), value: 'doctor_number' },
          { text: this.$t('actions'), sortable: false, align: 'center' }
        ],
  		items: [],
  		categories: [],
  		search: '',
  		editedIndex: -1,
		editedItem: {
			allergies: '',
			medications: '',
			notes: '',
			doctor_name: '',
			doctor_number: ''
		},
		defaultItem: {
			allergies: '',
			medications: '',
			notes: '',
			doctor_name: '',
			doctor_number: ''
		},
		dialog: false,
		error: false
  	}
  },
  mounted () {
	this.$http.get('/student_students/'+this.id+'/medical_alerts/', {params: {page_size: 50}}).then((response) => {
		this.items = response.data.results
	}).catch((e) => {
	})
  },
  methods: {
  	editItem (item) {
		this.editedIndex = this.items.indexOf(item)
		this.editedItem = Object.assign(item)
		this.editedItem.room = this.editedItem.room?this.editedItem.room.id:null
		this.dialog = true
	},
    deleteItem (item) {
		if(confirm(this.$t('quizDelete'))) {
			this.$http.delete('/student_students/'+this.id+'/medical_alerts/'+item.id+'/').then((response) => {
				const index = this.items.indexOf(item)
				this.items.splice(index, 1)
				this.$toast.global.success()
			}).catch((e) => {
				this.$toast.global.error()
			})
		}
    },
	close () {
		this.dialog = false
		this.editedItem = Object.assign({}, this.defaultItem)
		this.editedIndex = -1
	},
	save () {
		if (this.editedIndex > -1) {
			//запрос на изменение
			this.$http.put('/student_students/'+this.id+'/medical_alerts/'+this.editedItem.id+'/', this.editedItem).then((response) => {
				this.items.splice(this.editedIndex, 1, response.data)
				this.close()
				this.$toast.global.success()
				this.error = false
			}).catch((e) => {
				this.$toast.global.error()
				this.error = e.response.data
			})
		} else {
			this.editedItem.student = this.$route.params.id
			//запрос на добавление
			this.$http.post('/student_students/'+this.id+'/medical_alerts/', this.editedItem).then((response) => {
				this.items.push(response.data)
				this.close()
				this.$toast.global.success()
				this.error = false
			}).catch((e) => {
				this.$toast.global.error()
				this.error = e.response.data
			})
		}
	},
	openDialog() {
		this.editedItem = Object.assign({}, this.defaultItem)
		this.editedIndex = -1
		this.dialog = true
	}
  }
};
</script>

<style>
    @import 'vuetify/dist/vuetify.min.css';
    @import 'vue-select/dist/vue-select.css';
</style>