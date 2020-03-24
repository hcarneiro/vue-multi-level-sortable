import SortableItemContent from './SortableItemContent.vue';

export default {
  functional: true,
  props: {
    tree: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  render(createElement, { props }) {
    const flat = [];

    function flatten(data, depth) {
      const depthRef = typeof depth !== 'undefined' ? depth + 1 : 0;

      data.forEach((item, index) => {
        const itemCopy = item;

        itemCopy.index = index;
        itemCopy.depth = depthRef;
        itemCopy.indentation = new Array(depthRef);

        flat.push(itemCopy);

        if (item.children.length) {
          flatten(item.children, depthRef);
        }
      });
    }

    flatten(props.tree);

    return flat.map((element) => createElement('div', {
      attrs: {
        'data-index': element.index,
        'data-depth': element.depth,
        class: 'sortable-item',
      },
    },
    [
      createElement(SortableItemContent, {
        props: {
          title: element.title,
          indentation: element.indentation,
        },
      }),
    ]));
  },
};
