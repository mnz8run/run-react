// 形式
// 字符串
// 回调函数
// Ref 对象（createRef, useRef）

// 相关 api
// createRef
// useRef
// forwardRef
// useImperativeHandle

// 函数签名

// createRef
// 17
// function createRef<T>(): RefObject<T>;
// 18
// function createRef<T>(): RefObject<T>;
// 19
// function createRef<T>(): RefObject<T | null>;

// useRef
// 17
// function useRef<T>(initialValue: T): MutableRefObject<T>;
// function useRef<T>(initialValue: T | null): RefObject<T>;
// function useRef<T = undefined>(): MutableRefObject<T | undefined>;
// 18
// function useRef<T>(initialValue: T): MutableRefObject<T>;
// function useRef<T>(initialValue: T | null): RefObject<T>;
// function useRef<T = undefined>(initialValue?: undefined): MutableRefObject<T | undefined>;
// 19
// function useRef<T>(initialValue: T): RefObject<T>;
// function useRef<T>(initialValue: T | null): RefObject<T | null>;
// function useRef<T>(initialValue: T | undefined): RefObject<T | undefined>;

// forwardRef
// 17
// function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
// 18
// function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
// 19
// function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, PropsWithoutRef<P>>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

// useImperativeHandle
// 17
// function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
// 18
// function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;
// 19
// function useImperativeHandle<T, R extends T>(ref: Ref<T> | undefined, init: () => R, deps?: DependencyList): void;

// 类型

// RefObject
// 17
// interface RefObject<T> {
//   readonly current: T | null;
// }
// 18
// interface RefObject<T> {
//   readonly current: T | null;
// }
// 19
// interface RefObject<T> {
//   current: T;
// }

// MutableRefObject
// 17
// interface MutableRefObject<T> {
//   current: T;
// }
// 18
// interface MutableRefObject<T> {
//   current: T;
// }
// 19
// interface MutableRefObject<T> {
//   current: T;
// }

// ForwardRefRenderFunction
// 17
// interface ForwardRefRenderFunction<T, P = {}> {
//   (props: PropsWithChildren<P>, ref: ForwardedRef<T>): ReactElement | null;
//   displayName?: string | undefined;
//   defaultProps?: never | undefined;
//   propTypes?: never | undefined;
// }
// 18
// interface ForwardRefRenderFunction<T, P = {}> {
//   (props: P, ref: ForwardedRef<T>): ReactNode;
//   displayName?: string | undefined;
//   defaultProps?: never | undefined;
//   propTypes?: never | undefined;
// }
// 19
// interface ForwardRefRenderFunction<T, P = {}> {
//   (props: P, ref: ForwardedRef<T>): ReactNode;
//   displayName?: string | undefined;
//   propTypes?: any;
// }

// PropsWithChildren
// 17
// type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
// 18
// type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
// 19
// type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };

// ForwardedRef
// 17
// type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;
// 18
// type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;
// 19
// type ForwardedRef<T> = ((instance: T | null) => void) | RefObject<T | null> | null;

// ForwardRefExoticComponent
// 17
// interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
//   defaultProps?: Partial<P> | undefined;
//   propTypes?: WeakValidationMap<P> | undefined;
// }
// 18
// interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
//   defaultProps?: Partial<P> | undefined;
//   propTypes?: WeakValidationMap<P> | undefined;
// }
// 19
// interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
//   propTypes?: any;
// }

// NamedExoticComponent
// 17
// interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
//   displayName?: string | undefined;
// }
// 18
// interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
//   displayName?: string | undefined;
// }
// 19
// interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
//   displayName?: string | undefined;
// }

// ExoticComponent
// 17
// interface ExoticComponent<P = {}> {
//   (props: P): ReactElement | null;
//   readonly $$typeof: symbol;
// }
// 18
// interface ExoticComponent<P = {}> {
//   (props: P): ReactNode;
//   readonly $$typeof: symbol;
// }
// 19
// interface ExoticComponent<P = {}> {
//   (props: P): ReactNode;
//   readonly $$typeof: symbol;
// }

// PropsWithoutRef
// 17
// type PropsWithoutRef<P> = P extends any ? ('ref' extends keyof P ? Omit<P, 'ref'> : P) : P;
// 18
// type PropsWithoutRef<P> = P extends any ? ('ref' extends keyof P ? Omit<P, 'ref'> : P) : P;
// 19
// type PropsWithoutRef<Props> = Props extends any ? ('ref' extends keyof Props ? Omit<Props, 'ref'> : Props) : Props;

// RefAttributes
// 17
// interface RefAttributes<T> extends Attributes {
//   ref?: Ref<T> | undefined;
// }
// 18
// interface RefAttributes<T> extends Attributes {
//   ref?: LegacyRef<T> | undefined;
// }
// 19
// interface RefAttributes<T> extends Attributes {
//   ref?: Ref<T> | undefined;
// }

// Attributes
// 17
// 18
// 19

// LegacyRef
// 17
// type LegacyRef<T> = string | Ref<T>;
// 18
// type LegacyRef<T> = string | Ref<T>;
// 19
// type LegacyRef<T> = Ref<T>;

// Ref
// 17
// type Ref<T> = RefCallback<T> | RefObject<T> | null;
// 18
// type Ref<T> = RefCallback<T> | RefObject<T> | null;
// 19
// type Ref<T> = RefCallback<T> | RefObject<T | null> | null;

// RefCallback
// 17
// type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
// 18
// interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES {}
// type RefCallback<T> = {
//   bivarianceHack(
//     instance: T | null
//   ): void | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES];
// }['bivarianceHack'];
// 19
// const UNDEFINED_VOID_ONLY: unique symbol;
// type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };
// interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES {}
// type RefCallback<T> = {
//   bivarianceHack(
//     instance: T | null
//   ):
//     | void
//     | (() => VoidOrUndefinedOnly)
//     | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES];
// }['bivarianceHack'];
