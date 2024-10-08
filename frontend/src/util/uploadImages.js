import axios from 'axios';
import { useEffect } from 'react';

export const instance = axios.create();
   
   
export const uploadImages = async (formData, config) => {    
    const response = await instance.post(`https://api.cloudinary.com/v1_1/
        ${process.env.REACT_APP_CLOUDINARY_NAME}/upload`,
         formData, config,
         {
        headers:{
            "content-type": "multipart/form-data",
        },        
    })

    return response.data;
}