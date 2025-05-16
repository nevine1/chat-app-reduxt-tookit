import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: {
    _id: "",
    name: "", 
    email: "", 
    password: "", 
    profile_pic: "",
    
        },
        token: null,
        isLoading: false,
        errorMessage: "",
        successMessage: "",  
        onlineUsers: [], 
        /* socketConnection: null */
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
            state.user._id = action.payload._id;
              state.errorMessage = null;
              state.successMessage = "Email is successfully verified.";
           
        }, 
        
        passwordToLogin: (state, action) => {
          console.log("Payload received at passwordToLogin:", action.payload);
    
          const { user, token } = action.payload;
    
          if (!user || !user._id) return;
    
          state.user._id = user._id;
          state.user.name = user.name;
          state.user.email = user.email;
          state.user.profile_pic = user.profile_pic;
          state.token = token;
    
          state.successMessage = "Logged in successfully";
          state.errorMessage = null;
    
          /* console.log("Updated Redux state after password login:", state.user); */
        },

      updateUser: (state, action) => {
        if (!action.payload) {
            console.error("Redux updateUser action received null payload!");
            return;
          }
          state.user = action.payload;
          console.log("Updated user from Redux:", state.user);
      },
      /* setSocketConnection: (state, action) => {
        state.socketConnection = action.payload;
      }, */
      logOut: (state) => {
          
        state.user = { name: "", email: "", password: "", profile_pic: "" };
        state.token = null; 
        state.socketConnection = null; 
        state.successMessage = "Logged out successfully";
            
      }, 
      setOnlineUsers: (state, action) => {
        state.onlineUsers = action.payload;
        console.log('this is online users in authSlice', state.onlineUsers)
        
      }, 
     
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
  logOut,
  setOnlineUsers, 
  setSocketConnection
} = authSlice.actions; 
export default  authSlice.reducer;