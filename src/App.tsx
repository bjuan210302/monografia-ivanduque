import { Caricature } from './components/Caricature'
import { Feedback } from './components/Feedback'
import { Illustration } from './components/Illustration'
import './index.css'


function App() {

  return (
    <div
      className='flex flex-col'>
      <Caricature />
      <Illustration />
      <Feedback />
    </div>
  )
}

export default App
