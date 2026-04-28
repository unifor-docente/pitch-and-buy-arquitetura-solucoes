import { Trophy, Vote, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="hero">
      <div className="hero-badge">
        <Zap size={18} />
        Desafio final de Arquitetura de Soluções
      </div>

      <h1>
        <span className="text-white">Pitch</span>{" "}
        <span className="text-blue">&</span>{" "}
        <span className="text-gradient">Buy</span>
      </h1>

      <p>
        Apresente sua solução, defenda suas decisões arquiteturais e descubra
        se o mercado compraria sua ideia.
      </p>

      <div className="hero-actions">
        <Link to="/vote" className="primary-button">
          <Vote size={20} />
          Ir para votação
        </Link>

        <Link to="/ranking" className="secondary-button">
          <Trophy size={20} />
          Ver ranking
        </Link>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <strong>1</strong>
          <span>Pitch da solução</span>
        </div>

        <div className="info-card">
          <strong>2</strong>
          <span>Defesa técnica</span>
        </div>

        <div className="info-card">
          <strong>3</strong>
          <span>Votação ao vivo</span>
        </div>
      </div>
    </section>
  );
}