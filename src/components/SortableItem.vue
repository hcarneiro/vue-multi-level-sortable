<template>
  <template v-for="item in tree">
    <div class="sortable-item" :style="item.style" :track-by="$index">
      <div class="item-content">
        <div v-for="i in item.indentation" class="item-indentation"></div>
        <div class="item-wrapper">
          <div class="item-icon"></div>
          <div class="item-title">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  props: {
    tree: {
      type: Array,
    },
  },
};
</script>
