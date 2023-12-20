import React, { useRef } from 'react';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
} from 'draft-js-buttons';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import "../css/editorsBar.css"

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const EditorToolbar = ({ editorState, setEditorState }) => {
    const editor = useRef(null);

    const focusEditor = () => {
        editor.current.focus();
    };

  return (
    <div className="editorContainer" onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder="Write text here..."
      />
      <Toolbar>
        {
          // May be used to render a custom toolbar
          (externalProps) => (
            <>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <Separator {...externalProps} />
              <HeadlineOneButton {...externalProps} />
              <HeadlineTwoButton {...externalProps} />
              <HeadlineThreeButton {...externalProps} />
              <Separator {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
            </>
          )
        }
      </Toolbar>
    </div>
  );
};

export default EditorToolbar;
