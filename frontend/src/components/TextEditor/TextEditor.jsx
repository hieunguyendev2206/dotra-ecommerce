/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./index.css";

const customToolbarConfig = {
    toolbar: {
        items: [
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
        ],
    },
};

const TextEditor = ({
                        value,
                        onChange,
                        onReady,
                        onBlur,
                        onFocus,
                        disabled,
                    }) => {
    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onReady={onReady}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
            />
        </>
    );
};

export default TextEditor;
