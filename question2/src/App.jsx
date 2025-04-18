import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Comments from "./pages/Comments.js";
import Posts from "./pages/Posts.js";
import Users from "./pages/Users.js";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Social Media Analytics</h1>
        <Users />
        <Posts />
        <Comments />
      </div>
    </>
  )
}

export default App
