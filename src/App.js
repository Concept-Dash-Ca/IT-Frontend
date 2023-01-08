import './App.css';
import AuthenticationState from './Context/AuthState';
import AllRoutes from './Routes/Routes';

function App() {
  return (
    <>
      <AuthenticationState>
        <AllRoutes />
      </AuthenticationState>
    </>
  );
}

export default App;