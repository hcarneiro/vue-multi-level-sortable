<template>
  <div class="item-content">
    <div
      v-for="(item, index) in indentation"
      :key="index"
      class="item-indentation"
    ></div>
    <div class="item-wrapper">
      <div class="item-icon"></div>
      <div class="item-title">{{ title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortableItemContent',
  props: {
    title: String,
    indentation: Array,
  },
};
</script>
