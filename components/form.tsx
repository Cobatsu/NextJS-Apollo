import {FieldProps} from 'formik'
import React from 'react'
import styles from '../styles/register.module.css'

export const MyInput = ({ field , form, ...props } : FieldProps) => { //This is for Field component's prop

    const anyError =  ( form.errors[field.name] && form.touched[field.name] )

    return <div style={{marginTop:10,display:'flex',width:'60%',justifyContent:'space-between'}}>  
  
          <input {...field} {...props}   className={styles.formInput} style={{width:anyError?'50%':'100%'}}/>
   
          {
            <div style={{color:'red' ,display:'flex',justifyContent:'center', width:anyError?'55%':'0px',overflow:'hidden',whiteSpace:'nowrap' }}> { form.errors[field.name] } </div>
          }
  
      </div>;
  };