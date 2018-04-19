<template>
    <div v-on="pageMode ? {} : {scroll: handleScroll}" :style="containerStyle" ref="vl">
        <div :style="{height: `${offsetTop}px`}">
        </div>
        <div v-for="item in renderList" :style="{height: `${item.height}px`}" :key="`${item.id}`">
            <slot :data="item">
            </slot>
        </div>
        <div :style="{height: `${offsetBot}px`}">
        </div>
    </div>
</template>

<script>
export default {
    // window.pageYoffset is the scrollTop relative to window
    // window.innerHeight || document.documentElement.clientHeight is the window viewport height
    // element.offsetTop is the element start position from top of window

    // TODif data gets filtered or changed, need update the items as well
    props: {
        data: {
            type: Array,
            required: true
        },
        height: {
            type: Number
        },
        pageMode: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            viewportBegin: 0,
            viewportEnd: this.height,
            offsetTop: 0,
            offsetBot: 0,
            renderList: [],
            transformedData: []
        }
    },
    watch: {
        data: {
            handler: function(newVal, oldVal) {
                this.computeTransformedData(newVal);
            },
            immediate: true
        }
    },
    created() {
        // add to window scroll
        if (this.pageMode) {
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    mounted() {
        if (this.pageMode) {
            // page mode 
            // initialize transformed data here
            this.computeTransformedData(this.data);
        }
        this.updateVl(0);
        // console.log('mounted offsetTop', this.$refs.vl.offsetTop);
        // console.log('data', this.data);
        // const testArr = [1,2,4,6,9,14,15];
        // const blks = [0,1,2,3,4,5,6];

        // const upper = this.binarySearchLowerBound(0, testArr);
        // const lower = this.binarySearchUpperBound(20, testArr);
        // console.log('bs lower bound', upper);
        // console.log('bs upper bound', lower);
    },
    destroyed() {
        if (this.pageMode) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    },
    methods: {
        computeTransformedData(oriArr) {
            console.log('oriArr', oriArr);
            if (this.pageMode && this.$refs.vl || !this.pageMode) {
                let curHeight = this.pageMode ? this.$refs.vl.offsetTop : 0;
                let rt = [curHeight];
                oriArr.forEach(
                    item => {
                        curHeight += item.height;
                        rt.push(curHeight);
                    }
                );
                console.log('after computing', rt);
                this.transformedData = rt;
            }
        },
        handleScroll(evt) {
            const scrollTop = this.pageMode ? window.pageYOffset : this.$refs.vl.scrollTop;
            // window.requestAnimationFrame(
            //     () => {
                    // console.log('request Animation frame gets called');
                    // this.viewportBegin = scrollTop;
                    // console.log('begin set here');
                    // this.viewportEnd = scrollTop + this.height;
                    // console.log('end set here');
                    // this.$forceUpdate();
            console.log('scrollTop', scrollTop);
            this.updateVl(scrollTop);
                // }
            // )
        },
        binarySearchLowerBound(s, arr) {
            let lo = 0;
            let hi = arr.length - 1;
            let mid;
            while(lo <= hi) {
                // integer division
                mid = ~~((hi + lo) / 2);
                if (arr[mid] > s) {
                    if (lo === hi) {
                        // start position less than the smallest element in arr
                        return 0;
                    } else {
                        hi = mid - 1;
                    }
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
                    if (lo === hi) {
                        // end position greater than the biggest element in arr
                        return arr.length - 1;
                    } else {
                        lo = mid + 1;
                    }
                } else {
                    // lower bound should return previous block
                    // the slice func handles the index offset issue
                    return mid;
                }
            }
        },
        findBlocksInViewport(s, e, heightArr, blockArr) {
            if (s < e) {
                const lo = this.binarySearchLowerBound(s, heightArr);
                const hi = this.binarySearchUpperBound(e, heightArr);
                var vlOffset = this.pageMode ? this.$refs.vl.offsetTop : 0;
                // set top
                this.offsetTop = lo >= 0 ? heightArr[lo] - vlOffset : 0;
                // set bot
                this.offsetBot = hi >= 0 ? heightArr[heightArr.length - 1] - heightArr[hi] - vlOffset : 0;

                return blockArr.slice(lo, hi);;
            } else {
                this.offsetTop = 0;
                this.offsetBot = 0;
                return [];
            }
        },
        updateVl(scrollTop) {
             const viewportHeight = this.pageMode ? window.innerHeight : this.height;
             this.viewportBegin = scrollTop;
             this.viewportEnd = scrollTop + viewportHeight;
             this.renderList = this.findBlocksInViewport(this.viewportBegin, this.viewportEnd, this.transformedData, this.data);
             console.log(this.renderList);
        }
    },
    computed: {
        containerStyle() {
            return {
                ...(!this.pageMode && {height: `${this.height}px`}),
                ...(!this.pageMode && {'overflow-y' : 'scroll'})
            }
        }
    }
}
</script>