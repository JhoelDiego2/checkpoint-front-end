import './catalog.css'

export default function GameCard({ game }) {
  return (
    <article className="catalog-game-card">
      {game.thumbnail ? (
        <img
          className="catalog-game-card__image"
          src={game.thumbnail}
          alt={`Capa de ${game.title}`}
          loading="lazy"
        />
      ) : (
        <div className="catalog-game-card__image-fallback">Imagem indisponível</div>
      )}
      <div className="catalog-game-card__content">
        <h2>{game.title}</h2>
        {game.platform && (
          <p>
            <strong>Plataformas:</strong> {game.platform}
          </p>
        )}
        {game.releaseDate && (
          <p>
            <strong>Lançamento:</strong> {game.releaseDate}
          </p>
        )}
      </div>
    </article>
  )
}
