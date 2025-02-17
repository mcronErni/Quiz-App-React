import { createRoot, ReactDOM } from 'react-dom/client'
import './index.css'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </StrictMode>,
  
)
