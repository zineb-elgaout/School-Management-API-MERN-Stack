import { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const AuthScreen = () => {
  const [view, setView] = useState('login');

  if (view === 'register') {
    return <RegisterScreen onBack={() => setView('login')} />;
  }

  return <LoginScreen onRegister={() => setView('register')} />;
};

export default AuthScreen;
