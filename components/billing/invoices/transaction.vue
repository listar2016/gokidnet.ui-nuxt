<template>
    <div class="col m12 list-complete-item">
        <div class="card card-hover">
            <div class="card-content">
                <div class="row d-flex align-items-start">
                    <div class="col m12">
                        <h4 class="center">{{ parseFloat(data.amount) < 0 ? $t('billings.refunded') : $t('billings.paid') }}</h4>
                        <b>{{ $t('billings.paymentAmount') }}: {{ data.amount }}</b><br>
                        {{ $t('billings.method') }}: {{data.method}}<br>
                        {{ $t('billings.transactionDate') }}: {{data.transaction_date}}<br><br>
                        <a v-if="data.refunded < 0" :class="{disabled: parseFloat(data.amount) < 0}"
                                @click="$emit('refund', data)"
                                class="waves-effect waves-light btn indigo">
                            {{ $t('billings.refund') }}
                        </a>
                    </div>
                    <div>
                        <i v-if="parseFloat(data.amount) > 0" aria-hidden="true" class="v-icon v-icon--link material-icons theme--light" @click="$emit('edit', data)">{{ $t('edit') }}</i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['data']
}
</script>
