import { Layout, Typography } from 'antd';
import { UploadBatchButton } from './BComponents/UploadBatchButton';
import { BatchBackgroundRequestNotifier } from './BComponents/BatchBackgroundRequestNotifier';

const { Header, Content } = Layout;
const { Title } = Typography;

export function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', textAlign: 'center' }}>
        <Title level={3} style={{ color: 'white', lineHeight: '64px' }}>
          Global Upload Queue
        </Title>
      </Header>
      <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <UploadBatchButton />
      </Content>
      <BatchBackgroundRequestNotifier />
    </Layout>
  );
}
