<template>
    <div id="app">
        <div class="title">{{msg}}</div>
        <div>{{tryes()}}</div>
        <VirtualList></VirtualList>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            msg: "hello wrold"
        }
    },
    computed: {
    },
    methods: {
        tryes() {
            const arr = [1, 2, 3, 4];
            console.log([...arr, 5 , 6]);
        }
    }
}
</script>

<style scoped>
</style>