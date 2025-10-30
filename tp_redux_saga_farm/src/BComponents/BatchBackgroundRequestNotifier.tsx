import prettyBytes from 'pretty-bytes';
import { useEffect, useCallback, useRef, useState } from 'react';
import { Button, notification, Popconfirm, Progress, Tooltip } from 'antd';
import { ArrowsAltOutlined, CheckCircleFilled, CloseCircleFilled, CloseOutlined, ShrinkOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { batchBackgroundRequestActions } from '@/store/reducers/batchBackgroundRequestSlice';
import type { RequestItem } from '@/store/reducers/batchBackgroundRequestSlice';

const { cancelBatch, cancelUpload, removeBatch, retryUpload, toggleBatchMinimization } = batchBackgroundRequestActions;

export function BatchBackgroundRequestNotifier() {
  const batches = useAppSelector((state) => state?.batchBackgroundRequest?.batches);
  const dispatch = useAppDispatch();
  const activeNotifications = useRef<Set<string>>(new Set());
  const [api, contextHolder] = notification.useNotification({
    // 不关闭，会触发循环依赖的问题(notification 内部)
    stack: false,
  });
  const getContent = useCallback(
    (
      requestArray: RequestItem[],
      batchId: string,
      isMinimized: boolean,
      windowTitle?: string,
      onClose?: () => void,
      inPendingAndUploadingPopconfirmTitle?: string
    ) => {
      return (
        <NotificationDescription
          requestArray={requestArray}
          batchId={batchId}
          isMinimized={isMinimized}
          dispatch={dispatch}
          windowTitle={windowTitle}
          onClose={onClose}
          inPendingAndUploadingPopconfirmTitle={inPendingAndUploadingPopconfirmTitle}
        />
      );
    },
    [dispatch]
  );

  useEffect(() => {
    const currentBatchIds = new Set(batches.map((b) => b.id));

    /**
     * 关闭已不存在批次的通知，这是原本的作用。
     *
     * 点击窗口关闭按钮，不需要 destroy 是因为这里，
     * batches 会更新数据，useEffect 依赖项变更触发这里。巧合。
     */
    activeNotifications.current.forEach((batchId) => {
      if (!currentBatchIds.has(batchId)) {
        api.destroy(batchId);
        activeNotifications.current.delete(batchId);
      }
    });

    // 打开或更新当前批次的通知
    batches.forEach((batch) => {
      const { id: batchId, requestArray, minimized: isMinimized, afterSuccess: batchAfterSuccess, windowTitle, inPendingAndUploadingPopconfirmTitle } = batch;

      const handleClose = () => {
        dispatch(cancelBatch({ batchId }));
        dispatch(removeBatch({ batchId }));
      };

      const requestArrayDone = requestArray.every((ri: RequestItem) => ri.status === 'success');
      if (requestArrayDone) {
        batchAfterSuccess?.();
        setTimeout(() => {
          dispatch(removeBatch({ batchId }));
        }, 3000);
      }

      api.open({
        key: batchId,
        message: false,
        description: getContent(requestArray, batchId, isMinimized, windowTitle, handleClose, inPendingAndUploadingPopconfirmTitle),
        duration: null,
        // onClose: handleClose,
        // 自定义关闭按钮
        closeIcon: false,
        placement: 'bottomRight',
        className: 'batchBackgroundRequestNotifier',
        style: {
          padding: 0,
        },
      });

      if (!activeNotifications.current.has(batchId)) {
        activeNotifications.current.add(batchId);
      }
    });
  }, [batches, dispatch, getContent]);

  return <>{contextHolder}</>;
}

interface NotificationDescriptionProps {
  batchId: string;
  isMinimized: boolean;
  requestArray: RequestItem[];
  dispatch?: ReturnType<typeof useAppDispatch>;
  windowTitle?: string;
  onClose?: () => void;
  inPendingAndUploadingPopconfirmTitle?: string;
}

const showPopconfirmSet = new Set(['pending', 'uploading']);

function NotificationDescription(props: NotificationDescriptionProps) {
  const { requestArray, batchId, isMinimized, dispatch, windowTitle, onClose, inPendingAndUploadingPopconfirmTitle } = props;
  const [openPopconfirm, setOpenPopconfirm] = useState(false);
  const requestArrayTotal = requestArray.length;
  const confirm = () => {
    setOpenPopconfirm(false);
    onClose?.();
  };
  const cancel = () => {
    setOpenPopconfirm(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpenPopconfirm(newOpen);
      return;
    }
    if (requestArray.filter((ri) => showPopconfirmSet.has(ri.status)).length > 0) {
      setOpenPopconfirm(newOpen);
    } else {
      confirm();
    }
  };
  const handleRetry = (requestItemId: string) => dispatch?.(retryUpload({ requestItemId }));
  const handleCancel = (requestItemId: string) => dispatch?.(cancelUpload({ requestItemId }));
  const renderStatus = (item: RequestItem) => {
    const status = item.status;
    const total = item.progress?.total;
    switch (status) {
      case 'pending':
      case 'uploading':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {typeof total === 'number' ? (
              <span style={{ fontSize: '12px', color: 'var(--ant-color-text-secondary)' }}>
                {prettyBytes(item.progress?.loaded ?? 0)}/{prettyBytes(total)}
              </span>
            ) : null}
            {status === 'pending' ? <span style={{ fontSize: '12px', color: 'var(--ant-color-text-secondary)' }}>等待上传</span> : null}
            <Progress percent={item.progress.percent} type="circle" showInfo={false} size={20} />
          </div>
        );
      case 'success':
        return <CheckCircleFilled style={{ color: 'var(--ant-color-success)' }} />;
      case 'error':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tooltip title={item?.error} placement="left" getPopupContainer={(triggerNode) => triggerNode}>
              <CloseCircleFilled style={{ color: 'var(--ant-color-error)' }} />
            </Tooltip>
            <Button onClick={() => handleRetry(item.id)} type="link" size="small" style={{ padding: 0 }}>
              点击重试
            </Button>
          </div>
        );
      case 'cancelled':
        return <span style={{ fontSize: '12px', color: 'var(--ant-color-text-secondary)' }}>已取消</span>;
    }
  };

  const messageNode = (
    <div>
      <div
        style={{
          padding: '10px',
          borderBottom: '1px solid var(--ant-color-split)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600 }}>{windowTitle}</span>
        <span>
          ({requestArray.filter((ri) => ri.status === 'success').length}/{requestArray.length})
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch?.(toggleBatchMinimization({ batchId }));
              }}
              type="text"
              size="small"
              style={{ padding: 0, color: 'var(--ant-color-icon)' }}
              icon={isMinimized ? <ArrowsAltOutlined /> : <ShrinkOutlined />}
            />
            <Popconfirm
              title={inPendingAndUploadingPopconfirmTitle}
              open={openPopconfirm}
              onOpenChange={handleOpenChange}
              onConfirm={confirm}
              onCancel={cancel}
              placement="left"
              // 会触发 button 标签嵌套的提示
              getPopupContainer={(triggerNode) => triggerNode}
            >
              {/* 加 span 标签，防止触发 button 标签嵌套 */}
              <span>
                <Button type="text" size="small" style={{ padding: 0, color: 'var(--ant-color-icon)' }} icon={<CloseOutlined />} />
              </span>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );

  const descriptionNode = (
    <div style={{ maxHeight: '250px', overflow: 'auto' }}>
      {requestArray.map((item, index) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '10px',
            borderBottom: index === requestArrayTotal - 1 ? 'none' : '1px solid var(--ant-color-split)',
          }}
          key={item.id}
        >
          <div style={{ minWidth: 0, flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item?.itemTitle}>
            {item?.itemTitle}
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderStatus(item)}
            {(item.status === 'pending' || item.status === 'uploading') && (
              <Button onClick={() => handleCancel(item.id)} type="link" size="small" style={{ padding: 0 }}>
                取消上传
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {messageNode}
      {!isMinimized && descriptionNode}
    </div>
  );
}
