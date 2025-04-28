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
      setToken: ( state, action ) => {
        state.token = action.payload; 
        console.log(state.token)
          },
          
      emailToLogin: (state, action) => {
        console.log("received payload for email login", action.payload);
          if (!action.payload || !action.payload.email) return; 
              state.user.email = action.payload.email; 
              state.errorMessage = null;
              state.successMessage = "Email is successfully verified.";
           
        }, 
        
        passwordToLogin: (state, action) => {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.email; 
          state.user.profile_pic = action.payload.user.profile_pic;
          state.token = action.payload.token; 
          console.log("Updated Redux state:", JSON.parse(JSON.stringify(state)));
          console.log(state.token)
      },

      updateUser: (state, action) => {
        if (!action.payload) {
            console.error("Redux updateUser action received null payload!");
            return;
          }
          state.user = action.payload;
          console.log("Updated user from Redux:", state.user);
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
  setToken,
  emailToLogin,
  passwordToLogin,
  updateUser,
  logOut 
} = authSlice.actions; 
export default  authSlice.reducer;