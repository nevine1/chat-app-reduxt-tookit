import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: { 
      name: "", 
      email: "", 
      password: "",
      profile_pic: ""
    },
    
    token: null,
    isLoading: false, 
    errorMessage: null,
    successMessage : null,  
}
const authSlice = createSlice({
    name: "auth",
    initialState, 
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
          emailToLogin: (state, action) => {
            state.user.email = action.payload.email; 
            state.errorMessage = null;
            state.successMessage = "Email verified! Proceed to login with your password.";
            localStorage.setItem("email", action.payload.user.email);
        }, 
        passwordToLogin : (state, action ) => {
          const { email, password , token} = action.payload; 
          if(email ){
            state.user = {...state.user, email, password};
            state.token = action.payload.token
          }
        },
        logOut : (state, action ) =>{
            state.user.email = " ";
            state.token = null; 
        }
    }
})

export const  { 
  setIsLoading, 
  passwordLogin,
  setErrorMessage,
  setSuccessMessage,
  emailToLogin,
  passwordToLogin,
  logOut 
} = authSlice.actions; 
export default  authSlice.reducer;