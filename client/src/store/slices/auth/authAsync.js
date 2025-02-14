import { 
    setIsLoading, 
    passwordLogin,
    setErrorMessage,
    setSuccessMessage,
    logOut  } from './authAsync.js';

import axios from './axios.js';
import  { dispatch } from './react-redux'
    const authAsync = async () => {

        try{
            dispatch(setIsLoading(true))
            
        }catch(){

        }
    }