<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div class="inner-sortable-container">
        <Sortable-Item
          v-for="item in flatData"
          :full-data="flatData"
          :item="item"
          :index="$index"
        ></Sortable-Item>
      </div>
    </div>
  </div>
</template>

<script>
import {
  orderBy,
  cloneDeep
} from 'lodash';
import SortableItem from './components/SortableItem';
import bus from './libs/bus';

export default {
  data() {
    return {
      defaultTop: 24,
      flatData: [],
      data: [
        {
          title: 'Header',
          children: [
            {
              title: 'Paragraph',
              children: []
            }
          ]
        },
        {
          title: 'Container',
          children: [
            {
              title: 'Paragraph',
              children: []
            }
          ]
        }
      ]
    };
  },
  components: {
    SortableItem
  },
  methods: {
    flatten(options) {
      const $vm = this;
      const flatOptions = options || {};
      const flatData = [];
      let elementTop = 0;

      function compileObject(params) {
        const compileParams = params || {};
        const depthRef = typeof compileParams.depth !== 'undefined' ? compileParams.depth + 1 : 0;

        if (!Array.isArray(compileParams.data)) {
          return;
        }

        compileParams.data.forEach((item, index) => {
          const itemCopy = cloneDeep(item);

          elementTop = typeof compileParams.top !== 'undefined'
            ? compileParams.top + $vm.defaultTop
            : elementTop + elementTop;

          itemCopy.index = index;
          itemCopy.depth = depthRef;
          itemCopy.indentation = new Array(depthRef);
          itemCopy.translateY = elementTop;
          itemCopy.top = elementTop;

          flatData.push(itemCopy);

          if (item.children.length) {
            compileObject({
              data: item.children,
              depth: depthRef,
              top: elementTop
            });
          }
        });
      }

      compileObject(flatOptions);

      return flatData;
    },
    reorderData() {
      const newData = orderBy(this.flatData, 'translateY', 'asc');

      newData.forEach((item, index) => {
        this.flatData.$set(index, item);
      });
    }
  },
  created() {
    this.flatData = this.flatten({
      data: this.data
    });

    bus.$on('reoder-data', this.reorderData);
  },
  destroyed() {
    bus.$off('reoder-data', this.reorderData);
  }
};
</script>
