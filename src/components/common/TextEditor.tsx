'use client';

import React, { FC, useEffect, useRef,  useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import katex from 'katex';
import '../../../node_modules/katex/dist/katex.css';

// import './jquery';
// Mathquill
import mathquill4quill from 'mathquill4quill';
import '../../../node_modules/mathquill4quill/build/mathquill4quill.min.js';
import '../../../node_modules/mathquill4quill/build/mathquill4quill.min.css';


interface Props {
    value: string;
    onChange(value: string): void;
    placeholder?: string; 
    className?: string;
    borderColor?: string;
}

const TextEditor: FC<Props> = ({ value, onChange, placeholder, borderColor, className }: Props) => {
    const [editorValue, setEditorValue] = useState('');
    
    const editorRef = useRef<ReactQuill>(null);

    useEffect(() => {
        const enableMathQuillFormulaAuthoring = mathquill4quill({ Quill, katex });
        enableMathQuillFormulaAuthoring(editorRef.current?.editor);
    }, []);

    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    const modules = {
        toolbar: {
            container:
            [
                // [{ 'placeholder': ['[GuestName]', '[HotelName]'] }], // my custom dropdown
                ['blockquote', 'code-block'],
                ['bold', 'italic', 'underline', 'strike', 'link', 'image', 'formula'],        // toggled buttons
                [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }, { 'header': 4 }, { 'header': 5 }, { 'header': 6 },],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
    
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
    
                ['clean']                                    // remove formatting button
               
            ],
        }
    };

    const handleTextChange = (value: string) => {
        setEditorValue(value);
        onChange(value);
    };

    return (
        <ReactQuill 
            ref={editorRef} 
            modules={modules} 
            theme="snow" 
            value={editorValue ? editorValue : ''} 
            onChange={handleTextChange} 
            placeholder={placeholder} 
            className={className}
            style={{ border: `1px solid ${borderColor}` }}
        />
    );
};

export default TextEditor;