import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './css/CreateData.css'
import SubmitLodding from './Snap/SubmitLodding'

const CreateData = () => {
    const navigate = useNavigate()

    // These state variables are used to manage the form input values and submission status.
    const [afterSubmit, setAfterSubmit] = useState(false)
    const [showSubmitButton, setShowSubmitButton] = useState(false)
    const [inputValue, setinputValue] = useState({
        title: '',
        desc: '',
        image: null
    })
    const [error, setError] = useState('')


    // This useEffect hook is used to enable/disable the submit button based on whether all the required
    // input fields have been filled out.
    const{title, desc, image} = inputValue
    useEffect(() => {
        if (title !== '' && desc !== '' && image !== null) {
          setShowSubmitButton(true);
        } else {
          setShowSubmitButton(false);
        }
      }, [title, desc, image]);

    // This function is called when the user changes the value of an input element in the create form.
    const ifChange = (e)=>{
        const { name, value, files } = e.target;

        setinputValue(prevState => ({
          ...prevState,[name]: files ? files[0] : value,
        }));
    }

    // This function is used to create a new item when the user submits the form.
    const createUser = async()=>{
        try {
            const formData = new FormData();
            formData.append('title', inputValue.title);
            formData.append('desc', inputValue.desc);
            formData.append('image', inputValue.image);
            const res = await axios.post('http://localhost:9090/api',formData)
            if(res.status === 201){
                navigate('/')
            }
        } catch (error) {
            setError(error)
            setAfterSubmit(false)
        }

    }
    
    // This function is called when the user clicks the "submit" button to create a new item.
    const ifSubmit = (e)=>{
        e.preventDefault()
        createUser() 

    }
  return (
     <div className='user-form-content'>
        <h1 className='form-titles'>Create your Snap's</h1>

        {   // Show error message if there is an error
            error &&
            <p>Check your internet network and try again</p>
        }
        
        {afterSubmit? <SubmitLodding /> : ""}
                
        <form className='user-form' onSubmit={ifSubmit}>
            <div className='user-form-div'>
                <input
                    className='form-input'
                    placeholder='Title'
                    type='text'
                    name='title'
                    value={inputValue.title}
                    onChange={ifChange}
                    maxLength={25} 
                    required
                />
            </div>
            <div className='user-form-div'>
                <textarea
                    className='form-text-area'
                    placeholder='Description'
                    type='text'
                    name='desc'
                    value={inputValue.desc}
                    onChange={ifChange}
                    maxLength={300} 
                    minLength={5}
                    required
                />
            </div>
            
            <div className='user-form-div'>
                <input
                    style={{border: 'none'}}
                    className='form-input'
                    placeholder='Image'
                    type='file'
                    name='image'
                    onChange={ifChange}
                    required
                />
            </div>

            <div className='user-form-div'>
                {
                    showSubmitButton &&
                    <button
                     onClick={()=>{
                        setAfterSubmit(true)
                    }} 
                     className='user-form-btn' 
                     type='submit'>
                        Submit
                    </button> 
                }

               <button 
                onClick={()=>{navigate('/')}}
                className='user-form-btn' 
                type='submit'
               >
                don't Submit
               </button>
               
            </div>
            
        </form>
     </div>
     )
}

export default CreateData