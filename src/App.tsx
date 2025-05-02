import { useDispatch, useSelector } from 'react-redux';
import './index.css'
import HomePage from './pages/HomePage'
import { AppDispatch } from './store';
import { useEffect } from 'react';
import { fetchCurrentUser } from './store/slices/AuthSlice';
import useScrollRestoration from './hooks/useScrollRestoration';

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
