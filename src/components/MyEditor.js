import React, { useState, useEffect } from 'react';
import { Editor, EditorState, Modifier,convertFromRaw,  convertToRaw } from 'draft-js';
import Title from './Title';
import Button from './Button';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem('editorContent');
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const handleInputChange = (newEditorState) => {
    setEditorState(newEditorState);

    // Check for the *** and apply underline
    const contentState = newEditorState.getCurrentContent();
    const currentSelection = newEditorState.getSelection();
    const currentText = contentState.getBlockForKey(currentSelection.getStartKey()).getText();
    const lastThreeChars = currentText.slice(-3);

    if (lastThreeChars === '***') {
      const lastBlockKey = contentState.getLastBlock().getKey();
      const lastBlockLength = contentState.getLastBlock().getLength();
      const selection = newEditorState.getSelection().merge({
        anchorKey: lastBlockKey,
        anchorOffset: lastBlockLength - 3,
        focusKey: lastBlockKey,
        focusOffset: lastBlockLength,
      });

      const newContentState = Modifier.applyInlineStyle(
        contentState,
        selection,
        'UNDERLINE'
      );

      const newEditorStateWithUnderline = EditorState.push(
        newEditorState,
        newContentState,
        'change-inline-style'
      );

      const newState = EditorState.forceSelection(
        newEditorStateWithUnderline,
        newContentState.getSelectionAfter()
      );

      setEditorState(newState);
    }
  };

// ... (previous code)

const handleBeforeInput = (chars, editorState) => {
  const currentContentState = editorState.getCurrentContent();
  const currentSelection = editorState.getSelection();
  const currentBlock = currentContentState.getBlockForKey(currentSelection.getStartKey());
  const currentText = currentBlock.getText();

  // Check for "# " and apply heading style to subsequent text
  if (chars === ' ' && currentText.endsWith('#')) {
    // Apply heading style to subsequent text
    const newContentState = Modifier.setBlockType(
      currentContentState,
      currentSelection,
      'header-one'
    );

    // Remove the '#' character
    const updatedContentState = Modifier.removeRange(
      newContentState,
      currentSelection.merge({
        anchorOffset: currentSelection.getStartOffset() - 1,
        focusOffset: currentSelection.getStartOffset(),
      }),
      'forward'
    );

    const newEditorState = EditorState.push(editorState, updatedContentState, 'change-block-type');
    setEditorState(newEditorState);
    return 'handled';
  }

  // Check for "** " and change the color of the text to red
  const lastTwoChars = currentText.slice(-2);
  if (chars === ' ' && lastTwoChars === '**') {
    const newContentState = Modifier.applyInlineStyle(
      currentContentState,
      currentSelection.merge({
        anchorOffset: currentSelection.getStartOffset() - 2,
        focusOffset: currentSelection.getStartOffset(),
      }),
      'RED_TEXT'
    );

    const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    setEditorState(newEditorState);
    return 'handled';
  }

  // Check for "* " and apply bold to subsequent text
  if (chars === ' ' && currentText.endsWith('*')) {
    const newContentState = Modifier.applyInlineStyle(
      currentContentState,
      currentSelection.merge({
        anchorOffset: currentSelection.getStartOffset() - 1,
        focusOffset: currentSelection.getStartOffset(),
      }),
      'BOLD'
    );

    const newEditorState = EditorState.push(editorState, newContentState, 'change-inline-style');
    setEditorState(newEditorState);
    return 'handled';
  }

  return 'not-handled';
};

// ... (rest of the code)


  

  const customStyleMap = {
    RED_TEXT: {
      color: 'red',
    },
  };

  useEffect(() => {
    // Log raw content state for testing purposes
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    console.log(rawContentState);
  }, [editorState]);

  return (
<div className="container">
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col">
          <Title />
        </div>
        <div className="col-auto">
        <Button
        label="Save"
        editorState={editorState}
        setEditorState={setEditorState}
      />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
        <div style={{border:'solid 2px #87d3f8', height:'300px'}}>
      <Editor
        editorState={editorState}
        onChange={handleInputChange}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={customStyleMap}
      />
    </div>
        </div>
      </div>
    </div>

    
  );
};

export default MyEditor;
