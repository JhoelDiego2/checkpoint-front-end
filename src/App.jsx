import { useEffect, useState } from 'react'
import DescobrirJogosPage from './pages/DescobrirJogosPage.jsx'
import DetalheJogoPage from './pages/DetalheJogoPage.jsx'
import MinhaListaPage from './pages/MinhaListaPage.jsx'
import './components/catalog.css'

function App() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const detailMatch = hash.match(/^#\/jogos\/(\d+)\/?$/)
  const gameId = detailMatch ? Number(detailMatch[1]) : undefined

  return (
    <>
      <nav className="catalog-nav" aria-label="Navegação principal">
        <a href="#/" className="catalog-nav__brand">Checkpoint</a>
        <div className="catalog-nav__links">
          <a href="#/" aria-current={!hash || hash === '#/' ? 'page' : undefined}>Descobrir</a>
          <a href="#/minha-lista" aria-current={hash === '#/minha-lista' ? 'page' : undefined}>Minha Lista</a>
        </div>
      </nav>
      {gameId ? (
        <DetalheJogoPage gameId={gameId} />
      ) : hash === '#/minha-lista' ? (
        <MinhaListaPage />
      ) : (
        <DescobrirJogosPage />
      )}
    </>
  )
}

export default App