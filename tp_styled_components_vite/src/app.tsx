// 两种导入方式，功能上好像没有区别
// import { styled } from 'styled-components';
import styled, { css } from 'styled-components';

export default function App() {
  return (
    <>
      <h1>styled-components</h1>
      <V6Span style={{ color: 'red' }}>V6 span</V6Span>
      <V5Span>V5 span</V5Span>
      <Button>Button</Button>
      <PrimaryButton>PrimaryButton</PrimaryButton>
      <SecondaryButton>SecondaryButton</SecondaryButton>
    </>
  );
}

// 貌似 styled-components@6.1.13
// 可以 <Span style={{ color: 'red' }}></Span>
// 不需要写 props 了
const V6Span = styled.span``;

interface V5SpanProps {
  color?: React.CSSProperties['color'];
  // children?: React.ReactNode;
}

// styled-components@5.3.5
// 这样写没有提示，但是生效，且覆盖 props.color
// <Span style={{ color: 'red' }}></Span>
const V5Span = styled.span<V5SpanProps>`
  color: ${(props) => props?.color ?? 'inherit'};
`;

const Button = styled.button`
  background-color: ${(props) => props.color || 'gray'};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const BaseButton = styled.button`
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

// 包含 BaseButton 的 props
const PrimaryButton = styled(BaseButton)`
  background-color: blue;
`;

const buttonStyles = css`
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const SecondaryButton = styled.button`
  ${buttonStyles}
  background-color: green;
`;

// React 的 defaultProps
