import { useState } from 'react'
import './catalog.css'

export default function SearchBar({ onSearch, isLoading = false }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form className="catalog-search" onSubmit={handleSubmit}>
      <label className="catalog-search__field" htmlFor="game-search">
        <span>Buscar jogos</span>
        <input
          id="game-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Digite o nome de um jogo"
        />
      </label>
      <button className="catalog-search__submit" type="submit" disabled={isLoading}>
        Buscar
      </button>
    </form>
  )
}
