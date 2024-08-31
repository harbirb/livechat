import logo from "./logo.svg";
import "./App.css";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useRef } from "react";

import app from "./firebaseConfig";

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App"></header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
  );
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

function ChatRoom() {
  const [formValue, setFormValue] = useState("");
  const dummyRef = useRef();
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  const [snapshot, loading, error] = useCollection(q);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(messagesRef, id));
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue == "") return;
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      uid,
      photoURL,
      createdAt: serverTimestamp(),
    });
    setFormValue("");
    dummyRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SignOut />
      <div className="chatroom">
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              message={msg}
              onDelete={deleteMessage}
            />
          ))}
      </div>

      <div ref={dummyRef}></div>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        ></input>
        <button type="submit">🕊️</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  const handleDelete = () => {
    props.onDelete(props.id);
  };

  return (
    <div className={`message ${messageClass}`}>
      {messageClass === "received" && <img src={photoURL} />}
      <div
        className="messageOptionsContainer"
      >
        {messageClass === "sent" && (
          <button
            className="deleteButton"
            onClick={handleDelete}
          >
            🗑️
          </button>
        )}
        <p>{text}</p>
      </div>

      {messageClass === "sent" && <img src={photoURL} />}
    </div>
  );
}

export default App;
