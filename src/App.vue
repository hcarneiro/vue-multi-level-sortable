<template>
  <div id="app">
    <h1 class="title is-1">Vue Multi-level Sortable</h1>
    <div class="container main-sortable-container">
      <div class="sortable-title">Sortable items</div>
      <div class="inner-sortable-container">
        <Sortable-Item :tree="flatData"></Sortable-Itemt>
      </div>
    </div>
  </div>
</template>

<script>
import SortableItem from './components/SortableItem';

export default {
  data() {
    return {
      flatData: [],
      defaultTop: 24,
      elementTop: 0,
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
  },
  created() {
    this.flatten({
      data: this.data,
    });
  },
  ready() {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let element;

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

    function closeDragElement() {
      /* stop moving when mouse button is released: */
      document.onmouseup = null;
      document.onmousemove = null;
    }

    function elementDrag(evt) {
      const event = evt || window.event;

      // calculate the new cursor position:
      pos1 = pos3 - event.clientX;
      pos2 = pos3 - event.clientY;
      pos3 = event.clientY;

      const trans = getComputedStyle(element).getPropertyValue('transform');
      const matrix = trans.replace(/[^0-9\-.,]/g, '').split(',');
      const ty = parseFloat((matrix.length > 6) ? matrix[13] : matrix[5]);

      console.log('Horizontal size', element.offsetLeft - pos1);
      // element.style.left = `${element.offsetLeft - pos1}px`;

      element.style.transform = `translateY(${ty + (element.offsetTop - pos2)}px)`;
    }

    function dragMouseDown(evt) {
      const event = evt || window.event;

      element = event.target;

      // get the mouse cursor position at startup:
      pos3 = event.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    const elements = document.querySelectorAll('.sortable-item');

    for (let i = 0; i < elements.length; i += 1) {
      elements[i].onmousedown = dragMouseDown;
    }
  },
};
</script>
