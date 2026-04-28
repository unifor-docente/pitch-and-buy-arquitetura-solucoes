import { useEffect, useState } from 'react';
import { Crown, Medal, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/http';
import type { TeamResult } from '../types';

function getPositionIcon(position: number) {
  if (position === 1) return <Crown size={26} />;
  if (position === 2) return <Medal size={24} />;
  if (position === 3) return <Trophy size={24} />;
  return <span className="position-number">{position}</span>;
}

export function RankingPage() {
  const [ranking, setRanking] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRanking() {
    setLoading(true);

    try {
        const response = await api.get<TeamResult[]>('/results/ranking');
        setRanking(response.data);
    } finally {
        setLoading(false);
    }
}

  useEffect(() => {
    let isMounted = true;

    const fetchRanking = async () => {
        if (!isMounted) return;
        await loadRanking();
    };

    fetchRanking();

    const interval = setInterval(fetchRanking, 10000);

    return () => {
        isMounted = false;
        clearInterval(interval);
    };
    }, []);

  return (
    <section>
      <div className="page-title">
        <h1>Ranking Pitch & Buy</h1>
        <p>Classificação geral das soluções avaliadas pelo mercado.</p>
      </div>

      {loading ? (
        <div className="card">Carregando ranking...</div>
      ) : (
        <div className="ranking-list">
          {ranking.map((item, index) => {
            const position = index + 1;

            return (
              <Link
                to={`/results/${item.team.id}`}
                className={`ranking-card position-${position}`}
                style={{ animationDelay: `${index * 90}ms` }}
                key={item.team.id}
              >
                <div className="ranking-position">{getPositionIcon(position)}</div>

                <div className="ranking-content">
                  <strong>{item.team.solutionName}</strong>
                  <span>
                    {item.team.name}
                    {item.team.theme ? ` • ${item.team.theme}` : ''}
                  </span>
                  <small>{item.status}</small>
                </div>

                <div className="ranking-score">
                  <span>{item.finalScore}</span>
                  <small>/100</small>
                </div>
              </Link>
            );
          })}

          {ranking.length === 0 && (
            <div className="card">Nenhum resultado disponível ainda.</div>
          )}
        </div>
      )}

      <div className="submit-area">
        <button
            type="button"
            className="secondary-button refresh-ranking-button"
            onClick={loadRanking}
            disabled={loading}
            >
            {loading ? 'Atualizando...' : 'Atualizar ranking'}
            </button>
      </div>
    </section>
  );
}