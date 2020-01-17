<template>

</template>
<script>
export default {
    mounted () {
        this.$store.dispatch('user/logout')        
        return this.$router.go( '/login')
    }
}
</script>
