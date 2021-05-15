import React from 'react'
import {Formik,Field,Form} from 'formik'
import * as Yup from 'yup';
import {useMutation,gql} from '@apollo/client'
import styles from '../styles/register.module.css'
import {useRouter} from 'next/router'
import {FieldProps,FormikHelpers} from 'formik'
import {MyInput} from '../components/form'

const LOGIN_MUTATION = gql`
    mutation Login($user:LoginInput!){
        login(user:$user) {
            _id
            firstName
            lastName
            email
        }
    }
`

const Login = ()=> {

     const [register] = useMutation(LOGIN_MUTATION , {
       onCompleted:(data)=>{    
        router.push(`/profile/${data.login._id}`)
       }
     });

     const router = useRouter(); 

     const submitHandler = async (values , { setErrors } : FormikHelpers<any>)=>{

        try {   

            await register({
                variables:{
                  user:{
                      ...values
                  }
                }
            })

        } catch(err) {

            console.log(err)

            setErrors({
                password:"Unvalid Password Or Email !",
                email:"Unvalid Password Or Email !"
            })

        }
       
     }

     return  <div className={styles.formWrapper}> <Formik 

      initialValues={ {
        email:"",
        password:""
      }} 

      validateOnChange={false}
      validateOnBlur={false}

      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email address').required('This Field Can Not Be Blank !'),
        password: Yup.string().required('No password provided.') .min(8, ' Should be 8 chars minimum. !')
      })}

      onSubmit={submitHandler}> 

          { ({handleSubmit,isSubmitting} )=> <form onSubmit={handleSubmit} className={styles.form}>

            
                 <Field name="email" component={MyInput} placeholder="Email"/>
                 <Field name="password" type="password" component={MyInput} placeholder="Password"/>

                 <button className={styles.SubmitButton} type="submit" disabled={isSubmitting} > LOGIN </button>
               
              </form>
          }

        </Formik> 
        
      </div>
}


export default Login;