import {InputHTMLAttributes, useEffect, useRef} from "react"
import {useForm} from "../../Form/Hooks/FormContext"
import baseInput from '../input.module.scss'

interface IInputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
}

export function InputNumber({ name, label, ...rest }: IInputNumberProps) {
  const { register, errors } = useForm()

  const ref = useRef<HTMLInputElement>(null)
  const errorMessage = errors[name]
  

  useEffect(() => {
    register({ ref, name })
  }, [register, name])

  return (
    <>
      <label htmlFor={name}>{ label }</label>
      <input 
        type='number'
        id={name} 
        ref={ref} 
        {...rest}
      />
      { errorMessage  && (
        <span className={baseInput.errorSpan}>{ errorMessage }</span>
      )}
    </>
  )
}