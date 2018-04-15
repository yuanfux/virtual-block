<template>
    <div :style="{height: `${height}px`}">
        <slot>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        height: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
        }
    },
    updated() {

    },
    watch: {
    },
    created() {
    },
    methods: {
        
    },
    computed: {
    }
}
</script>

<style scoped>
</style>