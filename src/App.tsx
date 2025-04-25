import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import useScrollRestoration from './hooks/useScrollRestoration';
import './index.css'
import HomePage from './pages/HomePage'
import { AppDispatch, RootState } from './store';
import { useEffect } from 'react';
import { fetchCurrentUser } from './store/slices/AuthSlice';

function App() {
  useScrollRestoration();
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchCurrentUser())
  }, [])

  return (
    <>
      <HomePage />
    </>
  )
}

export default App
