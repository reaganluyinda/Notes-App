import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";
import loginService from "./services/login"; 
import Notification from "./components/Notification.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from "./components/LoginForm.jsx";
import NoteForm from "./components/NoteForm.jsx";
import Togglable from "./components/Togglable.jsx";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const[user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      console.log("promise fulfilled");
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  //login handler
  const handleLogin = async event => {
    event.preventDefault();
    console.log("logged in with", username, password)

    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser');
    setUser(null);
  }

  const addNote = (noteObject) => {
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
    });
  };


  // toggle importance of a note
  const toggleImportanceOf = (id) => {
    console.log(`importance of ${id} has been toggled`);
    // const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        setErrorMessage(
          `Note '${note.content}' was already removed from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
 
  return (
    <div>
      <h1>Notes App</h1>
      <Notification message={errorMessage} />

{/* login or note form */}
     {!user && (
      <Togglable buttonLabel='login'>
  <LoginForm handleSubmit={handleLogin} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} username={username} password={password} />
 </Togglable>

     ) }
    {user && (<div><p>Welcome, {user.name}! <button onClick={handleLogout}>logout</button></p><Togglable buttonLabel='new note'><NoteForm createNote={addNote} /></Togglable></div>)}

{/* end of login or form */}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
     
      <Footer />
    </div>
  );
};
export default App;
