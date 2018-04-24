<template>
    <div v-on="pageMode ? {} : {scroll: handleScroll}" :style="containerStyle" ref="vb">
        <div :style="{height: `${offsetTop}px`}">
        </div>
        <div v-for="item in renderList" 
             :style="{height: `${fixedBlockHeight ? fixedBlockHeight : item.height}px`}" 
             :key="`${item.id}`">
            <slot :data="item">
            </slot>
        </div>
        <div :style="{height: `${offsetBot}px`}">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // data is required
        // height is required if pageMode is set to false
        // when fixedBlockHeight is specified, the height key in data will be ignored
        data: {
            type: Array,
            required: true
        },
        height: {
            type: Number
        },
        fixedBlockHeight: {
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
                // code blow used to update view when data changed
                if (oldVal) {
                    this.$nextTick(
                        () => {
                            // reset the scrollTop for container
                            // update view by handleScroll()
                            this.$refs.vb.scrollTop = 0;
                            this.handleScroll();
                        }
                    );
                }
            },
            immediate: true // when not in page mode, initailize data here
        },
        pageMode(newVal) {
            if (newVal) {
                window.addEventListener('scroll', this.handleScroll);
            } else {
                window.removeEventListener('scroll', this.handleScroll);
            }
            // recompute transformed data when pageMode changed
            this.computeTransformedData(this.data);
            this.$nextTick(
                () => {
                    // reset the scrollTop for container
                    // update view by handleScroll()
                    this.$refs.vb.scrollTop = 0;
                    this.handleScroll()
                }
            );
        },
        fixedBlockHeight() {
            // update view when fixedBlockHeight changed
            this.handleScroll();
        }
    },
    created() {
        if (this.pageMode) {
            // add scroll onto window
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    mounted() {
        if (this.pageMode) {
            // in page mode, initialize transformed data here
            this.computeTransformedData(this.data);
        }
        // initialize view by calling updateVb
        this.updateVb(0);
    },
    destroyed() {
        if (this.pageMode) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    },
    methods: {
        computeTransformedData(oriArr) {
            // compute accumulative height value for each block
            // note the function related to the variable 'pageMode'
            // and when fixedRowHeight is specified, transformedData is not needed
            if (!this.fixedRowHeight && ((this.pageMode && this.$refs.vb) || !this.pageMode)) {
                let curHeight = this.pageMode ? this.$refs.vb.offsetTop : 0;
                let rt = [curHeight];
                oriArr.forEach(
                    item => {
                        curHeight += item.height;
                        rt.push(curHeight);
                    }
                );
                this.transformedData = rt;
            }
        },
        handleScroll() {
            // scrollTop is relative to the varible pageMode
            const scrollTop = this.pageMode ? window.pageYOffset : this.$refs.vb.scrollTop;
            // use requestAnimationFrame to ensure smooth scrolling visual effects
            window.requestAnimationFrame(
                () => {
                    this.updateVb(scrollTop);
                }
            );
        },
        binarySearchLowerBound(s, arr) {
            // used to search the lower bound in-viewport index for data array
            // when height is not fixed
            let lo = 0;
            let hi = arr.length - 1;
            let mid;
            while(lo <= hi) {
                // integer division
                mid = ~~((hi + lo) / 2);
                if (arr[mid] > s) {
                    if (mid === 0) {
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
            // used to search the upper bound in-viewport index for data array
            // when height is not fixed
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
                    if (mid === arr.length - 1) {
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
        fixedBlockHeightLowerBound(s, fixedBlockHeight) {
            // used to compute the lower bound in-viewport index for data array
            // when in fixed height mode
            const sAdjusted = this.pageMode ? s - this.$refs.vb.offsetTop : s;
            const computedStartIndex = ~~(sAdjusted / fixedBlockHeight);
            return computedStartIndex >= 0 ? computedStartIndex : 0;
        },
        fixedBlockHeightUpperBound(e, fixedBlockHeight) {
            // used to compute the upper bound in-viewport index for data array
            // when in fixed height mode
            const eAdjusted = this.pageMode ? e - this.$refs.vb.offsetTop : e;
            const compuedEndIndex = Math.ceil(eAdjusted / fixedBlockHeight);
            return compuedEndIndex <= this.data.length ? compuedEndIndex : this.data.length;
        },
        findBlocksInViewport(s, e, heightArr, blockArr) {
            if (s < e) {
                const lo = this.fixedBlockHeight ? 
                           this.fixedBlockHeightLowerBound(s, this.fixedBlockHeight) :
                           this.binarySearchLowerBound(s, heightArr);
                const hi = this.fixedBlockHeight ? 
                           this.fixedBlockHeightUpperBound(e, this.fixedBlockHeight) :
                           this.binarySearchUpperBound(e, heightArr);

                var vbOffset = this.pageMode ? this.$refs.vb.offsetTop : 0;
                // set top spacer
                if(this.fixedBlockHeight) {
                    this.offsetTop = lo >= 0 ? lo * this.fixedBlockHeight : 0;
                } else {
                    this.offsetTop = lo >= 0 ? heightArr[lo] - vbOffset : 0;
                }
                // set bot spacer
                if (this.fixedBlockHeight) {
                    this.offsetBot = hi >= 0 ? (blockArr.length - hi ) * this.fixedBlockHeight : 0;
                } else {
                    this.offsetBot = hi >= 0 ? heightArr[heightArr.length - 1] - heightArr[hi] : 0;
                }
                // return the sliced the data array
                return blockArr.slice(lo, hi);;
            } else {
                this.offsetTop = 0;
                this.offsetBot = 0;
                return [];
            }
        },
        updateVb(scrollTop) {
            // compute the viewport start position and end position based on the scrollTop value
            const viewportHeight = this.pageMode ? window.innerHeight : this.height;
            this.viewportBegin = scrollTop;
            this.viewportEnd = scrollTop + viewportHeight;
            this.renderList = this.findBlocksInViewport(this.viewportBegin, this.viewportEnd, this.transformedData, this.data);
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