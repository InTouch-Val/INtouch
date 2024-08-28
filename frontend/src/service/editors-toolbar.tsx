//@ts-nocheck
import React, { forwardRef, useEffect } from "react";
import Editor from "@draft-js-plugins/editor";
import { Separator } from "@draft-js-plugins/static-toolbar";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  UnorderedListButton,
  OrderedListButton,
} from "@draft-js-plugins/buttons";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import "../css/editorsBar.css";
import { useToolbar } from "./ToolbarContext"; // Импортируем хук для использования контекста
import { EditorState, ContentState, convertFromRaw } from "draft-js";
import { Modifier } from "draft-js";
import { maxTextLegthBig } from "../utils/constants";
import { Block, CharacterInfo } from "../utils/global-types";

const EditorToolbar = forwardRef(
  (
    {
      editorState,
      setEditorState,
      placeholder,
      block,
      isMobileWidth,
      errorText,
      setErrorText,
      setIsError,
      readOnly = false,
      handleBeforeInput,
      handlePastedText,
    },
    ref,
  ) => {
    const { toolbarPlugin } = useToolbar(); // Используем контекст
    const { Toolbar } = toolbarPlugin;
    const plugins = [toolbarPlugin];
    const textErrMaxTextLegthBig = ` Please enter 1-${maxTextLegthBig} characters`;

    const focusEditor = () => {
      if (ref.current) {
        ref.current.focus();
      }
    };

    const effectiveErrorText = errorText || "";

    const applyStylesFromCharacterList = (
      contentState: ContentState,
      rawContentState: ExtendedRawDraftContentState,
    ) => {
      let newContentState = contentState;

      rawContentState.blocks.forEach((block: Block) => {
        if (block.characterList) {
          block.characterList.forEach(
            (charInfo: CharacterInfo, charIndex: number) => {
              const blockKey = block.key;
              const charStyles = charInfo.style; // Получаем массив стилей для символа
              const char = block.text[charIndex];

              // Применяем каждый стиль к символу
              charStyles.forEach((style: string) => {
                newContentState = Modifier.applyInlineStyle(
                  newContentState,
                  newContentState.getSelectionAfter().merge({
                    anchorKey: blockKey,
                    anchorOffset: charIndex,
                    focusKey: blockKey,
                    focusOffset: charIndex + 1,
                  }),
                  style,
                );
              });
            },
          );
        }
      });

      return newContentState;
    };

    // Функция для инициализации редактора с текстом
    const initializeEditorWithText = () => {
      const isJSON = (str: string) => {
        try {
          JSON.parse(str);
          return true;
        } catch (error) {
          return false;
        }
      };

      const parseContent = (content: string) => {
        if (isJSON(content)) {
          try {
            const contentObject = JSON.parse(content);
            const contentState = convertFromRaw(contentObject);
            const contentStateWithStyles = applyStylesFromCharacterList(
              contentState,
              contentObject,
            );
            return EditorState.createWithContent(contentStateWithStyles);
          } catch (error) {
            console.error("Error parsing JSON content:", error);
            const contentState = ContentState.createFromText(content);
            return EditorState.createWithContent(contentState);
          }
        } else {
          const contentState = ContentState.createFromText(content);
          return EditorState.createWithContent(contentState);
        }
      };

      let newEditorState: EditorState;
      if (block.description && isJSON(block.description)) {
        try {
          const descriptionObject = JSON.parse(block.description);
          const rawContentState = {
            blocks: [],
            entityMap: descriptionObject.entityMap,
          };

          for (const blockKey in descriptionObject.blockMap) {
            const block = descriptionObject.blockMap[blockKey];
            rawContentState.blocks.push(block);
          }

          const contentState = convertFromRaw(rawContentState);
          const contentStateWithStyles = applyStylesFromCharacterList(
            contentState,
            rawContentState,
          );
          newEditorState = EditorState.createWithContent(
            contentStateWithStyles,
          );
          setEditorState(newEditorState);
        } catch (error) {
          console.error("Error converting string to object:", error);
        }
      } else if (block.reply === "" || block.reply) {
        newEditorState = parseContent(block.reply);
        setEditorState(newEditorState);
      } else if (block.question) {
        newEditorState = parseContent(block.question);
        setEditorState(newEditorState);
      } else {
        newEditorState = EditorState.createEmpty();
        setEditorState(newEditorState);
      }
    };

    // Инициализация редактора при монтировании компонента
    useEffect(() => {
      initializeEditorWithText();
      setTimeout(focusEditor, 1000); // Отложенное выполнение фокусировки
    }, []); // Пустой массив зависимостей означает, что эффект будет вызван только при монтировании компонента

    useEffect(() => {
      // Проверяем, если редактор пуст и не содержит текст block.question, добавляем плейсхолдер
      if (!block.question && !block.description && !block.reply) {
        setEditorState(
          EditorState.push(
            editorState,
            ContentState.createFromText(placeholder),
            "insert-characters",
          ),
        );
      }
    }, [isMobileWidth]);

    const onChange = (newEditorState: EditorState) => {
      setEditorState(newEditorState);
    };

    const defaultHandleBeforeInput = (
      chars: string,
      editorState: EditorState,
    ) => {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const EditorBlockKey = selectionState.getStartKey();
      const EditorBlock = contentState.getBlockForKey(EditorBlockKey);
      const text = EditorBlock.getText();

      // Проверяем, если плейсхолдер активен
      if (text === placeholder) {
        // Заменяем плейсхолдер на введенный текст
        const newContentState = ContentState.createFromText(chars);
        let newEditorState = EditorState.push(
          editorState,
          newContentState,
          "insert-characters",
        );

        // Устанавливаем фокус на конец содержимого
        newEditorState = EditorState.moveFocusToEnd(newEditorState);

        setEditorState(newEditorState);
        return "handled";
      }

      return "not-handled";
    };

    const validateTextLength = (text: string) => {
      const maxLength = maxTextLegthBig;
      if (text.length < 1 || text.length > maxLength) {
        setIsError(true);
        setErrorText(
          `${effectiveErrorText.includes(textErrMaxTextLegthBig) ? effectiveErrorText.replace(textErrMaxTextLegthBig, "") : effectiveErrorText} ${textErrMaxTextLegthBig}`,
        );
        return false;
      }
      setIsError(false);
      setErrorText(
        `${effectiveErrorText.includes(textErrMaxTextLegthBig) ? effectiveErrorText.replace(textErrMaxTextLegthBig, "") : ""}`,
      );
      return true;
    };

    const handleBlur = () => {
      const contentState = editorState.getCurrentContent();
      const text = contentState.getPlainText();

      if (setErrorText && setErrorText) {
        validateTextLength(text);
      }
    };

    return (
      <div
        className={`editor-container ${effectiveErrorText.includes(textErrMaxTextLegthBig) && "error"}`}
        onClick={focusEditor}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          placeholder={placeholder}
          ref={ref}
          onBlur={handleBlur}
          readOnly={readOnly}
          handleBeforeInput={handleBeforeInput || defaultHandleBeforeInput}
          handlePastedText={handlePastedText}
        />
        {!isMobileWidth && (
          <Toolbar>
            {(externalProps) => (
              <>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                {block.type === "text" ? (
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
        )}
      </div>
    );
  },
);

export { EditorToolbar };
