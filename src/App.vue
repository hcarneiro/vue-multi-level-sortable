<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div class="inner-sortable-container">
        <Multi-Level-Sortable :tree="data"></Multi-Level-Sortable>
      </div>
    </div>
  </div>
</template>

<script>
import MultiLevelSortable from './components/MultiLevelSortable.vue';

export default {
  name: 'App',
  data() {
    return {
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
};
</script>
