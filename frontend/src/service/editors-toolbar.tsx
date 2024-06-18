//@ts-nocheck
import React, { useRef, forwardRef, useEffect, useState } from "react";
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
import { Modifier, SelectionState } from "draft-js";
import { maxTextLegthBig, maxTextLegthSmall } from "../utils/constants";

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
    },
    ref
  ) => {
    const { toolbarPlugin, setToolbarPlugin } = useToolbar(); // Используем контекст
    const { Toolbar } = toolbarPlugin;
    const plugins = [toolbarPlugin];
    const textErrMaxTextLegthBig = ` Please enter 20-${maxTextLegthBig} characters`;
    const textErrMaxTextLegthSmall = ` Please enter 20-${maxTextLegthSmall} characters`;

    const focusEditor = () => {
      if (ref.current) {
        ref.current.focus();
      }
    };

    const effectiveErrorText = errorText || "";

    const applyStylesFromCharacterList = (contentState, rawContentState) => {
      let newContentState = contentState;

      rawContentState.blocks.forEach((block, blockIndex) => {
        if (block.characterList) {
          block.characterList.forEach((charInfo, charIndex) => {
            const blockKey = block.key;
            const charStyles = charInfo.style; // Получаем массив стилей для символа
            const char = block.text[charIndex];

            // Применяем каждый стиль к символу
            charStyles.forEach((style) => {
              newContentState = Modifier.applyInlineStyle(
                newContentState,
                newContentState.getSelectionAfter().merge({
                  anchorKey: blockKey,
                  anchorOffset: charIndex,
                  focusKey: blockKey,
                  focusOffset: charIndex + 1,
                }),
                style
              );
            });
          });
        }
      });

      return newContentState;
    };

    // Функция для инициализации редактора с текстом block.description
    const initializeEditorWithText = () => {
      if (block.description) {
        try {
          const descriptionObject = JSON.parse(block.description);
          console.log(descriptionObject);

          const rawContentState = {
            blocks: [],
            entityMap: descriptionObject.entityMap,
          };

          for (const blockKey in descriptionObject.blockMap) {
            const block = descriptionObject.blockMap[blockKey];
            rawContentState.blocks.push(block);
          }
          console.log(rawContentState);

          const contentState = convertFromRaw(rawContentState);
          const contentStateWithStyles = applyStylesFromCharacterList(
            contentState,
            rawContentState
          );
          console.log(contentStateWithStyles);
          const newEditorState = EditorState.createWithContent(
            contentStateWithStyles
          );
          console.log(newEditorState);
          setEditorState(newEditorState);
          const text = contentState.getPlainText();
          validateTextLength(text);
        } catch (error) {
          console.error("Ошибка при преобразовании строки в объект:", error);
        }
      } else if (block.question) {
        const contentState = ContentState.createFromText(block.question);
        const newEditorState = EditorState.createWithContent(contentState);
        setEditorState(newEditorState);
        const text = contentState.getPlainText();
        validateTextLength(text);
      }
    };

    // Инициализация редактора при монтировании компонента
    useEffect(() => {
      initializeEditorWithText();
      setTimeout(focusEditor, 10000); // Отложенное выполнение фокусировки
    }, []); // Пустой массив зависимостей означает, что эффект будет вызван только при монтировании компонента

    useEffect(() => {
      // Проверяем, если редактор пуст и не содержит текст block.question, добавляем плейсхолдер
      if (!block.question && !block.description) {
        setEditorState(
          EditorState.push(
            editorState,
            ContentState.createFromText(placeholder),
            "insert-characters"
          )
        );
      }
    }, []);

    const onChange = (newEditorState) => {
      setEditorState(newEditorState);
    };

    const handleBeforeInput = (chars, editorState) => {
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
          "insert-characters"
        );

        // Устанавливаем фокус на конец содержимого
        newEditorState = EditorState.moveFocusToEnd(newEditorState);

        setEditorState(newEditorState);
        return "handled";
      }

      return "not-handled";
    };

    const validateTextLength = (text) => {
      const maxLength =
        block.type === "text" ? maxTextLegthBig : maxTextLegthSmall;
      console.log(maxLength);
      if (text.length < 20 || text.length > maxLength) {
        setIsError(true);
        setErrorText(
          maxLength === maxTextLegthBig
            ? `${effectiveErrorText.includes(textErrMaxTextLegthBig) ? effectiveErrorText.replace(textErrMaxTextLegthBig, "") : effectiveErrorText} ${textErrMaxTextLegthBig}`
            : `${effectiveErrorText.includes(textErrMaxTextLegthSmall) ? effectiveErrorText.replace(textErrMaxTextLegthSmall, "") : effectiveErrorText} ${textErrMaxTextLegthSmall}`
        );
        return false;
      }
      setIsError(false);
      setErrorText(
        maxLength === maxTextLegthBig
          ? `${effectiveErrorText.includes(textErrMaxTextLegthBig) ? effectiveErrorText.replace(textErrMaxTextLegthBig, "") : ""}`
          : `${effectiveErrorText.includes(textErrMaxTextLegthSmall) ? effectiveErrorText.replace(textErrMaxTextLegthSmall, "") : ""}`
      );
      return true;
    };

    const handleBlur = () => {
      const contentState = editorState.getCurrentContent();
      const text = contentState.getPlainText();
      validateTextLength(text);
    };

    return (
      <div
        className={`editor-container ${(effectiveErrorText.includes(textErrMaxTextLegthBig) || effectiveErrorText.includes(textErrMaxTextLegthSmall)) && "error"}`}
        onClick={focusEditor}
      >
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          placeholder={placeholder}
          ref={ref}
          handleBeforeInput={handleBeforeInput}
          onBlur={handleBlur}
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
  }
);

export { EditorToolbar };
