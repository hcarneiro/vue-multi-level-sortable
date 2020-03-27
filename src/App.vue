<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div v-el:container class="inner-sortable-container">
        <Sortable-Item :tree="flatData"></Sortable-Itemt>
      </div>
    </div>
  </div>
</template>

<script>
import { findIndex, cloneDeep } from 'lodash';
import SortableItem from './components/SortableItem';

export default {
  data() {
    return {
      flatData: [],
      defaultTop: 24,
      elementTop: 0,
      pos1: 0,
      pos2: 0,
      pos3: 0,
      element: undefined,
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
    SortableItem,
  },
  methods: {
    flatten(options) {
      const flatOptions = options || {};
      const depthRef = typeof flatOptions.depth !== 'undefined' ? flatOptions.depth + 1 : 0;

      if (!Array.isArray(flatOptions.data)) {
        return;
      }

      flatOptions.data.forEach((item, index) => {
        const itemCopy = item;

        this.elementTop = typeof flatOptions.top !== 'undefined'
          ? flatOptions.top + this.defaultTop
          : this.elementTop + this.elementTop;

        itemCopy.index = index;
        itemCopy.depth = depthRef;
        itemCopy.indentation = new Array(depthRef);

        const styleObject = {
          transform: `translate3d(0, ${this.elementTop}px, 0)`,
        };

        itemCopy.style = styleObject;
        itemCopy.top = this.elementTop;

        this.flatData.push(itemCopy);

        if (item.children.length) {
          this.flatten({
            data: item.children,
            depth: depthRef,
            top: this.elementTop,
          });
        }
      });
    },
    closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    },
    elementDrag(evt) {
      const event = evt || window.event;

      // calculate the new cursor position:
      this.pos1 = this.pos3 - event.clientX;
      this.pos2 = this.pos3 - event.clientY;
      this.pos3 = event.clientY;

      const trans = getComputedStyle(this.element).getPropertyValue('transform');
      const matrix = trans.replace(/[^0-9\-.,]/g, '').split(',');
      const ty = parseFloat((matrix.length > 6) ? matrix[13] : matrix[5]);

      // console.log('Horizontal size', this.element.offsetLeft - this.pos1);
      // element.style.left = `${element.offsetLeft - pos1}px`;

      const containerLimit = {
        top: 0,
        bottom: this.$els.container.offsetHeight
          - this.element.offsetHeight - 1, // 1px of top border
      };

      const yPosition = Math.min(containerLimit.bottom,
        Math.max(containerLimit.top,
          ty + (this.element.offsetTop - this.pos2)));

      this.element.style.transform = `translateY(${yPosition}px)`;

      const itemIndex = findIndex(this.flatData, (itemData) => {
        return yPosition > itemData.top && yPosition < (itemData.top + this.defaultTop);
      });

      if (typeof itemIndex === 'undefined') {
        return;
      }

      // Move item down
      const itemClone = cloneDeep(this.flatData[itemIndex]);

      itemClone.style.transform = `translateY(${itemClone.top + this.defaultTop}px)`;

      this.flatData.splice(itemIndex, 1);
      this.flatData.splice(itemIndex, 0, itemClone);
    },
    dragMouseDown(evt) {
      const event = evt || window.event;

      this.element = event.target;

      // get the mouse cursor position at startup:
      this.pos3 = event.clientY;
      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
    },
  },
  created() {
    this.flatten({
      data: this.data,
    });
  },
  ready() {
    // function isInViewPort(el) {
    //   const bounding = el.getBoundingClientRect();

    //   return (el.offsetTop - pos2 >= 1
    //     && el.offsetLeft - pos1 >= 1
    //     && (bounding.right - pos1 <= (window.innerWidth
    //       || document.documentElement.clientWidth)
    //     && bounding.bottom - pos2 <= (window.innerHeight
    //       || document.documentElement.clientHeight))
    //   );
    // }

    const elements = document.querySelectorAll('.sortable-item');

    for (let i = 0; i < elements.length; i += 1) {
      elements[i].onmousedown = this.dragMouseDown;
    }
  },
};
</script>