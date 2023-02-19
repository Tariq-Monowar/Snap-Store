import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';
import axios from 'axios'
import { NavLink } from 'react-router-dom';
import { MdDeleteSweep } from "react-icons/md"; 
import { RiQuillPenFill } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";

import './css/style.home.css'
import '../App'

import SubmitLodding from './Snap/SubmitLodding';

const Home = () => {
    // Define state variables using useState hook
    const [findData, setFindData] = useState(null)
    const [lodding, setLodding] = useState(true)
    const [error, setError] = useState(null)
    
    // Define async function to fetch data from API
    const getAllData = async()=>{
        try {
            const allData = await fetch('http://localhost:9090/api') // make API call
            const myData = await allData.json()
            setFindData(myData)
            setLodding(false)
            setError(false)
        } catch (error) {
            setError(error)
            setFindData(null)
            setLodding(false)
        }

    }

    // Call getAllData() on component mount using useEffect hook
    useEffect(() => {getAllData()}, [])


    //Snap update----- & Define state variables using useState hook
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [updateId, setUpdateId] = useState("")
    const [afterUpdate, setAfterUpdate] = useState(false)
    const [forUpdateData, setForUpdateData] = useState({
        title: "",
        desc: "",
        image: null
    })
    
    // Function to handle click event for update button
    const ifClickForUpdate =(_id)=>{
        setShowUpdateForm(true)
        setUpdateId(_id)
        const filterData = findData.filter(data=> _id === data._id)
        const {title,desc,image} = filterData[0]
        setForUpdateData({
            title,
            desc,
            image
        })
    }

    // Function to handle change event for form inputs
    const ifChange = (e)=>{
        const { name, value, files } = e.target;

        setForUpdateData(prevState => ({
            ...prevState,[name]: files ? files[0] : value,
        }));
    }

    // Function to handle submit event for update form
    const ifSubmit = async(e)=>{
        e.preventDefault()
        const formData = new FormData();
        formData.append('title', forUpdateData.title);
        formData.append('desc', forUpdateData.desc);
        formData.append('image', forUpdateData.image)  
        try {
            const res = await axios.patch(`http://localhost:9090/api/${updateId}`, formData);
            if(res.status === 201){
                setShowUpdateForm(false)
                setAfterUpdate(false)
            }
            getAllData();
        } catch (error) {
            setError(true);
        }
        
    }

    // This function is called when the user clicks on the "Delete" button to delete an item.
    const ifClickForDelete = async(_id)=>{
        try {
           await fetch(`http://localhost:9090/api/${_id}`,{
               method: 'DELETE'
           })
           getAllData()
        } catch (error) {
            setError(error.message)
        }
    }

    // This function uses recursion and the window object to scroll to the top of the page.
    function scrollToTop() {
        const currentPosition = window.pageYOffset;
        if (currentPosition > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, currentPosition - currentPosition / 10);
        }
    }

  return (
    <div className='App'>
       <div 
         className={showUpdateForm?"formHeight":"header-Section"}
        >
        {
            showUpdateForm? 
            
             <div className='update-div'>
             <form className='' onSubmit={ifSubmit}>
             <h1 className='form-title'>Snap Store</h1>
             {afterUpdate && 
                <div className='lodding-update'>
                   <SubmitLodding  />
                </div>
             } 
             <div className='update-form-div'>
             
                 <input
                     className='update-input'
                     placeholder='Title'
                     type='text'
                     name='title'
                     value={forUpdateData.title}
                     onChange={ifChange}
                     maxLength={25} 
                 />
            </div>
            <div className='update-form-div'> 
                <textarea
                    className='update-textArea'
                    placeholder='Description'
                    type='text'
                    name='desc'
                    value={forUpdateData.desc}
                    onChange={ifChange}
                    maxLength={300} 
                    minLength={5}
                />
            </div>
            <div className='update-form-div'>
                 <input
                     className='update-input'
                     style={{border: 'none'}}
                     placeholder='Image'
                     type='file'
                     name='image'
                     onChange={ifChange}
                 />
            </div>  
                <div className='update-form-div'>  
                     <button 
                     onClick={()=>{setAfterUpdate(true)}}
                      className='update-form-btn' 
                      type='submit'>
                         Update
                    </button>
                    <button 
                      onClick={()=>{setShowUpdateForm(false)}}
                      className='update-form-btn' 
                    >
                         don't Update
                    </button>
                </div> 
              </form>
            </div>

            
            :<div className='head-title'>
               <h1 className='head-title-text'>Snap Store</h1> 
               <NavLink to={'/form'} className='head-title-btn'>Create a story</NavLink>
             </div>
        }
      </div>

        {
            lodding && 
            <div style={{
                textAlign:'center',
                marginTop: "-7rem"
            }}>
                <SubmitLodding />
            </div>
        }
        {
            error &&
            <p
             className='errorMessage'
            >
                Check your internet network and reload again
            </p>
        }

        <section className='content'>
                    

            {
               findData && 
               findData.map((data)=>{
                const {_id, title, desc, image} = data
                const base64String = Buffer.from(image.data).toString('base64');

                return <article key={_id} className='card'>
                    <div 
                     className='card-image' 
                     style={{backgroundImage: `url(data:image/png;base64,${base64String})`}}>
                    </div>
                    {/* <img 
                     className='card-image'
                     src={`data:image/png;base64,${base64String}`}
                     /> */}

                    <p className='card-title'>{title}</p>
                    <p className='card-desc'>{desc}</p>

                    <div className='card-button'>
                        <button 
                         className='card-btn'
                         onClick={() => {
                            ifClickForUpdate(_id);
                            scrollToTop();
                          }}
                         >
                            <RiQuillPenFill />
                        </button>
                        <button 
                         className='card-btn'
                         onClick={()=>ifClickForDelete(_id)}
                        >
                            <MdDeleteSweep  />
                        </button>
                    </div>
                </article>
               }) 
            }
        </section>

    </div>
  )
}

export default Home