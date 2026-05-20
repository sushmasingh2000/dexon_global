import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();
  const iframeOrigin = 'https://web.dexon.global';

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== iframeOrigin || typeof event.data !== 'string') {
        return;
      }

      if (event.data === 'goToLogin') {
        navigate('/login');
      } else if (event.data === 'goToregister') {
        navigate('/register');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, iframeOrigin]);

  return (
    <iframe
      src="https://web.dexon.global"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        overflow: 'hidden',
      }}
      title="Static HTML Page"
    />

  );
}

export default Main;
