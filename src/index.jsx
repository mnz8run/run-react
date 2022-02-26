// step1 The createElement Function
/**
 * const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
    )
 */

// React.createElement('div', { id: 'foo' }, React.createElement('a', null, 'bar'), React.createElement('b'));
// const container = document.getElementById("root")
// ReactDOM.render(element, container)

/**
 * 用 “element” 来代指 React Element， 用 “node” 来代指 DOM Element
 */

function createElement(type, props, ...children) {
  console.log('🚀 ~ file: index.jsx ~ line 20 ~ createElement ~ createElement');
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'object' ? child : createTextElement(child);
      }),
    },
  };
}

function createTextElement(text) {
  console.log('🚀 ~ file: index.jsx ~ line 33 ~ createTextElement ~ createTextElement');
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * 创建虚拟DOM
 */
function createDom(fiber) {
  console.log('🚀 ~ file: index.jsx ~ line 45 ~ createDom ~ createDom');
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (next) => (key) => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach((name) => {
      dom[name] = '';
    });
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 操作真实DOM
function commitRoot() {
  console.log('🚀 ~ file: index.jsx ~ line 57 ~ commitRoot ~ commitRoot');
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);

  currentRoot = wipRoot;
  wipRoot = null;
}

// add nodes to dom 递归地将所有节点添加到 dom 上
function commitWork(fiber) {
  console.log('🚀 ~ file: index.jsx ~ line 65 ~ commitWork ~ commitWork');
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// step2 The render Function
function render(element, container) {
  console.log('🚀 ~ file: index.jsx ~ line 78 ~ render ~ render');
  // nextUnitOfWork 置为 fiber 树的根节点
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 下一个工作单元
let nextUnitOfWork = null;
// work in progress root
let wipRoot = null;
// 上次提交到 DOM 节点的 fiber 树
let currentRoot = null;
// 保存要移除的 dom 节点
let deletions = null;

/**
 * 并发模式  Concurrent Mode
 * 代替了最开始的 render递归
 */
let a = 1;
function workLoop(deadline) {
  if (a === 1) {
    console.log('🚀 ~ file: index.jsx ~ line 102 ~ workLoop ~ workLoop');
    a++;
  }
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * Fiber 新一代的虚拟DOM
 *
 * 执行工作单元 对 Fiber 进行操作
 */
function performUnitOfWork(fiber) {
  console.log('🚀 ~ file: index.jsx ~ line 123 ~ performUnitOfWork ~ performUnitOfWork');
  // add dom node
  if (!fiber.dom) {
    // 创建fiber对应的DOM
    fiber.dom = createDom(fiber);
  }

  // 用户就有可能看到渲染未完全的 UI
  // if (fiber.parent) {
  //   // 添加到父节点     代替了 container.appendChild(dom);
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  const elements = fiber.props.children;

  reconcileChildren(fiber, elements);

  // return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// create new fibers
function reconcileChildren(wipFiber, elements) {
  console.log('🚀 ~ file: index.jsx ~ line 154 ~ reconcileChildren ~ reconcileChildren');
  let index = 0;
  // let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // null
  let oldFiber = wipFiber.alternate?.child; // undefined
  console.log('🚀 ~ file: index.jsx ~ line 212 ~ reconcileChildren ~ oldFiber', oldFiber);
  let prevSibling = null;

  while (index < elements.length || oldFiber !== undefined) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      // add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      // delete the oldFiber's node
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const container = document.getElementById('root');

const element = (
  <div>
    <h1>Hello World</h1>
    <h2>from Didact</h2>
  </div>
);

Didact.render(element, container);
