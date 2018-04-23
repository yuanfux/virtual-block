import VirtualBlock from './VirtualBlock.vue';

const plugin = {
    install(Vue, options) {
        Vue.component("VirtualBlock", VirtualBlock);
    }
}

export default plugin;