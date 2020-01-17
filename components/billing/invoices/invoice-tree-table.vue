<template>
    <tbody>
    <tr>
        <th class="text-xs-left">{{ name }}</th>
        <th class="text-xs-left">{{ $t('billings.total') }}</th>
        <th class="text-xs-center">{{ item.total ? item.total : '0.00'}}</th>
    </tr>
    <template v-if="item.items">
        <template v-for="key in Object.keys(item.items)">
            <tr>
                <td class="pl-3">{{ key }}</td>
                <td class="text-xs-left">{{ $t('billings.total') }}</td>
                <td class="text-xs-center">{{ item.items[key].total ? item.items[key].total : '0.00'}}</td>
            </tr>
            <template v-if="item.items[key]">
                <tr class="depth-3" v-for="key2 in Object.keys(item.items[key].items)">
                    <td class="pl-5">{{ key2==='' ? 'N/A' : key2 }}</td>
                    <td class="text-xs-left">{{ $t('billings.total') }}</td>
                    <td class="text-xs-center">{{item.items[key].items[key2].total ? item.items[key].items[key2].total : '0.00'}}</td>
                </tr>
            </template>
        </template>
    </template>
    </tbody>
</template>

<script>
  export default {
    name: "invoice-tree-table",
    props: {
      name: '',
      item: {}
    },
  }
</script>

<style scoped>

</style>