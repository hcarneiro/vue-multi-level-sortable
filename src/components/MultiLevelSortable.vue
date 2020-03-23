/* eslint-disable */
<template>
  <fragment>
    <template v-for="(item, index) in tree">
      <div
        class="sortable-item"
        :data-depth="getDepth()"
        :data-index="getIndex(index)"
        :data-key="getKey(index)"
        :key="getKey(index)"
        v-drag
      >
        <div
          v-for="(item, index) in getIndentation(getDepth())"
          :key="index"
          class="item-indentation"
        ></div>
        <div class="item-wrapper">
          <div class="inner-item-wrapper">
            <div class="item-icon"></div>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <Multi-Level-Sortable
        :tree="item.children"
        :parent-depth="getDepth()"
        :parent-index="getIndex(index)"
        :key="getKey(index + 0.5)"
      ></Multi-Level-Sortable>
    </template>
  </fragment>
</template>

<script>
export default {
  name: 'MultiLevelSortable',
  props: {
    tree: {
      type: Array,
      default() {
        return [];
      },
    },
    parentDepth: {
      type: Number,
    },
    parentIndex: {
      type: Number,
    },
  },
  directives: {
    drag: {
      bind(el) {
        /* eslint-disable no-inner-declarations */

        // const expression = binding.expression;
        if (el) {
          function dragElement(elmnt) {
            let pos1 = 0;
            let pos2 = 0;
            let pos3 = 0;
            let pos4 = 0;
            const element = elmnt;

            function isInViewPort(elem) {
              const bounding = elem.getBoundingClientRect();

              return (elem.offsetTop - pos2 >= 1
                && elem.offsetLeft - pos1 >= 1
                && (bounding.right - pos1 <= (window.innerWidth
                  || document.documentElement.clientWidth)
                && bounding.bottom - pos2 <= (window.innerHeight
                  || document.documentElement.clientHeight)));
            }

            function elementDrag(e) {
              const event = e || window.event;

              // calculate the new cursor position:
              pos1 = pos3 - event.clientX;
              pos2 = pos4 - event.clientY;
              pos3 = event.clientX;
              pos4 = event.clientY;

              // set the element's new position:
              if (isInViewPort(element)) {
                element.style.top = `${element.offsetTop - pos2}px`;
                element.style.left = `${element.offsetLeft - pos1}px`;
              }
            }

            function closeDragElement() {
              /* stop moving when mouse button is released: */
              document.onmouseup = null;
              document.onmousemove = null;
            }

            function dragMouseDown(e) {
              const event = e || window.event;

              // get the mouse cursor position at startup:
              pos3 = event.clientX;
              pos4 = event.clientY;

              document.onmouseup = closeDragElement;
              document.onmousemove = elementDrag;
            }

            element.onmousedown = dragMouseDown;
          }

          dragElement(el);
        }
      },
    },
  },
  methods: {
    getDepth() {
      return typeof this.parentDepth !== 'undefined' ? this.parentDepth + 1 : 1;
    },
    getIndex(index) {
      return index;
    },
    getKey(index) {
      return typeof this.parentIndex !== 'undefined' ? `${this.parentIndex}.${index}` : `${index}`;
    },
    getIndentation(depth) {
      return new Array(depth);
    },
  },
};
</script>
