declare module 'react-quill' {
  import * as React from 'react';
  
  export interface ReactQuillProps {
    value?: string;
    onChange?: (content: string) => void;
    modules?: any;
    formats?: string[];
    theme?: string;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
  }

  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}

declare module 'react-quill/dist/quill.snow.css' {
  const content: any;
  export default content;
} 