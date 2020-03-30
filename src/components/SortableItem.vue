<template>
  <div
    class="sortable-item"
    v-el:sortableitem
    :style="styles"
    :data-index="item.index"
    :data-depth="item.depth"
    :data-sort="index"
  >
    <div class="item-content">
      <div v-for="itm in item.indentation" class="item-indentation"></div>
      <div class="item-wrapper">
        <div class="item-icon"></div>
        <div class="item-title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  findIndex
} from 'lodash';
import bus from '../libs/bus';

export default {
  data() {
    return {
      defaultTop: 24,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      element: undefined
    };
  },
  props: {
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    fullData: {
      type: Array
    }
  },
  computed: {
    styles() {
      const yPosition = this.item.translateY;

      return {
        transform: `translateY(${yPosition}px)`
      };
    }
  },
  methods: {
    getTranslateY() {
      const trans = getComputedStyle(this.element).getPropertyValue('transform');
      const matrix = trans.replace(/[^0-9\-.,]/g, '').split(',');
      const translateY = parseFloat((matrix.length > 6) ? matrix[13] : matrix[5]);

      return translateY;
    },
    closeDragElement() {
      this.element.classList.remove('sortable-selected');

      document.onmouseup = null;
      document.onmousemove = null;

      // Snap to a multiple of 24
      this.item.translateY = this.roundToMultiple(this.getTranslateY());
      this.item.top = this.roundToMultiple(this.getTranslateY());

      bus.$emit('reoder-data');
    },
    roundToMultiple(n) {
      const lastItemIndex = this.fullData.length - 1;
      const indexDifference = lastItemIndex - this.index;
      const increment = indexDifference > 0 ? this.defaultTop + 1 : 1;
      const lastItemPosition = this.fullData[lastItemIndex].top;

      if (n > lastItemPosition) {
        const newNumber = lastItemPosition + increment;

        return Math.floor(newNumber / 24.0) * 24;
      }

      if (n > 24) {
        return Math.floor(n / 24.0) * 24;
      }

      return 0;
    },
    elementDrag(evt) {
      const event = evt || window.event;

      // Calculate the new cursor position:
      this.pos1 = this.pos3 - event.clientX;
      this.pos2 = this.pos3 - event.clientY;
      this.pos3 = event.clientY;

      // Get the translateY value
      const translateY = this.getTranslateY();

      // console.log('Horizontal size', this.element.offsetLeft - this.pos1);
      // element.style.left = `${element.offsetLeft - pos1}px`;

      // Create draggable limits
      const containerLimit = {
        top: 0,
        bottom: document.querySelector('.inner-sortable-container').offsetHeight
          - this.element.offsetHeight - 1 // 1px of top border
      };

      // Min and Max position given the limits
      const yPosition = Math.min(
        containerLimit.bottom,
        Math.max(
          containerLimit.top,
          translateY + (this.element.offsetTop - this.pos2)
        )
      );

      // Move element
      this.element.classList.add('sortable-selected');

      const elementIndex = parseInt(this.element.getAttribute('data-sort'), 10);
      const isGoingUp = yPosition < translateY;

      this.item.translateY = yPosition;

      // Find the index of the item being hovered by their position
      const itemIndex = findIndex(this.$parent.flatData, (itemData) => {
        return yPosition >= itemData.top
          && yPosition <= (itemData.top + this.defaultTop)
          && itemData !== this.item;
      });

      if (itemIndex < 0 || itemIndex === elementIndex) {
        return;
      }

      // Move hovered item
      const itemHovered = this.$parent.flatData[itemIndex];
      const newDefaultTop = isGoingUp ? this.defaultTop : -this.defaultTop;

      // Update hovered item position
      itemHovered.translateY = itemHovered.top + newDefaultTop;
      itemHovered.top = itemHovered.top + newDefaultTop;
    },
    dragMouseDown(evt) {
      const event = evt || window.event;

      this.element = event.target;

      // get the mouse cursor position at startup:
      this.pos3 = event.clientY;
      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
    },
    attachHandlers() {
      const element = this.$els.sortableitem;

      element.onmousedown = this.dragMouseDown;
    }
  },
  ready() {
    this.attachHandlers();
  }
};
</script>
