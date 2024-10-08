import {
    InputCheckFunction,
    InputErrorFunction,
    InputSubmitFunction,
} from "@/types/FormDefinition"
import { useFloating } from "@floating-ui/react"
import { useCallback, useState } from "react"

const defaultChecker: InputCheckFunction<number> = () => {
    return { success: true }
}

const emptyFunction = () => {}

function FormSelectionInput(props: {
    fieldName: string
    checker?: InputCheckFunction<number>
    fieldValue?: number
    fieldPlaceholder?: string
    edit?: boolean
    width?: string
    z?: string
    h?: string
    textSize?: string
    innerTextSize?: string
    errorTextSize?: string
    options: string[]
    setSubmitFunction?: (getValue: InputSubmitFunction<number>) => void
    setErrorFunction?: (setError: InputErrorFunction) => void
}) {
    const { refs: errorRefs, floatingStyles: errorFloatingStyles } =
        useFloating({
            placement: "bottom",
        })
    const { refs: dropdownRefs, floatingStyles: dropdownFloatingStyles } =
        useFloating({
            placement: "bottom",
        })
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [fieldValue, setFieldValue] = useState<number>(props.fieldValue ?? -1)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const width = props.width ?? "w-5/6"
    const h = props.h ?? "h-14"
    const z = props.z ?? "z-0"
    const textSize = props.textSize ?? "text-2xl"
    const innerTextSize = props.innerTextSize ?? "text-2xl"
    const errorTextSize = props.errorTextSize ?? "text-l"
    const checker = props.checker ?? defaultChecker
    const setSubmitFunction = props.setSubmitFunction ?? emptyFunction
    const setErrorFunction = props.setErrorFunction ?? emptyFunction
    const edit = props.edit ?? true
    const fieldText =
        fieldValue === -1 ? "Select..." : props.options[fieldValue]

    const submitFunction: InputSubmitFunction<number> = useCallback(() => {
        if (!edit) {
            return fieldValue
        }
        const check = checker(fieldValue)
        if (check.success) {
            setError(false)
            return fieldValue
        } else {
            setError(true)
            setErrorMessage(check.message)
            return null
        }
    }, [edit, fieldValue, checker])

    const errorFunction: InputErrorFunction = useCallback(
        (errorMessage: string) => {
            setError(true)
            setErrorMessage(errorMessage)
        },
        [],
    )

    setErrorFunction(errorFunction)
    setSubmitFunction(submitFunction)

    return (
        <div
            key={props.fieldName + (edit ? "-edit" : "")}
            ref={errorRefs.setReference}
            className={`min-w-0 ${h} ${width} ${z} ${
                edit ? "flex flex-row items-center gap-4" : ""
            }`}
        >
            {props.fieldPlaceholder && (
                <p className={`${textSize} w-1/6 text-center min-w-fit`}>
                    {props.fieldPlaceholder}
                </p>
            )}
            <span
                ref={dropdownRefs.setReference}
                onClick={() => {
                    setError(false)
                    setDropdownOpen(!dropdownOpen)
                }}
                className={`border-2 rounded-xl bg-transparent ${innerTextSize} w-full h-full min-w-0
                    transition-colors flex items-center justify-center ${
                        error ? "border-red-500" : ""
                    } 
                    ${fieldValue === -1 ? "text-gray-400 italic" : ""} ${
                        edit ? "cursor-pointer" : ""
                    } ${dropdownOpen ? "border-sky-400" : ""}`}
            >
                {fieldText}
            </span>
            {edit && (
                <>
                    {error && (
                        <p
                            style={errorFloatingStyles}
                            ref={errorRefs.setFloating}
                            className={`mt-2 ${errorTextSize} text-center border-white border bg-red-400 py-1 px-2 rounded-md pointer-events-none`}
                        >
                            {errorMessage}
                        </p>
                    )}
                    {dropdownOpen && (
                        <div
                            ref={dropdownRefs.setFloating}
                            className="border-2 border-white rounded-xl flex flex-col bg-black mt-1 max-h-72 overflow-y-scroll"
                            style={{
                                width: (
                                    dropdownRefs.reference?.current as
                                        | HTMLElement
                                        | undefined
                                )?.offsetWidth,
                                ...dropdownFloatingStyles,
                            }}
                        >
                            {props.options.map((option, index) => (
                                <span
                                    key={index}
                                    onClick={() => {
                                        setFieldValue(index)
                                        setDropdownOpen(false)
                                    }}
                                    className={`${innerTextSize} w-full ${h} cursor-pointer flex justify-center items-center hover:bg-sky-800/50 transition-colors shrink-0
                                ${index === 0 ? "rounded-t-xl " : ""} ${
                                    index === props.options.length - 1
                                        ? "rounded-b-xl"
                                        : "border-b-2 border-white"
                                } 
                                ${
                                    index === fieldValue ? " bg-sky-800/70" : ""
                                }`}
                                >
                                    {option}
                                </span>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default FormSelectionInput
