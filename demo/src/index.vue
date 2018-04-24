<template>
    <div>
        <div class="header">Virtual Block</div>
        <div class="userOptions">
            <span class="option">
                <span>
                    Data Amount
                </span>
                <select v-model="dataAmt">
                    <option value="100">100</option>
                    <option value="1000">1000</option>
                    <option value="10000">10000</option>
                    <option value="200000">200000</option>
                    <option value="500000">500000</option>
                </select>
            </span>
            <span class="option">
                <span>
                    Page Mode
                </span>
                <input type="checkbox" v-model="isPageMode">
            </span>
            <span class="option">
                <span>
                    Fixed Block Height
                </span>
                <input type="checkbox" v-model="isFixedHeight">
            </span>
        </div>
        <VirtualBlock :fixedBlockHeight="isFixedHeight ? 50 : undefined" v-if="true" :pageMode="isPageMode" :height="500" :data="data" ref="vb">
            <template slot-scope="{data}">
                <div :style="{height: '100%', 'background-color': data.color}">
                    {{data.id}}
                </div>
            </template>
        </VirtualBlock>
        <div class="footer">
            <span>
                🌈#supportlgbt :)
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            data: [],
            dataAmt: '1000',
            isPageMode: false,
            isFixedHeight: true
        }
    },
    created() {
        this.data = this.dataConstructor(this.dataAmt, this.isFixedHeight);
    },
    watch: {
        dataAmt: function(newVal) {
            this.data = this.dataConstructor(this.dataAmt, this.isFixedHeight);
            this.$forceUpdate();
        },
        isPageMode: function(newVal) {
            this.$forceUpdate();
        },
        isFixedHeight: function(newVal) {
            this.data = this.dataConstructor(this.dataAmt, this.isFixedHeight);
            this.$forceUpdate();
        }
    },
    computed: {
    },
    methods: {
        dataConstructor(amount, fixedHeight) {
            let constructedArr = [];
            for (let i = 0 ; i < Number(amount) ; i++) {
                let constructedObj = {};
                constructedObj['height'] = fixedHeight ? 50 : this.randomInteger(30, 90);
                constructedObj['id'] = i;
                constructedObj['color'] = '#' + this.randomColor();
                constructedArr.push(constructedObj);
            }
            return constructedArr;
        },
        randomColor() {
            return Math.floor(Math.random() * 16777215).toString(16);
        },
        randomInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }
    }
}
</script>

<style scoped>
span, div{
    font-family: 'Helvetica Neue', sans-serif;
}

.header {
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 25px;
    text-align: center;
}

.userOptions {
    margin: 10px 0;
}

.option {
    margin: 0 7px;
}

.footer {
    font-size: 10px;
    text-align: center;
}

.btn {
    cursor: pointer;
}
</style>