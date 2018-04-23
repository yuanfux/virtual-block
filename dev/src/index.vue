<template>
    <div id="app">
        <!-- <div>{{tryes()}}</div> -->
        <VirtualList v-if="true" :pageMode="false" :height="300" :data="blocks">
            <template slot-scope="{data}">
                <div :style="{height: '100%', 'background-color': data.color}">
                    {{data.id}}
                </div>
            </template>
        </VirtualList>
        <div style="margin-top: 200px;">
        </div>
        <VirtualList :pageMode="true" :height="500" :data="blocks">
            <template slot-scope="{data}">
                <div :style="{height: '100%', 'background-color': data.color}">
                    {{data.id}}
                </div>
            </template>
        </VirtualList>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            msg: "hello world this is the dev mode",
            blocks: this.dataConstructor()
            // [
            //     {height: 100, id: 0, color: 'red'},
            //     {height: 200, id: 1, color: 'blue'},
            //     {height: 300, id: 2, color: 'yellow'},
            //     {height: 200, id: 3, color: 'green'}
            // ]
        }
    },
    computed: {
    },
    methods: {
        dataConstructor() {
            let constructedArr = [];
            for (let i = 0 ; i < 20 ; i++) {
                let constructedObj = {};
                constructedObj['height'] = 50;
                constructedObj['id'] = i;
                constructedObj['color'] = '#' + this.randomColor();
                constructedArr.push(constructedObj);
            }
            console.log('constructedArr', constructedArr);
            return constructedArr;
        },
        tryes() {
            const arr = [1, 2, 3, 4];
            console.log([...arr, 5 , 6]);
        },
        randomColor() {
            return Math.floor(Math.random()*16777215).toString(16);
        }
    }
}
</script>

<style scoped>
</style>