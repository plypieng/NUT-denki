declare module 'react-tagcloud' {
  export interface TagCloudProps {
    tags: Array<{
      value: string;
      count: number;
      key?: string;
    }>;
    minSize?: number;
    maxSize?: number;
    className?: string;
    shuffle?: boolean;
    colorOptions?: {
      luminosity?: 'light' | 'dark' | 'bright';
      hue?: string | string[];
    };
    renderer?: (tag: { value: string; count: number; key?: string }, size: number) => JSX.Element;
    onClick?: (tag: { value: string; count: number; key?: string }) => void;
  }

  export const TagCloud: React.FC<TagCloudProps>;
}
