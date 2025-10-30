import { Button } from 'antd';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { UploadOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store/hooks';
import { nsStore } from '@/store/nonSerializableStore';
import { batchBackgroundRequestActions } from '@/store/reducers/batchBackgroundRequestSlice';
import type { RequestItem } from '@/store/reducers/batchBackgroundRequestSlice';

const { addBatch } = batchBackgroundRequestActions;

export function UploadBatchButton() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const batchId = `batch-${uuidv4()}`;
    const files = event.target.files;
    if (files) {
      const requestArray: RequestItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const id = uuidv4();
        const file = files[i];
        nsStore.setFile(id, file);
        requestArray.push({
          id,
          apiKey: 'uploadFile',
          status: 'pending',
          progress: { percent: 0 },
          batchId,
          itemTitle: file.name,
        });
      }
      if (requestArray.length > 0) {
        dispatch(
          addBatch({
            id: batchId,
            requestArray,
            windowTitle: '文件上传',
            inPendingAndUploadingPopconfirmTitle: '取消剩余上传任务',
          })
        );
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} multiple />
      <Button icon={<UploadOutlined />} onClick={handleClick}>
        Click to Upload
      </Button>
    </>
  );
}
