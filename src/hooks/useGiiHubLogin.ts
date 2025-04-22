import { useState } from 'react'

export function useGitHubLoginHandler() {
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(false)
  const [errorGitHub, setErrorGitHub] = useState('')

  const handleGitHubLogin = () => {
    setIsLoadingGitHub(true)
    setErrorGitHub('')
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL
      const githubOAuthURL = `${apiUrl}/auth/github`;
      window.location.href = githubOAuthURL;
    } catch (err) {
      console.error('GitHub redirect error:', err)
      setErrorGitHub('Could not redirect to GitHub')
      setIsLoadingGitHub(false)
    }
  }

  return { isLoadingGitHub, errorGitHub, handleGitHubLogin }
}
