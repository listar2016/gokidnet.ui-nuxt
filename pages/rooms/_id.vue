<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col s12 m4">
				<div class="card">
					<div class="card-content">
						<div class="row">
							<Input :name="$t('name')" :error="error" :value="room" prop-name="name"/>
						</div>
						<div class="row" style="display: flex; justify-content: center;">
							<a @click="save" class="waves-effect waves-light btn btn-round btn-large green">{{ $t('save') }}</a>
						</div>
					</div>
				</div>
			</div>
			<div class="col s12 m8">
				<div class="card">
					<div class="row">
						<div class="col s12">
							<ul class="tabs">
								<li class="tab col s4"><a class="active" href="#timeline">{{ $t('students') }}</a></li>
								<li class="tab col s4"><a href="#profile">{{ $t('parents') }}</a></li>
								<li class="tab col s4"><a href="#settings">{{ $t('activity') }}</a></li>
							</ul>
						</div>
						<div id="timeline" class="col s12 active">
							<div class="card-content">
								<Students :room="$route.params.id"/>
							</div>
						</div>
						<div id="profile" class="col s12" style="display: none;">
							<div class="card-content">
								<Parents :room="$route.params.id" />
							</div>
						</div>
						<div id="settings" class="col s12 active" style="display: none;">
							<div class="card-content">
								<Activity :activities="activities"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import Input from '~/components/ui/input'
import Students from '~/components/rooms/students'
import Activity from '~/components/rooms/activity'
import Parents from '~/components/rooms/parents'

export default {
	components: { Input, Students, Activity, Parents },
	async asyncData(context) {
		let room = await context.app.$http
			.get("/room_rooms/"+context.params.id)
			.then(response => {
				let data = response.data;
				return data;
			});
		let activities = await context.app.$http
				.get("/activity_logs/", {
					params: { room: context.params.id }
				})
				.then(response => {
					return  response.data.results;
				});
		return {
			room: room,
			activities: activities,
		}
	},
	data() {
		return {
			error: false
		}
	},
	mounted() {
		Vue.unloadScript("/assets/js/custom.min.js")
		Vue.loadScript("/assets/js/custom.min.js")
	},
	methods: {
		save() {
			this.$http.put('/room_rooms/'+this.$route.params.id+'/', this.room)
				.then(data => {
					this.$toast.global.success()
					this.error = false
					console.log(data);
				})
				.catch(e => {
					this.$toast.global.error()
					this.error = e.response.data
					console.log(e);
				});
		}
	}
};
</script>