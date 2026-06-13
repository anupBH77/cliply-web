"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface TiptapEditorProps {
  initialContent: any;
  onChange: (content: any) => void;
  editable?: boolean;
}

export default function TiptapEditor({ initialContent, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Press '/' for commands or start typing...",
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: initialContent || '',
    editable,
    editorProps: {
      attributes: {
        class: 'prose prose-purple max-w-none focus:outline-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && initialContent && !editor.isFocused) {
      // Only set content initially if editor is empty to avoid overwriting ongoing edits
      if (editor.isEmpty) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-wrapper w-full max-w-4xl mx-auto mt-8">
      {/* Optional: Add a simple toolbar here later */}
      <EditorContent editor={editor} />
    </div>
  );
}
