(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["virtual-block"] = factory();
	else
		root["virtual-block"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/VirtualBlock.vue":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/VirtualBlock.vue ***!
  \****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
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

    data: function data() {
        return {
            viewportBegin: 0,
            viewportEnd: this.height,
            offsetTop: 0,
            offsetBot: 0,
            renderList: [],
            transformedData: []
        };
    },

    watch: {
        data: {
            handler: function handler(newVal, oldVal) {
                var _this = this;

                this.computeTransformedData(newVal);
                // code blow used to update view when data changed
                if (oldVal) {
                    this.$nextTick(function () {
                        // reset the scrollTop for container
                        // update view by handleScroll()
                        _this.$refs.vl.scrollTop = 0;
                        _this.handleScroll();
                    });
                }
            },
            immediate: true // when not in page mode, initailize data here
        },
        pageMode: function pageMode(newVal) {
            var _this2 = this;

            if (newVal) {
                window.addEventListener('scroll', this.handleScroll);
            } else {
                window.removeEventListener('scroll', this.handleScroll);
            }
            // recompute transformed data when pageMode changed
            this.computeTransformedData(this.data);
            this.$nextTick(function () {
                // reset the scrollTop for container
                // update view by handleScroll()
                _this2.$refs.vl.scrollTop = 0;
                _this2.handleScroll();
            });
        },
        fixedBlockHeight: function fixedBlockHeight() {
            // update view when fixedBlockHeight changed
            this.handleScroll();
        }
    },
    created: function created() {
        if (this.pageMode) {
            // add scroll onto window
            window.addEventListener('scroll', this.handleScroll);
        }
    },
    mounted: function mounted() {
        if (this.pageMode) {
            // in page mode, initialize transformed data here
            this.computeTransformedData(this.data);
        }
        // initialize view by calling updateVb
        this.updateVb(0);
    },
    destroyed: function destroyed() {
        if (this.pageMode) {
            window.removeEventListener('scroll', this.handleScroll);
        }
    },

    methods: {
        computeTransformedData: function computeTransformedData(oriArr) {
            // compute accumulative height value for each block
            // note the function related to the variable 'pageMode'
            // and when fixedRowHeight is specified, transformedData is not needed
            if (!this.fixedRowHeight && (this.pageMode && this.$refs.vl || !this.pageMode)) {
                var curHeight = this.pageMode ? this.$refs.vl.offsetTop : 0;
                var rt = [curHeight];
                oriArr.forEach(function (item) {
                    curHeight += item.height;
                    rt.push(curHeight);
                });
                this.transformedData = rt;
            }
        },
        handleScroll: function handleScroll() {
            var _this3 = this;

            // scrollTop is relative to the varible pageMode
            var scrollTop = this.pageMode ? window.pageYOffset : this.$refs.vl.scrollTop;
            // use requestAnimationFrame to ensure smooth scrolling visual effects
            window.requestAnimationFrame(function () {
                _this3.updateVb(scrollTop);
            });
        },
        binarySearchLowerBound: function binarySearchLowerBound(s, arr) {
            // used to search the lower bound in-viewport index for data array
            // when height is not fixed
            var lo = 0;
            var hi = arr.length - 1;
            var mid = void 0;
            while (lo <= hi) {
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
        binarySearchUpperBound: function binarySearchUpperBound(e, arr) {
            // used to search the upper bound in-viewport index for data array
            // when height is not fixed
            var lo = 0;
            var hi = arr.length - 1;
            var mid = void 0;
            while (lo <= hi) {
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
        fixedBlockHeightLowerBound: function fixedBlockHeightLowerBound(s, fixedBlockHeight) {
            // used to compute the lower bound in-viewport index for data array
            // when in fixed height mode
            var sAdjusted = this.pageMode ? s - this.$refs.vl.offsetTop : s;
            var computedStartIndex = ~~(sAdjusted / fixedBlockHeight);
            return computedStartIndex >= 0 ? computedStartIndex : 0;
        },
        fixedBlockHeightUpperBound: function fixedBlockHeightUpperBound(e, fixedBlockHeight) {
            // used to compute the upper bound in-viewport index for data array
            // when in fixed height mode
            var eAdjusted = this.pageMode ? e - this.$refs.vl.offsetTop : e;
            var compuedEndIndex = Math.ceil(eAdjusted / fixedBlockHeight);
            return compuedEndIndex <= this.data.length ? compuedEndIndex : this.data.length;
        },
        findBlocksInViewport: function findBlocksInViewport(s, e, heightArr, blockArr) {
            if (s < e) {
                var lo = this.fixedBlockHeight ? this.fixedBlockHeightLowerBound(s, this.fixedBlockHeight) : this.binarySearchLowerBound(s, heightArr);
                var hi = this.fixedBlockHeight ? this.fixedBlockHeightUpperBound(e, this.fixedBlockHeight) : this.binarySearchUpperBound(e, heightArr);

                var vlOffset = this.pageMode ? this.$refs.vl.offsetTop : 0;
                // set top spacer
                if (this.fixedBlockHeight) {
                    this.offsetTop = lo >= 0 ? lo * this.fixedBlockHeight : 0;
                } else {
                    this.offsetTop = lo >= 0 ? heightArr[lo] - vlOffset : 0;
                }
                // set bot spacer
                if (this.fixedBlockHeight) {
                    this.offsetBot = hi >= 0 ? (blockArr.length - hi) * this.fixedBlockHeight : 0;
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
        updateVb: function updateVb(scrollTop) {
            // compute the viewport start position and end position based on the scrollTop value
            var viewportHeight = this.pageMode ? window.innerHeight : this.height;
            this.viewportBegin = scrollTop;
            this.viewportEnd = scrollTop + viewportHeight;
            this.renderList = this.findBlocksInViewport(this.viewportBegin, this.viewportEnd, this.transformedData, this.data);
        }
    },
    computed: {
        containerStyle: function containerStyle() {
            return _extends({}, !this.pageMode && { height: this.height + 'px' }, !this.pageMode && { 'overflow-y': 'scroll' });
        }
    }
};

/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/component-normalizer.js":
/*!*********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/component-normalizer.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  scriptExports = scriptExports || {}

  // ES6 modules interop
  var type = typeof scriptExports.default
  if (type === 'object' || type === 'function') {
    scriptExports = scriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-54c2af52\",\"hasScoped\":false,\"optionsId\":\"1\",\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/VirtualBlock.vue":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-54c2af52","hasScoped":false,"optionsId":"1","buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/VirtualBlock.vue ***!
  \***********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',_vm._g({ref:"vl",style:(_vm.containerStyle)},_vm.pageMode ? {} : {scroll: _vm.handleScroll}),[_c('div',{style:({height: (_vm.offsetTop + "px")})}),_vm._v(" "),_vm._l((_vm.renderList),function(item){return _c('div',{key:("" + (item.id)),style:({height: ((_vm.fixedBlockHeight ? _vm.fixedBlockHeight : item.height) + "px")})},[_vm._t("default",null,{data:item})],2)}),_vm._v(" "),_c('div',{style:({height: (_vm.offsetBot + "px")})})],2)}
var staticRenderFns = []


/***/ }),

/***/ "./src/VirtualBlock.vue":
/*!******************************!*\
  !*** ./src/VirtualBlock.vue ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !babel-loader!../node_modules/vue-loader/lib/selector?type=script&index=0!./VirtualBlock.vue */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/VirtualBlock.vue");
/* harmony import */ var _babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _node_modules_vue_loader_lib_template_compiler_index_id_data_v_54c2af52_hasScoped_false_optionsId_1_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-54c2af52","hasScoped":false,"optionsId":"1","buble":{"transforms":{}}}!../node_modules/vue-loader/lib/selector?type=template&index=0!./VirtualBlock.vue */ "./node_modules/vue-loader/lib/template-compiler/index.js?{\"id\":\"data-v-54c2af52\",\"hasScoped\":false,\"optionsId\":\"1\",\"buble\":{\"transforms\":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/VirtualBlock.vue");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_component_normalizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/vue-loader/lib/runtime/component-normalizer */ "./node_modules/vue-loader/lib/runtime/component-normalizer.js");
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null

var Component = Object(_node_modules_vue_loader_lib_runtime_component_normalizer__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_0___default.a,
  _node_modules_vue_loader_lib_template_compiler_index_id_data_v_54c2af52_hasScoped_false_optionsId_1_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_1__["render"],
  _node_modules_vue_loader_lib_template_compiler_index_id_data_v_54c2af52_hasScoped_false_optionsId_1_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_VirtualBlock_vue__WEBPACK_IMPORTED_MODULE_1__["staticRenderFns"],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _VirtualBlock = __webpack_require__(/*! ./VirtualBlock.vue */ "./src/VirtualBlock.vue");

var _VirtualBlock2 = _interopRequireDefault(_VirtualBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = {
    install: function install(Vue, options) {
        Vue.component("VirtualBlock", _VirtualBlock2.default);
    }
};

exports.default = plugin;

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map