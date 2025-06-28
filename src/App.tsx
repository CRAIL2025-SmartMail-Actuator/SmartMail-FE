import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Routing from './routing'
import CRAILContextWrapper from './contexts/CRAIL-Context'
import ScreenLoader from './components/ScreenLoader'
function App() {

  return (
    <>
      <CRAILContextWrapper>
        <ScreenLoader />
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </CRAILContextWrapper>
    </>
  )
}

export default App
