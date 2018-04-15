import VirtualList from './VirtualList.vue';

const plugin = {
    install(Vue, options) {
        Vue.component("VirtualList", VirtualList);
    }
}

export default plugin;