<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div ref="sortableArea" class="inner-sortable-container">
        <Multi-Level-Sortable :tree="data"></Multi-Level-Sortable>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import MultiLevelSortable from './components/MultiLevelSortable';

export default {
  name: 'App',
  data() {
    return {
      sortable: undefined,
      data: [
        {
          title: 'Header',
          children: [
            {
              title: 'Paragraph',
              children: [],
            },
          ],
        },
        {
          title: 'Container',
          children: [
            {
              title: 'Paragraph',
              children: [],
            },
          ],
        },
      ],
    };
  },
  components: {
    MultiLevelSortable,
  },
  mounted() {
    const { sortableArea } = this.$refs;

    this.sortable = Sortable.create(sortableArea, {
      group: 'nested',
      direction: 'vertival',
      swapThreshold: 0.40,
      invertSwap: true,
      animation: 500,
      forceFallback: true,
    });
  },
};
</script>
