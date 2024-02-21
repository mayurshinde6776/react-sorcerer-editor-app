// Button.js
import React from 'react';
import { convertToRaw, EditorState, ContentState } from 'draft-js';

const Button = ({ label, editorState, setEditorState }) => {
  const handleSave = () => {
    const contentState = convertToRaw(editorState.getCurrentContent());
    localStorage.setItem('editorContent', JSON.stringify(contentState));

    // Show alert on save
    alert('Data is saved!');

    // Clear the content from the editor
    const emptyContentState = ContentState.createFromText('');
    const emptyEditorState = EditorState.createWithContent(emptyContentState);
    setEditorState(emptyEditorState);
  };

  return (
    <button
      onClick={() => {
        handleSave();
      }}
      className='btn btn-light px-3 border border-dark'
      style={{ width: '100%', maxWidth: '200px' }}
    >
      {label}
    </button>
  );
};

export default Button;
