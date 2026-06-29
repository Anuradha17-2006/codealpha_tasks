import AppRoutes from '@routes'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@api/client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App
