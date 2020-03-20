<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div class="inner-sortable-container">
        <div class="sortable-item" v-drag>
          <div class="item-wrapper">
            <div class="inner-item-wrapper">
              <div class="item-icon"></div>
              <div class="item-title">Body</div>
            </div>
          </div>
        </div>
        <div class="sortable-item" v-drag>
          <div class="item-indentation"></div>
          <div class="item-wrapper">
            <div class="item-icon"></div>
            <div class="item-title">Header</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import MultiLevelSortable from './components/MultiLevelSortable.vue';

export default {
  name: 'App',
  data() {
    return {
      positionOne: 0,
      positionTwo: 0,
      positionThree: 0,
      positionFour: 0,
      element: undefined,
    };
  },
  components: {},
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
    closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    },
    elementDrag(e) {
      const event = e || window.event;

      event.preventDefault();

      // calculate the new cursor position:
      this.positionOne = this.positionThree - event.clientX;
      this.positionTwo = this.positionFour - event.clientY;
      this.positionThree = event.clientX;
      this.positionFour = event.clientY;

      // set the element's new position:
      this.element.style.top = `${this.element.offsetTop - this.positionTwo}px`;
      this.element.style.left = `${this.element.offsetLeft - this.positionOne}px`;
    },
    dragMouseDown(e) {
      const event = e || window.event;

      event.preventDefault();

      // get the mouse cursor position at startup:
      this.positionThree = event.clientX;
      this.positionFour = event.clientY;

      document.onmouseup = this.closeDragElement;
      document.onmousemove = this.elementDrag;
    },
    dragElement(element) {
      this.element = element;
      this.element.onmousedown = this.dragMouseDown;
    },
  },
  mounted() {
    // this.dragElement(document.getElementById('my-element'));
  },
};
</script>
