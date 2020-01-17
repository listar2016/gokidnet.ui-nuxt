<template>
  <div class="row">
    <div class="col s8 offset-s2">
      <div class="card">
        <div class="card-content">
          <div class="row">
            <div class="col s3 left">
              <h5>{{ $t('billings.confirmAndSend') }}</h5>
            </div>
            <div class="col s3 right">
              <nuxt-link to="/billing/plans/new">
                <a class="waves-effect waves-light btn orange">{{ $t('back') }}</a>
              </nuxt-link>
              <nuxt-link to="send">
                <a class="waves-effect waves-light btn indigo">{{ $t('billings.sendInvoice') }}</a>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col s6">
          <div class="card printableArea">
            <div class="card-content">
              <div class="row">
                <div class="col s12">
                  <div class="left">
                    <address>
                      <h5>
                        <b class="red-text">{{ $t('billings.babyAcademy') }}</b>
                      </h5>
                      <hr />
                      <p class="m-l-5">
                        F-1, Soccer House,
                        <br />opp. Castelldefels,
                        <br />Barcelona-1478,
                        <br />Catalonia,
                        <br />Spain
                      </p>
                      <hr />
                    </address>
                    <div class="left m-t-30 left-align">
                      <p>{{ $t('billings.subTotalAmount')}}: $13,848</p>
                      <p>{{ $t('billings.vat') }} (10%) : $138</p>
                    </div>
                  </div>
                  <div class="right right-align">
                    <address>
                      <h5>{{ $t('billings.to') }},</h5>
                      <hr />
                      <h5 class="font-bold">Gaala &amp; Sons</h5>
                      <p class="m-l-30">
                        E 101, Peace Villa,
                        <br />Nr. Lords Street,
                        <br />Washington-254865,
                        <br />USA
                      </p>
                      <hr />
                      <p class="m-t-30">
                        <b>{{ $t('billings.invoiceDate') }} :</b>
                        <i class="fa fa-calendar"></i> 23rd Jan 2017
                      </p>
                      <p>
                        <b>{{ $t('billings.dueDate') }} :</b>
                        <i class="fa fa-calendar"></i> 25th Jan 2017
                      </p>
                    </address>
                    <hr />
                    <h4>
                      <b>{{ $t('billings.total') }} :</b> $13,986
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col s6">
          <div class="card">
            <div class="card-content">
              <h4>10 {{ $t('billings.students_be_invoiced')}}</h4>
              <v-data-table :headers="headers" :items="items" :search="search">
                <template v-slot:items="props">
                  <td class="text-xs-left">
                    <label>
                      <input type="checkbox" />
                      <span>{{ props.item.id }}</span>
                    </label>
                  </td>
                  <td class="text-xs-left">
                    <div class="chip">
                      <img src="assets/images/users/5.jpg" alt="Contact Person" />
                      {{props.item.students}}
                    </div>
                  </td>
                  <td class="justify-center layout px-0">
                    <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
                    <v-icon small @click="deleteItem(props.item)">delete</v-icon>
                  </td>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        { text: this.$t('students'), value: "checkbox" },
        { text: this.$t('actions'), sortable: false, align: "center" }
      ]
    };
  }
};
</script>