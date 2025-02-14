import { createReducer } from "@reduxjs/toolkit";


const initialState = {
    username: "", 
    email: "", 
    password: "",
    token: null,
    isLoading: false, 
    errorMessage: null,
    successMessage : null,  
}
const authSlice = createReducer({
    name: "auth",
    initialState:{}, 
    reducers:{
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
          },
          setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
          },
          
          setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
          },
          emailLogin: (state, action) => {
            state.email = action.payload.user; 
            state.errorMessage = null;
            state.successMessage = "Email verified! Proceed to login with your password.";
        
        }, 
        passwordLogin : (state, action ) => {

        },
        logOut : (state, action ) =>{
            state.user = null;``
            state.token = null; 
        }
    }
})

export const  { 
  setIsLoading, 
  passwordLogin,
  setErrorMessage,
  setSuccessMessage,
  logOut 
} = authSlice.actions; 
export default  authSlice.reducer;