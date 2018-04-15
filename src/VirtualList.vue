<template>
    <div @scroll="handleScroll" :style="{height: `${height}px`, 'overflow-y': 'scroll'}" ref="vl">
        <VirtualBlock :height="offsetTop">
            <div :style="blockStyle()">
                top{{this.offsetTop}}
            </div>
        </VirtualBlock>
        <VirtualBlock v-for="item in renderList" :height="item.height" :key="`${item.id}`">
            <slot :data="item">
            </slot>
        </VirtualBlock>
        <VirtualBlock :height="offsetBot">
            <div :style="blockStyle()">
                bot{{this.offsetBot}}
            </div>
        </VirtualBlock>
    </div>
</template>

<script>
import VirtualBlock from './VirtualBlock.vue';
export default {
    components: {
        VirtualBlock
    },
    props: ['data', 'height'],
    data() {
        return {
            viewportBegin: 0,
            viewportEnd: this.height,
            offsetTop: 0,
            offsetBot: 0
        }
    },
    watch: {
    },
    created() {
        // window.addEventListener('scroll', this.handleScroll);
        // console.log('received in vl', this.data);
    },
    mounted() {
        console.log('data', this.data);
        console.log('transformed', this.transformedData);
        const testArr = [0,1,2,4,6,9,14,15];
        const blks = [0,1,2,3,4,5,6];

        const upper = this.binarySearchLowerBound(0.5, testArr);
        const lower = this.binarySearchUpperBound(0.1, testArr);
        // console.log('bs lower bound', upper);
        // console.log('bs upper bound', lower);
        // console.log('result render list', blks.slice(upper, lower));
    },
    destroyed() {
        // window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        // test only
        blockStyle() {
            return {
                height: '100%',
                border: '1px solid #' + Math.floor(Math.random()*16777215).toString(16)
            }
        },
        handleScroll(evt) {
            console.log(this.$refs.vl.scrollTop);
            const scrollTop = this.$refs.vl.scrollTop;
            window.requestAnimationFrame(
                () => {
                    console.log('request Animation frame gets called');
                    this.viewportBegin = scrollTop;
                    console.log('begin set here');
                    this.viewportEnd = scrollTop + this.height;
                    console.log('end set here');
                    // this.$forceUpdate();
                }
            )
        },
        binarySearchLowerBound(s, arr) {
            let lo = 0;
            let hi = arr.length - 1;
            let mid;
            while(lo <= hi) {
                // integer division
                mid = ~~((hi + lo) / 2);
                if (arr[mid] > s) {
                    hi = mid - 1;
                } else if (arr[mid] < s) {
                    if (mid + 1 < arr.length) {
                        if (arr[mid + 1] > s) {
                            return mid;
                        } else {
                            // normal flow
                            lo = mid + 1;
                        }
                    } else {
                        // not a valid start position
                        // start position > total height
                        return -1;
                    }
                } else {
                    // only return the matched lower bound index
                    // may be modified later for smooth
                    return mid;
                }
            }
        },
        binarySearchUpperBound(e, arr) {
            let lo = 0;
            let hi = arr.length - 1;
            let mid;
            while(lo <= hi) {
                mid = ~~((hi + lo) / 2);
                if (arr[mid] > e) {
                    if (mid > 0) {
                        if (arr[mid - 1] < e) {
                            return mid;
                        } else {
                            // normal flow
                            hi = mid - 1;
                        }
                    } else {
                        // not a valid end position
                        // end position < view port start position
                        return -1;
                    }
                } else if (arr[mid] < e) {
                    lo = mid + 1;
                } else {
                    // lower bound should return previous block
                    // the slice func handles the index offset issue
                    return mid;
                }
            }
        },
        findBlocksInViewport(s, e, heightArr, blockArr) {
            if (s < e) {
                var t0 = performance.now();                
                const lo = this.binarySearchLowerBound(s, heightArr);
                var t1 = performance.now();
                console.log('LowerBound takes', t1-t0);
                var t2 = performance.now();
                const hi = this.binarySearchUpperBound(e, heightArr);
                var t3 = performance.now();
                console.log('Higher Bound takes', t3-t2);
                // set top
                this.offsetTop = lo >= 0 ? heightArr[lo] : 0;
                // set bot
                this.offsetBot = hi >= 0 ? heightArr[heightArr.length - 1] - heightArr[hi] : 0;
                var t4 = performance.now();
                const newArr = blockArr.slice(lo, hi);
                var t5 = performance.now();
                console.log('slice takes', t5-t4);

                return newArr;
            } else {
                t = 0;
                b = 0;
                return [];
            }
        }
    },
    computed: {
        transformedData() {
            let curHeight = 0;
            let rt = [curHeight];
            this.data.forEach(
                item => {
                    curHeight += item.height;
                    rt.push(curHeight);
                }
            );
            return rt;
        },
        renderList() {
            const rl = this.findBlocksInViewport(this.viewportBegin, this.viewportEnd, this.transformedData, this.data);
            // console.log('rl', rl);
            console.log('offset top', this.offsetTop);
            console.log('offset bot', this.offsetBot);
            return rl;
        }
    }
}
</script>

<style scoped>
.pink {
    background-color: pink;
}
</style>