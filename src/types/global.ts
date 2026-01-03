export interface BufferInfo{
  realUrl: string;
  buffer: ArrayBuffer;
}

export interface ILinks{
  realUrl: string;
  blobUrl: string;
}

export interface IRouter{
    // Root (first) element of the path
    path: string;
    targetSelector: string;
    // If void, then there is no need to register an observer
    callback: (parentTag?: HTMLElement | null) => MutationObserver | void;
}

export type IStyles = Record<string, string>;

export interface SelectorsConfig {
  container: string;
  tools: string;
  toolsCss: IStyles;
}

export type PageSelectors = Record<string, SelectorsConfig>;
