"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-amber-900 prose-a:text-green-700 prose-blockquote:border-l-amber-500 prose-blockquote:text-amber-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => {
            // Omit 'placeholder' and 'ref' props to avoid type errors
            const { placeholder, ref, ...rest } = props;
            return (
              <Image
                {...rest}
                src={props.src || ''}
                alt={props.alt || ''}
                width={800}
                height={400}
                className="rounded-lg shadow-md"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
