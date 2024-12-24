### setState 是否需要放在依赖数组中

不需要。React 保证 setState 函数在组件的整个生命周期中是稳定的（stable）。它的引用永远不会改变。

React 官方文档中明确说明的一点：setState 函数是那些不需要添加到依赖列表中的特殊值之一，其他类似的值还包括：

useRef 返回的 ref 对象

dispatch 函数（来自 useReducer）

[Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies#are-you-reading-some-state-only-to-calculate-the-next-state)

[Parameters](https://react.dev/reference/react/useCallback#parameters)

### React 组件，必须始终返回一个有效的 JSX 元素或 null。什么是有效的 JSX 元素

1. HTML 原生标签
2. React 组件
3. React Fragment
4. 数组（但每个元素都需要唯一的 key）
5. 字符串或数字
6. null 或 false（表示不渲染任何内容）
7. Portal（使用 ReactDOM.createPortal）

无效的 JSX 返回值包括：

- undefined
- true
- 对象（除非是有效的 React 元素对象）
- 函数
- 没有 key 的数组元素

注意事项：

- JSX 必须有一个根元素（或使用 Fragment）
- 所有标签必须正确闭合
- 组件名称必须以大写字母开头
- 属性名使用驼峰命名法（除了 data- 和 aria- 属性）
