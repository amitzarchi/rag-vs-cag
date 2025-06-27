import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

interface MemoizedMarkdownProps {
  content: string;
  id: string;
}

export const MemoizedMarkdown = memo(function MemoizedMarkdown({ content, id }: MemoizedMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        // Add any custom components here if needed
      }}
    >
      {content}
    </ReactMarkdown>
  );
}); 