import { useEffect, useState } from 'react';
import { Award, BarChart3, ShoppingCart, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/http';
import type { TeamResult } from '../types';

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress-item">
      <div className="progress-header">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ResultsPage() {
  const { teamId } = useParams();
  const [result, setResult] = useState<TeamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      if (!teamId) return;

      try {
        const response = await api.get<TeamResult>(`/results/team/${teamId}`);
        setResult(response.data);
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [teamId]);

  if (loading) {
    return <div className="card">Carregando resultado...</div>;
  }

  if (!result) {
    return <div className="card">Resultado não encontrado.</div>;
  }

  return (
    <section>
      <div className="page-title">
        <h1>Resultado da Solução</h1>
        <p>Veja a percepção da turma sobre a solução apresentada.</p>
      </div>

      <div className="result-hero card">
        <div>
          <span className="hero-badge inline-badge">
            <Sparkles size={16} />
            O mercado decidiu
          </span>

          <h2>{result.team.solutionName}</h2>
          <p>
            {result.team.name}
            {result.team.theme ? ` • ${result.team.theme}` : ''}
          </p>
        </div>

        <div className="score-circle">
          <span>{result.finalScore}</span>
          <small>/100</small>
        </div>
      </div>

      <div className="status-banner">
        <Award size={22} />
        <strong>{result.status}</strong>
      </div>

      <div className="result-grid">
        <div className="card">
          <div className="section-heading">
            <BarChart3 size={22} />
            <h2>Avaliação da solução</h2>
          </div>

          <ProgressBar label="Gostei" value={result.solutionRating.percentages.LIKE} />
          <ProgressBar
            label="Gostei parcialmente"
            value={result.solutionRating.percentages.PARTIAL}
          />
          <ProgressBar label="Não gostei" value={result.solutionRating.percentages.DISLIKE} />

          <div className="mini-score">
            Score de aceitação: <strong>{result.solutionRating.score}/100</strong>
          </div>
        </div>

        <div className="card">
          <div className="section-heading">
            <ShoppingCart size={22} />
            <h2>Intenção de compra</h2>
          </div>

          <ProgressBar label="Compraria" value={result.purchaseIntent.percentages.BUY} />
          <ProgressBar
            label="Talvez compraria"
            value={result.purchaseIntent.percentages.MAYBE}
          />
          <ProgressBar label="Não compraria" value={result.purchaseIntent.percentages.NO} />

          <div className="mini-score">
            Score de compra: <strong>{result.purchaseIntent.score}/100</strong>
          </div>
        </div>
      </div>

      <div className="submit-area">
        <Link to="/ranking" className="secondary-button">
          Ver ranking final
        </Link>
      </div>
    </section>
  );
}