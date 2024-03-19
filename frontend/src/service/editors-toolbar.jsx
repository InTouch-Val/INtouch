import { useRef } from 'react';
import Editor from '@draft-js-plugins/editor';
import createToolbarPlugin, { Separator } from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '../css/editorsBar.css';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

function EditorToolbar({ editorState, setEditorState, placeholder }) {
  const editor = useRef(null);

  const focusEditor = () => {
    editor.current.focus();
  };

  return (
    <div className="editor-container" onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder={placeholder}
      />
      <Toolbar>
        {(externalProps) => (
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
        )}
      </Toolbar>
    </div>
  );
}

export { EditorToolbar };
