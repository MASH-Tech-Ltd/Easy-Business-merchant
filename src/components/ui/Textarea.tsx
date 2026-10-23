import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code,
  Eye,
  RemoveFormatting,
} from "lucide-react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  richText?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, required, maxLength, richText, className = "", ...props },
    ref,
  ) => {
    const isRich = Boolean(richText || props.id === "description");
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [isCodeView, setIsCodeView] = useState(false);
    const isFocusedRef = useRef(false);

    const setRefs = (element: HTMLTextAreaElement | null) => {
      innerRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const currentValue = typeof props.value === "string" ? props.value : "";

    // Synchronize contentEditable div with props.value when not actively focused
    useEffect(() => {
      if (!isRich || !editorRef.current) return;
      if (!isFocusedRef.current || editorRef.current.innerHTML === "") {
        if (editorRef.current.innerHTML !== currentValue) {
          editorRef.current.innerHTML = currentValue;
        }
      }
    }, [currentValue, isRich, isCodeView]);

    const handleEditorInput = () => {
      if (!editorRef.current) return;
      let html = editorRef.current.innerHTML;
      if (html === "<br>" || html === "<p><br></p>") {
        html = "";
      }
      if (props.onChange) {
        const syntheticEvent = {
          target: {
            name: props.name || props.id || "",
            id: props.id || "",
            value: html,
          },
        } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
        props.onChange(syntheticEvent);
      }
    };

    const executeCommand = (
      command: string,
      value: string | undefined = undefined,
    ) => {
      if (isCodeView) return;
      editorRef.current?.focus();
      document.execCommand(command, false, value);
      handleEditorInput();
    };

    const handleCreateLink = () => {
      if (isCodeView) return;
      const url = window.prompt(
        "Enter link URL (e.g. https://...):",
        "https://",
      );
      if (url && url.trim() && url !== "https://") {
        executeCommand("createLink", url.trim());
      }
    };

    if (isRich) {
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1.5">
            {label && (
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Visual Editor
              </span>
              {maxLength && (
                <span className="text-[10px] text-gray-400 font-medium">
                  {currentValue.length}/{maxLength}
                </span>
              )}
            </div>
          </div>

          {/* Visual WYSIWYG Toolbar */}
          <div className="border border-b-0 border-gray-200 bg-gray-50/90 rounded-t-lg px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-1 text-gray-600 select-none">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("bold");
                }}
                title="Bold (Ctrl+B)"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("italic");
                }}
                title="Italic (Ctrl+I)"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("underline");
                }}
                title="Underline (Ctrl+U)"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("removeFormat");
                }}
                title="Clear Formatting"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-4 bg-gray-300 mx-1"></div>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("insertUnorderedList");
                }}
                title="Bullet List"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  executeCommand("insertOrderedList");
                }}
                title="Numbered List"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCreateLink();
                }}
                title="Insert Link"
                className="p-1.5 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsCodeView(!isCodeView)}
              className={`text-[11px] font-medium px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                isCodeView
                  ? "bg-purple-100 text-[#5022C3] font-bold"
                  : "hover:bg-gray-200 text-gray-500"
              }`}
              title={
                isCodeView
                  ? "Switch to Visual Mode"
                  : "Switch to HTML Code View"
              }
            >
              {isCodeView ? (
                <>
                  <Eye className="w-3 h-3" /> Visual
                </>
              ) : (
                <>
                  <Code className="w-3 h-3" /> HTML Code
                </>
              )}
            </button>
          </div>

          {/* Visual WYSIWYG Editable Area (Tags kept behind the scene) */}
          {!isCodeView ? (
            <div
              ref={editorRef}
              contentEditable
              onFocus={() => {
                isFocusedRef.current = true;
              }}
              onBlur={() => {
                isFocusedRef.current = false;
                handleEditorInput();
              }}
              onInput={handleEditorInput}
              data-placeholder={
                props.placeholder || "Write product description here..."
              }
              style={{ lineHeight: "1.9" }}
              className={`visual-editor w-full px-4 py-3 border border-t-0 rounded-b-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] bg-white text-gray-900 min-h-[140px] max-h-[480px] overflow-y-auto leading-[1.9] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none [&_ul]:!list-disc [&_ul]:!pl-7 [&_ul]:!my-2 [&_ol]:!list-decimal [&_ol]:!pl-7 [&_ol]:!my-2 [&_li]:!list-item [&_li]:!mb-1 [&>p]:mb-2.5 ${
                error ? "border-red-300 bg-red-50/20" : "border-gray-200"
              } ${className}`}
            />
          ) : (
            <textarea
              ref={setRefs}
              maxLength={maxLength}
              value={currentValue}
              onChange={props.onChange}
              className={`w-full px-4 py-3 font-mono text-xs border border-t-0 rounded-b-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] bg-gray-900 text-green-400 placeholder:text-gray-500 min-h-[140px] resize-y ${
                error ? "border-red-300" : "border-gray-200"
              } ${className}`}
              placeholder="HTML source code..."
            />
          )}

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      );
    }

    // Standard Textarea for non-rich inputs (e.g. Short Description, Address)
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
        <textarea
          ref={setRefs}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5022C3]/20 focus:border-[#5022C3] bg-gray-50/50 hover:bg-gray-50 text-gray-900 placeholder:text-gray-400 min-h-[100px] resize-y ${
            error ? "border-red-300 bg-red-50/30" : "border-gray-200"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
