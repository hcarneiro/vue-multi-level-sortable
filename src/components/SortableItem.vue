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
import Hammer from 'hammerjs/hammer';
import {
  findIndex
} from 'lodash';
import bus from '../libs/bus';

export default {
  data() {
    return {
      hammer: undefined,
      defaultTop: 24,
      positionX: 0,
      positionY: 0,
      pointerY: 0,
      element: undefined,
      sortingDirection: 'none',
      moved: false,
      animationDuration: 150
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
    animateValue(params) {
      const data = params || {};
      data.duration = data.duration || this.animationDuration;

      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) {
          startTimestamp = timestamp;
        }

        const progress = Math.min((timestamp - startTimestamp) / data.duration, 1);
        data.item.translateY = Math.floor(progress * (data.end - data.start) + data.start);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    },
    getTranslateY() {
      const trans = getComputedStyle(this.element).getPropertyValue('transform');
      const matrix = trans.replace(/[^0-9\-.,]/g, '').split(',');
      const translateY = parseFloat((matrix.length > 6) ? matrix[13] : matrix[5]);

      return translateY;
    },
    dragElementEnd() {
      this.element.classList.remove('sortable-selected');

      this.item.translateY = this.snapToPosition({
        value: this.getTranslateY(),
        reset: true
      });
      this.item.top = this.snapToPosition({
        value: this.getTranslateY(),
        reset: true
      });

      bus.$emit('reoder-data');
    },
    snapToPosition(params) {
      const data = params || {};

      let lastItemPosition;

      const lastItemIndex = this.fullData.length - 1;
      const indexDifference = lastItemIndex - this.index;
      const increment = indexDifference > 0 ? this.defaultTop + 1 : 1;

      if (data.itemHovered) {
        lastItemPosition = data.itemHovered.top;
      } else {
        lastItemPosition = this.fullData[lastItemIndex].top;
      }

      if (data.value > lastItemPosition) {
        const newNumber = lastItemPosition + increment;

        return Math.floor(newNumber / 24.0) * 24;
      }

      if (data.reset) {
        return this.sortingDirection === 'up'
          ? Math.ceil(data.value / 24.0) * 24
          : Math.floor(data.value / 24.0) * 24;
      }

      if (data.value > 24) {
        return Math.floor(data.value / 24.0) * 24;
      }

      return 0;
    },
    dragElement(evt) {
      const event = evt || window.event;

      // Calculate the new cursor position:
      this.positionX = this.pointerY - event.center.x;
      this.positionY = this.pointerY - event.center.y;
      this.pointerY = event.center.y;

      // Get the translateY value
      const translateY = this.getTranslateY();

      // TODO: Divide into function to handle vertical drags and horizontal drags
      // console.log('Horizontal size', this.element.offsetLeft - this.positionX);
      // element.style.left = `${element.offsetLeft - this.positionX}px`;

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
          // Creates resistance
          translateY + ((this.element.offsetTop - this.positionY) / 5)
        )
      );

      // Move element
      this.element.classList.add('sortable-selected');

      const elementIndex = parseInt(this.element.getAttribute('data-sort'), 10);
      this.sortingDirection = yPosition <= translateY
        ? 'up'
        : 'down';

      this.item.translateY = yPosition;

      // Find the index of the item being hovered by their position
      const itemIndex = findIndex(this.fullData, (itemData) => {
        const dragPadding = 5;
        const topMargin = this.sortingDirection === 'up'
          ? yPosition >= itemData.top
          : yPosition >= itemData.top - (this.defaultTop - dragPadding);
        const bottomMargin = this.sortingDirection === 'up'
          ? yPosition <= itemData.top + (this.defaultTop - dragPadding)
          : yPosition <= itemData.top;

        return topMargin
          && bottomMargin
          && itemData !== this.item;
      });

      if (itemIndex < 0 || itemIndex === elementIndex) {
        return;
      }

      // Move hovered item
      const itemHovered = this.fullData[itemIndex];
      const newDefaultTop = this.sortingDirection === 'up'
        ? this.defaultTop
        : -this.defaultTop;

      // Update hovered item's position
      this.animateValue({
        item: itemHovered,
        start: itemHovered.translateY,
        end: itemHovered.top + newDefaultTop,
        duration: this.animationDuration
      });

      itemHovered.top = itemHovered.top + newDefaultTop;

      bus.$emit('reoder-data');

      // Snap into new position
      this.$nextTick(() => {
        this.animateValue({
          item: this.item,
          start: this.item.translateY,
          end: this.snapToPosition({
            value: this.getTranslateY(),
            itemHovered
          }),
          duration: this.animationDuration
        });
      });
    },
    dragElementStart(evt) {
      const event = evt || window.event;

      this.element = event.target;

      this.pointerY = event.clientY;
    },
    attachHandlers() {
      const element = this.$els.sortableitem;

      this.hammer = new Hammer.Manager(element, {
        recognizers: [
          [Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]
        ]
      });

      this.hammer.on('pan', this.dragElement);
      this.hammer.on('panstart', this.dragElementStart);
      this.hammer.on('panend', this.dragElementEnd);
    }
  },
  ready() {
    this.attachHandlers();
  }
};
</script>
