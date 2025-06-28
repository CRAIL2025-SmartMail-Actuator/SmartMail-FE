import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Routing from './routing'
import CRAILContextWrapper from './contexts/CRAIL-Context'
function App() {

  return (
    <>
      <CRAILContextWrapper>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </CRAILContextWrapper>
    </>
  )
}

export default App
