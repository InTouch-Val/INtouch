import React, { useRef, forwardRef } from 'react';
import Editor from '@draft-js-plugins/editor';
import { Separator } from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '../css/editorsBar.css';
import { useToolbar } from './ToolbarContext'; // Импортируем хук для использования контекста

const EditorToolbar = forwardRef(({ editorState, setEditorState, placeholder, block }, ref) => {
  const { toolbarPlugin, setToolbarPlugin } = useToolbar(); // Используем контекст
  const { Toolbar } = toolbarPlugin;
  const plugins = [toolbarPlugin];

  const focusEditor = () => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  return (
    <div className="editor-container" onClick={focusEditor}>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder={block.question ? block.question : placeholder}
        ref={ref}
      />
      <Toolbar>
        {(externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            {block.type === 'text' ? (
              <>
                <Separator {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                <Separator {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
              </>
            ) : null}
          </>
        )}
      </Toolbar>
    </div>
  );
});

export { EditorToolbar };
