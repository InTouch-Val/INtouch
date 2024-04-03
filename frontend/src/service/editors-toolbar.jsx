import React, { useRef, forwardRef, useEffect } from 'react';
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
import { EditorState, ContentState } from 'draft-js';

const EditorToolbar = forwardRef(({ editorState, setEditorState, placeholder, block }, ref) => {
  const { toolbarPlugin, setToolbarPlugin } = useToolbar(); // Используем контекст
  const { Toolbar } = toolbarPlugin;
  const plugins = [toolbarPlugin];

  const focusEditor = () => {
    if (ref.current) {
      ref.current.focus();
      // Получаем текущее состояние редактора
      const currentState = editorState;
      // Получаем текущий контент
      const contentState = currentState.getCurrentContent();
      // Получаем длину текста
      const textLength = contentState.getPlainText().length;
      // Создаем новое состояние выделения, устанавливающее курсор в конец текста
      const selectionState = SelectionState.createEmpty(contentState.getLastBlock()).merge({
        anchorOffset: textLength,
        focusOffset: textLength,
      });
      // Создаем новое состояние редактора с новым состоянием выделения
      const newEditorState = EditorState.forceSelection(currentState, selectionState);
      // Обновляем состояние редактора
      setEditorState(newEditorState);
    }
  };

  // Функция для инициализации редактора с текстом block.question
  const initializeEditorWithText = () => {
    if (block.question) {
      const contentState = ContentState.createFromText(block.question);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  };

  // Инициализация редактора при монтировании компонента
  useEffect(() => {
    initializeEditorWithText();
    setTimeout(focusEditor, 500); // Отложенное выполнение фокусировки
  }, []); // Пустой массив зависимостей означает, что эффект будет вызван только при монтировании компонента

  return (
    <div className="editor-container" onClick={focusEditor}>
      <Editor
        editorState={editorState}
        onChange={setEditorState}
        plugins={plugins}
        placeholder={placeholder}
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
