import logo from './logo.svg';
import './App.css';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useState, useRef } from 'react';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
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


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App">

        
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom() {
  const messagesRef = collection(db, 'messages')
  const q = query(messagesRef, orderBy('createdAt'), limit(25))
  const [messages] = useCollectionData(q, {idField: 'id'})

  const [formValue, setFormValue] = useState('')
  const dummyRef = useRef()

  const sendMessage = async(e) => {
    e.preventDefault()
    const { uid, photoURL } = auth.currentUser
    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp()
    })
    setFormValue('')
    dummyRef.current.scrollIntoView({ behavior: "smooth"})

  }

  return (
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <div ref={dummyRef}></div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} ></input>
      <button type='submit'>🕊️</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser ? 'sent' : 'recieved';

  return (
    <div className={`message ${messageClass}`}>

      <p>{text}</p>
      <img src={photoURL}/>
    </div>
  )
}

export default App;
