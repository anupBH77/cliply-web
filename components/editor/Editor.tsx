import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Underline } from "@tiptap/extension-underline";
import { Extension } from "@tiptap/core";
import BubbleMenu from "./BubbleMenu";
import EditorToolbar from "./EditorToolbar";

const CustomShortcuts = Extension.create({
  name: "customShortcuts",
  addKeyboardShortcuts() {
    return {
      "Mod-k": () => {
        const previousUrl = this.editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return true; // cancelled
        if (url === "") {
          this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return true;
        }
        this.editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        return true;
      },
    };
  },
});

interface EditorProps {
  initialContent: any;
  onChange: (content: any) => void;
  editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "bg-gray-100 dark:bg-gray-800 p-4 rounded-md font-mono text-sm" } },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-600 dark:text-purple-400 underline decoration-purple-300 underline-offset-2 cursor-pointer",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TaskList.configure({
        HTMLAttributes: { class: "not-prose pl-2" },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: { class: "flex items-start gap-2 my-2" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: { class: "border-collapse table-auto w-full border border-gray-200 dark:border-gray-800" },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: { class: "border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-2 text-left font-bold" },
      }),
      TableCell.configure({
        HTMLAttributes: { class: "border border-gray-200 dark:border-gray-800 p-2" },
      }),
      Underline,
      CustomShortcuts,
    ],
    content: initialContent || "",
    editable,
    editorProps: {
      attributes: {
        class: "prose prose-lg prose-gray dark:prose-invert max-w-none focus:outline-none min-h-[400px] max-h-[600px] overflow-y-auto p-8 lg:p-12",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Re-hydrate content if it changes externally and editor is empty
  React.useEffect(() => {
    if (!editor || editor.isFocused || !editor.isEmpty) return;

    if (initialContent && typeof initialContent === "object" && initialContent.type === "doc") {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  return (
    <div className="relative w-full flex flex-col">
      <EditorToolbar editor={editor} />
      <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <BubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
