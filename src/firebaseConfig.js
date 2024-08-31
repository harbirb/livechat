import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyApZrFvpYXkfTmVz5EEHRWHOACgxrfQXTk",
    authDomain: "livechat-89276.firebaseapp.com",
    projectId: "livechat-89276",
    storageBucket: "livechat-89276.appspot.com",
    messagingSenderId: "208354646512",
    appId: "1:208354646512:web:6680a6a5c1e89a6a3c2535",
    measurementId: "G-7GSH8BX70B"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app