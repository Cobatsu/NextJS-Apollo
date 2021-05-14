import React from 'react'
import {Formik,Field,Form} from 'formik'
import * as Yup from 'yup';
import {useMutation,gql} from '@apollo/client'
import styles from '../styles/register.module.css'
import {useRouter} from 'next/router'
import user from '../models/user';


const REGISTER_MUTATION = gql`
    mutation Register($user:RegisterInput!){
        register(user:$user) {
            _id
            firstName
            lastName
            email
        }
    }
    
`

const MyInput = ({ field, form, ...props }) => { //This is for Field component's prop

  return <div style={{marginTop:10,display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>  

        <input {...field} {...props}   className={styles.formInput}/>

        {
          ( form.errors[field.name] && form.touched[field.name] ) && <div style={{color:'red'}}> { form.errors[field.name]  } </div>
        }

    </div>;
};

const Register = ()=> {

     const [register] = useMutation(REGISTER_MUTATION , {
       onCompleted:(data)=>{    
        router.push(`./profile/${data.register._id}`)
       }
     });

     const router = useRouter(); 

     const submitHandler = async (values)=>{

        const data = await register({
          variables:{
            user:{
                ...values
            }
          }
        })
     }

     return  <div className={styles.formWrapper} > <Formik 
      
      initialValues={ {
        firstName:"",
        lastName:"",
        email:""
      }} 
      validateOnChange={false}
      validateOnBlur={false}

      validationSchema={Yup.object({
        firstName:Yup.string().max(8,'Must be 8 characters or less').required('This Field Can Not Be Blank !'),
        lastName:Yup.string().max(8,'Must be 8 characters or less').required('This Field Can Not Be Blank !'),
        email: Yup.string().email('Invalid email address').required('This Field Can Not Be Blank !'),

      })}

      onSubmit={submitHandler}> 

          { ({handleSubmit,isSubmitting})=> <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',width:"20%"}}>

                 <Field name="firstName" component={MyInput} placeholder="First Name"/>
                 <Field name="lastName" component={MyInput} placeholder="Last Name"/>
                 <Field name="email" component={MyInput} placeholder="Email"/>
                 
                 <button className={styles.SubmitButton} type="submit" disabled={isSubmitting} > REGISTER </button>
                 
              </form>

          }

        </Formik> 
        
      </div>
}


export default Register;