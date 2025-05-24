import  { useState } from 'react';
import Login from './Login';
import WebsiteOverview from '@/components/website/WebsiteOverview';

const AuthPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  

  const handleSignInClick = () => {
    setShowLoginForm(true);
  };

  return (
    <>
      {!showLoginForm ? (
        <WebsiteOverview onSignInClick={handleSignInClick} />
      ) : (
        <Login />
      )}
    </>
  );
};

export default AuthPage;