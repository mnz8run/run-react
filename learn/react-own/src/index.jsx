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

// 下一个工作单元
let nextUnitOfWork = null;
// work in progress root
let wipRoot = null;
// 上次提交到 DOM 节点的 fiber 树
let currentRoot = null;
// 保存要移除的 dom 节点
let deletions = null;
// work in progress fiber
let wipFiber = null;
let hookIndex = null;

// step2 The render Function
function render(element, container) {
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

/**
 * 并发模式  Concurrent Mode
 * 代替了最开始的 render递归
 */
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 没有下个任务（next unit of work 为 undefined） 整颗树的变更提交（commit）到真实 DOM 上
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

/**
 * -------------------------------- 工作单元执行 --------------------------------
 * 工作单元执行并返回下一个工作单元
 * 区分函数组件、类组件
 * 对 Fiber 进行操作
 */
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 用户就有可能看到渲染未完全的 UI
  // if (fiber.parent) {
  //   // 添加到父节点     代替了 container.appendChild(dom);
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

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

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  // add dom node
  if (!fiber.dom) {
    // 创建fiber对应的DOM
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * 操作真实DOM 创建真实DOM
 */
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  // 虚拟DOM 更新 真实DOM
  updateDom(dom, {}, fiber.props);

  return dom;
}

// create new fibers
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  // let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // null
  let oldFiber = wipFiber.alternate?.child; // undefined
  let prevSibling = null;

  while (index < elements.length || oldFiber !== undefined) {
    const element = elements[index];
    let newFiber = null;
    const sameType = element?.type === oldFiber?.type;

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

/**
 * -------------------------------- 提交改变 --------------------------------
 */
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);

  currentRoot = wipRoot;
  wipRoot = null;
}

/**
 * 操作真实DOM 添加、更新、删除
 *
 * add nodes to dom 递归地将所有节点添加到 dom 上
 */
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

/**
 * 操作真实DOM 更新
 */
function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    // 不在nextprops 或者 新的
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLocaleLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    // 不在nextprops, 需要去掉的
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

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (next) => (key) => !(key in next);

/**
 * 操作真实DOM 删除
 */
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

/**
 * -------------------------------- JSX 调用 --------------------------------
 *
 * 创建虚拟DOM
 *
 */
function createElement(type, props, ...children) {
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
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * -------------------------------- Hooks --------------------------------
 */
function useState(initial) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook?.state ?? initial,
    queue: [],
  };

  const actions = oldHook?.queue ?? [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

const Didact = {
  createElement,
  render,
  useState,
};

/** @jsx Didact.createElement */
const container = document.getElementById('root');

function Counter() {
  const [state, setState] = Didact.useState(1);
  return <h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>;
}

const element = (
  <div>
    <div>123</div>
    <Counter />
  </div>
);

Didact.render(element, container);
