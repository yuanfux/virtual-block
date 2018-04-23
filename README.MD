# virtual-block
> only render what's visible

## Props
Name | Type | Default | Description
--- | --- | --- | ---
`data` | `Array<DataObject>` | - | **Required**. An Array of Object used as the source data.
`height` | `Number` | - | **Required when `pageMode` is `false`**. The height of the virtual block container.
`fixedBlockHeight` | `Number` | - | **Optional**. Specify this prop will assume every block has the same height value and the `height` keys in `data object` will be ignored. Note use `fixedBlockHeight` will improve the performance.
`pageMode` | `Boolean` | `true` | **Optional**. `True` assumes the scroller will be on the `window`. `false` assumes the scroller will be on the `virtual block container`.

## DataObject
Name | Type | Default | Description
--- | --- | --- | ---
`id` | String/Number | - | **Required**. Unique key for each virtual block.
`height` | Number | - | **Required when prop `fixedBlockHeight` is `not` specified**. The height of each virtual block.

## Usage

### Page Mode
```html
<VirtualBlock :data="blocks">
    <template slot-scope="{data}">
        <!-- self defined slots -->
    </template>
</VirtualBlock>
```

### Container Mode
```html 
<VirtualBlock :height="300" :pageMode="false" :data="blocks">
    <template slot-scope="{data}">
        <!-- self defined slots -->
    </template>
</VirtualBlock>
```

### Fixed Block Height
```html
<VirtualBlock :height="300" :pageMode="false" :fixedBlockHeight="50" :data="blocks">
    <template slot-scope="{data}">
        <!-- self defined slots -->
    </template>
</VirtualBlock>
```

### Unique virtual block
```html
<VirtualBlock :height="300" :pageMode="false" :data="blocks">
    <template slot-scope="{data}">
        <template v-if="data.id === 0">
            <!-- virtual block slot when id is 0 -->
        </template>
        <template v-if="data.id === 1">
            <!-- virtual block slot when id is 1 -->
        </template>
        <template v-else>
            <!-- other virtual block slots -->
        </template>
    </template>
</VirtualBlock>
```

## License
MIT