import AppRouter from './routes/AppRouter'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Notification } from './context/NotificationContext'

function App() {
  return (
    <BrowserRouter>
      <Notification>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Notification>
    </BrowserRouter>
  )
}

export default App
