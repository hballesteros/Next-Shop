'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'

import { login, registerUser } from '@/actions'


type FormInputs = {
  name: string
  email: string
  password: string
}

export const RegisterForm = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const { register, handleSubmit, formState: {errors} } = useForm<FormInputs>()

  const onSubmit = async(data: FormInputs) => {
  
    setErrorMessage('')
    const { name, email, password } = data
    
    // server action
    const resp = await registerUser( name, email, password );
    if (!resp.ok) {
      setErrorMessage(resp.message)
      return
    }

    await login(email.toLocaleLowerCase(), password)
    window.location.replace('/')
  
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col">
      
      {/* {
        errors.name && <span className="text-red-500">* El nombre es obligatorio</span>
      }
      {
        errors.email && <span className="text-red-500">* El correo es obligatorio</span>
      }
      {
        errors.password && <span className="text-red-500">* La contraseña es obligatoria</span>
      } */}

      <label htmlFor="text">Nombre Completo</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.name
            }
          )
        }
        type="text" 
        { ...register('name', {required: true }) }
        autoFocus
      />


      <label htmlFor="email">Correo electrónico</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.email
            }
          )
        }
        type="email" 
        { ...register('email', {required: true, pattern: /^\S+@\S+$/i }) }
      />


      <label htmlFor="password">Contraseña</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-5",
            {
              'border-red-500': errors.password
            }
          )
        }
        type="password" 
        { ...register('password', {required: true, minLength: 6 }) }
      />

      <span className="text-red-500 mb-2">{ errorMessage }</span>
      
      <button
        className="btn-primary">
        Crear nueva cuenta
      </button>


      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/login"
        className="btn-secondary text-center">
        Ingresar
      </Link>

    </form>
  )
}
