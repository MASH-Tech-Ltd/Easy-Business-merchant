import React, { useRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  richText?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, maxLength, richText, className = '', ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      innerRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const insertTag = (openTag: string, closeTag: string = '') => {
      if (!innerRef.current) return;
      const textarea = innerRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const selectedText = val.substring(start, end);
      const newText = val.substring(0, start) + openTag + selectedText + closeTag + val.substring(end);

      // Trigger standard React onChange by setting native value and dispatching event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
      nativeInputValueSetter?.call(textarea, newText);
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);

      // Restore focus and selection
      setTimeout(() => {
        textarea.focus();
        if (selectedText) {
          textarea.setSelectionRange(start, start + openTag.length + selectedText.length + closeTag.length);
        } else {
          textarea.setSelectionRange(start + openTag.length, start + openTag.length);
        }
      }, 0);
    };

    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {label} {required && <span className="text-red-500">*</span>}
            </label>
          )}
          {maxLength && (
            <span className="text-[10px] text-gray-400 font-medium">
              {(props.value as string)?.length || 0}/{maxLength}
            </span>
          )}
        </div>
        {/* Rich Text Toolbar */}
        {(richText || props.id === 'description') && (
          <div className="border border-b-0 border-gray-200 bg-gray-50/80 rounded-t-lg px-3 py-2 flex gap-3 text-gray-500 border-b border-gray-100">
            <button type="button" onClick={() => insertTag('<strong>', '</strong>')} className="text-sm font-serif font-bold hover:text-gray-900">B</button>
            <button type="button" onClick={() => insertTag('<i>', '</i>')} className="text-sm font-serif italic hover:text-gray-900">I</button>
            <button type="button" onClick={() => insertTag('<u>', '</u>')} className="text-sm font-serif underline hover:text-gray-900">U</button>
            <div className="w-px h-4 bg-gray-300 self-center"></div>
            <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="text-xs hover:text-gray-900">List</button>
            <button type="button" onClick={() => insertTag('<a href="">', '</a>')} className="text-xs hover:text-gray-900">Link</button>
          </div>
        )}
        <textarea
          ref={setRefs}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y ${
            (richText || props.id === 'description') ? 'rounded-t-none border-t-0' : ''
          } ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
