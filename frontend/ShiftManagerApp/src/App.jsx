import AppRouter from './routes/AppRouter'
import { Notification } from './context/NotificationContext'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { ClientProvider } from './context/ClientContext'
import { ProviderProvider } from './context/ProviderContext'
import { ProviderServiceProvider } from './context/ProviderServiceContext'
import { RoleProvider } from './context/RoleContext'
import { ServicesProvider } from './context/ServicesContext'
import { ShiftsProvider } from './context/ShiftsContext'
import { UserProvider } from './context/UserContext'
import { WorkSchedulesProvider } from './context/WorkSchedulesContext'

function App() {
  return (
    <Notification>
      <AuthProvider>
        <UserProvider>
          <RoleProvider>
            <ProfileProvider>
              <ServicesProvider>
                <ProviderProvider>
                  <WorkSchedulesProvider>
                    <ProviderServiceProvider>
                      <ClientProvider>
                        <ShiftsProvider>
                          <AppRouter />
                        </ShiftsProvider>
                      </ClientProvider>
                    </ProviderServiceProvider>
                  </WorkSchedulesProvider>
                </ProviderProvider>
              </ServicesProvider>
            </ProfileProvider>
          </RoleProvider>
        </UserProvider>
      </AuthProvider>
    </Notification>
  )
}

export default App
