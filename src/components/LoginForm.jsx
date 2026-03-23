import { useState } from 'react'
const LoginForm = ({ createLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logged in with', username, password)
    createLogin({ username, password })
    setUsername('')
    setPassword('')
  }


  return(

    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>
        username
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)}/>
          </label>
        </div>
        <div>
          <label>
        password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )}

export default LoginForm