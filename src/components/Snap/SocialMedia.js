import React from 'react'
import { ImTwitter } from  "react-icons/im";
import { FaLinkedinIn } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';

import '../css/SocialMedia.css'
const SocialMedia = () => {
  return (
    <div className='social-media-section'>
        <FaFacebookF className='social-element' />
        <FaLinkedinIn className='social-element' />
        <ImTwitter className='social-element' />
    </div>
  )
}

export default SocialMedia