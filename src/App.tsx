import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import './index.css';

import HomePage from './pages/HomePage';
import { AppDispatch } from './store';
import { fetchCurrentUser } from './store/slices/AuthSlice';
import useScrollRestoration from './hooks/useScrollRestoration';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  useScrollRestoration();
  const dispatch = useDispatch<AppDispatch>();
  // Tracks whether the app is fully ready to render
  const [isAppReady, setIsAppReady] = useState(false);
  // Controls whether to show the loading screen based on timing
  const [shouldShowLoading, setShouldShowLoading] = useState(false);


  useEffect(() => {
    let didTimeout = false;

    // Only show the loading screen if initialization takes longer than 300ms
    const timer = setTimeout(() => {
      setShouldShowLoading(true);
      didTimeout = true;
    }, 300);

    const initialize = async () => {
      const remember = localStorage.getItem('remember_me') === 'true';
      const token = localStorage.getItem('access_token');
      if (remember && token) {
        await dispatch(fetchCurrentUser());
      }
      clearTimeout(timer);
      setIsAppReady(true);
    };

    initialize();

    // Cleanup in case the component unmounts early
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Show loading screen if the app is not ready and loading delay passed */}
      {!isAppReady && shouldShowLoading && (
        <LoadingScreen
          logoSrc="/images/logo_no_bg.png"
          message="Welcome to the app"
        />
      )}

      {/* Render main content once app is fully initialized */}
      {isAppReady && <HomePage onReady={() => setIsAppReady(true)} />}
    </>
  );
}

export default App;
