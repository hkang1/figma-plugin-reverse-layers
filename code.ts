// This plugin reverses the order of selected layers
// that all belong to the same parent layer.
const selection: ReadonlyArray<SceneNode> = figma.currentPage.selection;
const order: number[] = [];
const nodes: SceneNode[] = [];
let errorMessage: string = null;
let nodeParent: (BaseNode & ChildrenMixin) = null;

const showErrorMessage = (eMessage: string): void => {
  figma.showUI(__html__);
  figma.ui.postMessage(eMessage);
  figma.ui.onmessage = message => {
    if (message === 'dismiss') {
      figma.closePlugin();
    }
  };
};

if (selection.length === 0) {
  figma.closePlugin();
} else {
  for (const node of selection) {
    if (node.parent == null ||
        (nodeParent != null && nodeParent.id != node.parent.id)) {
      errorMessage = 'The selected layers do not have the same parent layer. ' +
        'Please check all the selected layers to belong to the same layer.';
      break;
    } else {
      nodeParent = node.parent;
    }
    order.push(nodeParent.children.indexOf(node));
    nodes.unshift(node);
  }
}

if (errorMessage == null) {
  for (let i = 0; i < order.length; i++) {
    nodeParent.insertChild(order[i], nodes[i]);
  }
  figma.closePlugin();
} else {
  showErrorMessage(errorMessage);
}
