interface CategoryDataMap {
  files: File;
  functions: (...args: any[]) => any;
}

type Category = keyof CategoryDataMap;

interface StoreEvent {
  category: Category;
  action: 'set' | 'delete' | 'clear';
  id?: string;
}

/** 
## Redux 不建议存储不可序列化数据
Redux 要求状态可序列化，主要原因：
- 时间旅行调试：Redux DevTools 需要序列化状态
- 状态持久化：需要将状态保存到 localStorage
- 服务端渲染：需要在服务器和客户端之间传递状态
- 可预测性：序列化数据更容易追踪和调试
 */
class NonSerializableStore {
  private files = new Map<string, File>();
  private functions = new Map<string, (...args: any[]) => any>();
  private listeners = new Set<(event: StoreEvent) => void>();

  set(category: 'files', id: string, data: CategoryDataMap['files']): void;
  set(category: 'functions', id: string, data: CategoryDataMap['functions']): void;
  set(category: Category, id: string, data: any): void {
    switch (category) {
      case 'files':
        this.files.set(id, data);
        break;
      case 'functions':
        this.functions.set(id, data);
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
    this.notify(category, 'set', id);
  }

  get(category: 'files', id: string): CategoryDataMap['files'] | undefined;
  get(category: 'functions', id: string): CategoryDataMap['functions'] | undefined;
  get(category: Category, id: string): any {
    switch (category) {
      case 'files':
        return this.files.get(id);
      case 'functions':
        return this.functions.get(id);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  delete(category: Category, id: string): boolean {
    let result = false;
    switch (category) {
      case 'files':
        result = this.files.delete(id);
        break;
      case 'functions':
        result = this.functions.delete(id);
        break;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
    if (result) {
      this.notify(category, 'delete', id);
    }
    return result;
  }

  clear(category?: Category): void {
    if (category) {
      switch (category) {
        case 'files':
          this.files.clear();
          break;
        case 'functions':
          this.functions.clear();
          break;
        default:
          throw new Error(`Unknown category: ${category}`);
      }
      this.notify(category, 'clear');
    } else {
      // 清理所有
      (['files', 'functions'] as const).forEach((cat) => {
        const store = this[cat];
        store.clear();
      });
    }
  }

  has(category: Category, id: string): boolean {
    switch (category) {
      case 'files':
        return this.files.has(id);
      case 'functions':
        return this.functions.has(id);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  subscribe(listener: (event: StoreEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(category: Category, action: 'set' | 'delete' | 'clear', id?: string): void {
    const event: StoreEvent = { category, action, id };
    this.listeners.forEach((listener) => listener(event));
  }

  // 便捷方法
  setFile(id: string, file: CategoryDataMap['files']): void {
    this.set('files', id, file);
  }

  getFile(id: string): CategoryDataMap['files'] | undefined {
    return this.get('files', id);
  }

  deleteFile(id: string) {
    return this.delete('files', id);
  }

  setFunction(id: string, fn: CategoryDataMap['functions']): void {
    this.set('functions', id, fn);
  }

  getFunction(id: string): CategoryDataMap['functions'] | undefined {
    return this.get('functions', id);
  }

  // 获取统计信息
  getStats(): Record<string, number> {
    return {
      files: this.files.size,
      functions: this.functions.size,
    };
  }
}

// 导出单例
export const nsStore = new NonSerializableStore();
