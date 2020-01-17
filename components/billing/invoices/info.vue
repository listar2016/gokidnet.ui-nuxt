<template>
    <div class="card printableArea">
        <div class="card-content">
        <div class="row">
        <div class="col s6 left">
            <address>
            <h5>
                <b class="red-text">{{ $t('billings.babyAcademy') }}</b>
            </h5>
            <p class="m-l-5">
                Villa no 99 Road 777
                <br />El Maadi
                <br />Cairo, Egypt 11742
            </p>
            </address>
        </div>
        <div class="col s6 right">
            <div class="right right-align">
            <address>
                <p class="m-l-30">
                <strong>{{ $t('billings.dueDate') }}</strong>
                <br /> {{ invoice.due_date }}
                <br /> <strong>{{ $t('billings.dateOfService') }}</strong>
                <br /> {{ invoice.dos_from }} - {{ invoice.dos_to }}
                </p>
            </address>
            </div>
        </div>
        </div>
        <hr />
        <div class="row">
            <div class="col left">
            <h5>{{ $t('billings.items') }}</h5>
            </div>
            <div class="col right">
            <h5>{{ $t('billings.amount') }}</h5>
            </div>
        </div>
        <template v-for="(item, i) in invoice.items">
            <div class="row" :key="`prepared_items_${i}`">
            <div class="col left">
                <span>{{item.name ? item.name : item.item.title}}</span>
            </div>
            <div class="col right">
                <span>{{ parseInt(item.amount).toFixed(2) }}</span>
            </div>
            </div>
            <div class="row" :key="`prepared_items_discount_${i}`">
            <div class="col left">
                <span>{{ $t('billings.discount') }}</span>
            </div>
            <div class="col right">
                <span>- {{ parseInt(item.discount).toFixed(2) }}</span>
            </div>
            </div>
            <hr :key="`prepared_items_hr2_${i}`" />
        </template>
        <div class="row">
            <div class="col left">
            <h5><strong>{{ $t('billings.total') }}</strong></h5>
            </div>
            <div class="col right">
            <h5><strong>{{parseInt(total).toFixed(2)}}</strong></h5>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['invoice', 'total']
}
</script>