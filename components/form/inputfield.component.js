import React from "react";
import { useField, splitFormProps } from "react-form"

export const InputField = React.forwardRef((props, ref) => {
    const [field, fieldOptions, rest] = splitFormProps(props);
    const {
        meta: { error, isTouched, isValidating, message },
        getInputProps
    } = useField(field, fieldOptions);


    return (
        <>
            {isValidating ? (
                <div className="input-group m-1">
                    <span className="mb-2 text-danger">Validating...</span>
                </div>
            ) : isTouched && error ? (
                <div className="input-group m-1">
                    <span className="mb-2 text-danger"><strong>{error}</strong></span>
                </div>
            ) : message ? (
                <div className="input-group m-1">
                    <span className="mb-2 text-danger"> <small>{message}</small></span>
                </div>
            ) : null}
            <input  {...getInputProps({ ref, ...rest })} />
        </>
    );
});
