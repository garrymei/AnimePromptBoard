// 类型定义文件 - Anime Prompt Board

declare global {
  interface Window {
    api: {
      listEntries: () => Promise<Entry[]>;
      saveEntries: (entries: Entry[]) => Promise<{ ok: boolean }>;
      saveMediaDataURL: (payload: SaveMediaPayload) => Promise<SaveMediaResult>;
      resolveMediaURL: (relPath: string) => Promise<{ ok: boolean; url?: string; error?: string }>;
      openUserData: () => Promise<{ ok: boolean; path?: string }>;
      exportJSON: (data: Entry[]) => Promise<{ ok: boolean; path?: string; error?: string }>;
      importJSON: () => Promise<{ ok: boolean; data?: Entry[]; error?: string }>;
      getSettings: () => Promise<Settings>;
      chooseDir: () => Promise<{ ok: boolean; path?: string }>;
      setDataRoot: (path: string) => Promise<{ ok: boolean; error?: string }>;
    };
  }
}

// 核心数据类型
export interface Entry {
  id: number;
  title: string;
  imagePath: string;
  thumbnailPath?: string;
  prompts: PromptsByCategory;
  tags: string[];
  fileKey?: string;
  createdAt: string;
}

export interface PromptsByCategory {
  base_styles: PromptContent;
  artistic_styles: PromptContent;
  cinematic: PromptContent;
  lighting_mood: PromptContent;
  theme_styles: PromptContent;
  rendering: PromptContent;
  effects: PromptContent;
  typography: PromptContent;
}

export interface PromptContent {
  en: string;
  zh: string;
}

export type CategoryKey = keyof PromptsByCategory;

export interface CategoryMapping {
  patterns: RegExp[];
  key: CategoryKey;
  name: string;
  zhName: string;
}

// API 相关类型
export interface SaveMediaPayload {
  dataUrl: string;
  filenameBase: string;
  thumbnail?: string;
}

export interface SaveMediaResult {
  ok: boolean;
  path?: string;
  thumbnail?: string;
  error?: string;
}

export interface Settings {
  dataRoot?: string;
}

// UI 组件类型
export interface GalleryCardProps {
  entry: Entry;
  onClick: (entryId: number) => void;
}

export interface TagEditorProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export interface CategoryEditorProps {
  categoryKey: CategoryKey;
  prompt: PromptContent;
  mapping: CategoryMapping;
  onChange: (category: CategoryKey, lang: 'en' | 'zh', value: string) => void;
  onCopy: (category: CategoryKey) => void;
  onTranslate: (category: CategoryKey) => void;
}

// 工具函数类型
export type DebounceFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export interface ParseResult {
  [key in CategoryKey]: PromptContent;
}

export {};
