import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: {
    name: "", 
    email: "", 
    password: "", 
    profile_pic: "",
        },
        token: null,
        isLoading: false,
        errorMessage: "",
        successMessage: "",  
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
        registerNewUser: (state, action) => { 
          state.user = action.payload; 
          state.successMessage = "User registered successfully";
          state.isLoading = false;
        },
          setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
      },
          
      emailToLogin: (state, action) => {
        console.log("recieved paylod for email login", action.payload);
          if (!action.payload || !action.payload.email) return; 
              state.user.email = action.payload.email; 
              state.errorMessage = null;
              state.successMessage = "Email is successfully verified.";
           
        }, 
        
        passwordToLogin : (state, action ) => {

            state.user = action.payload.user; 
            state.token = action.payload.token;

            console.log("Updated Redux state:", JSON.parse(JSON.stringify(state)));
        },
      updateUser: (state, action) => {
        state.user = action.payload.user; 
       },
      logOut: (state) => {
          
        state.user = { name: "", email: "", password: "", profile_pic: "" };
        state.token = null; 
        state.successMessage = "Logged out successfully";
            
        }
    }
})

export const  { 
  setIsLoading, 
  passwordLogin,
  registerNewUser,
  setErrorMessage,
  setSuccessMessage,
  emailToLogin,
  passwordToLogin,
  updateUser,
  logOut 
} = authSlice.actions; 
export default  authSlice.reducer;