// Écran d'inscription
import React from 'react';
import RegisterForm from './RegisterForm';
import ScreenBackground from '../../components/ScreenBackground';

//
const RegisterScreen: React.FC = () => {
  return (
  <ScreenBackground>
    <RegisterForm />
  </ScreenBackground>
  );
};



export default RegisterScreen;