import type { RouteComponentProps } from 'react-router-dom';

interface RoutePropsSampleProps extends RouteComponentProps {}

export function RoutePropsSample(props: RoutePropsSampleProps) {
  const { location } = props;
  console.log('location', location);
  return <>展示如何使用 react-router 的 props</>;
}
