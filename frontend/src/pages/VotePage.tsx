import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShoppingCart, ThumbsDown, ThumbsUp } from 'lucide-react';
import { api } from '../api/http';
import type { PurchaseIntent, SolutionRating, Team, Voter } from '../types';

type VoteForm = {
  solutionRating: SolutionRating | '';
  purchaseIntent: PurchaseIntent | '';
};

const solutionRatingOptions: {
  value: SolutionRating;
  label: string;
  description: string;
}[] = [
  {
    value: 'LIKE',
    label: 'Gostei',
    description: 'A solução parece clara, viável e bem defendida.',
  },
  {
    value: 'PARTIAL',
    label: 'Gostei parcialmente',
    description: 'A solução tem potencial, mas ainda gera dúvidas.',
  },
  {
    value: 'DISLIKE',
    label: 'Não gostei',
    description: 'A solução não ficou convincente ou parece pouco viável.',
  },
];

const purchaseIntentOptions: {
  value: PurchaseIntent;
  label: string;
  description: string;
}[] = [
  {
    value: 'BUY',
    label: 'Compraria',
    description: 'Eu adotaria essa solução.',
  },
  {
    value: 'MAYBE',
    label: 'Talvez compraria',
    description: 'Eu consideraria, mas precisaria de mais ajustes.',
  },
  {
    value: 'NO',
    label: 'Não compraria',
    description: 'Eu não adotaria essa solução neste momento.',
  },
];

export function VotePage() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [selectedVoterId, setSelectedVoterId] = useState('');
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [form, setForm] = useState<VoteForm>({
    solutionRating: '',
    purchaseIntent: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [message, setMessage] = useState('');

  const selectedTeam = useMemo(
    () => availableTeams.find((team) => team.id === selectedTeamId),
    [availableTeams, selectedTeamId],
  );

  async function loadVoters() {
    const response = await api.get<Voter[]>('/voters');
    setVoters(response.data);
  }

  async function loadAvailableTeams(voterId: string) {
    if (!voterId) return;

    setLoadingTeams(true);
    setSelectedTeamId('');
    setForm({
      solutionRating: '',
      purchaseIntent: '',
    });

    try {
      const response = await api.get<Team[]>(`/teams/available/${voterId}`);
      setAvailableTeams(response.data);
    } finally {
      setLoadingTeams(false);
    }
  }

  useEffect(() => {
    loadVoters();
  }, []);

  useEffect(() => {
    if (selectedVoterId) {
      loadAvailableTeams(selectedVoterId);
    }
  }, [selectedVoterId]);

  async function handleSubmit() {
    if (!selectedVoterId || !selectedTeamId || !form.solutionRating || !form.purchaseIntent) {
      setMessage('Selecione o votante, a equipe avaliada e responda as duas perguntas.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.post('/votes', {
        voterId: selectedVoterId,
        teamId: selectedTeamId,
        solutionRating: form.solutionRating,
        purchaseIntent: form.purchaseIntent,
      });

       confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.65 },
       });

    setMessage('🎉 Voto registrado com sucesso! Obrigado por participar do Pitch & Buy.');
    await loadAvailableTeams(selectedVoterId);
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || 'Erro ao registrar voto.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="page-title">
        <h1>Votação Pitch & Buy</h1>
        <p>Escolha seu votante, selecione a solução apresentada e registre sua avaliação.</p>
      </div>

      <div className="vote-layout">
        <div className="card vote-card">
          <span className="step-badge">1</span>
          <h2>Quem está votando?</h2>
          <p>Selecione o votante vinculado à sua equipe.</p>

          <select
            value={selectedVoterId}
            onChange={(event) => setSelectedVoterId(event.target.value)}
            className="select-field"
          >
            <option value="">Selecione um votante</option>
            {voters.map((voter) => (
              <option key={voter.id} value={voter.id}>
                {voter.name} {voter.team ? `(${voter.team.name})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="card vote-card">
          <span className="step-badge">2</span>
          <h2>Qual solução será avaliada?</h2>
          <p>O sistema remove sua própria equipe e soluções já avaliadas.</p>

          {loadingTeams ? (
            <div className="empty-state">Carregando equipes disponíveis...</div>
          ) : (
            <div className="team-grid">
              {availableTeams.map((team) => (
                <button
                  key={team.id}
                  className={`team-option ${selectedTeamId === team.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTeamId(team.id)}
                >
                  <strong>{team.solutionName}</strong>
                  <span>{team.name}</span>
                  {team.theme && <small>{team.theme}</small>}
                </button>
              ))}

              {selectedVoterId && availableTeams.length === 0 && (
                <div className="empty-state">
                  Não há mais equipes disponíveis para votação.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedTeam && (
        <div className="selected-solution">
          <span>Solução selecionada</span>
          <strong>{selectedTeam.solutionName}</strong>
          <small>{selectedTeam.name}</small>
        </div>
      )}

      <div className="vote-questions">
        <div className="card vote-card">
          <span className="step-badge">3</span>
          <h2>Como você avalia a solução?</h2>

          <div className="option-grid">
            {solutionRatingOptions.map((option) => (
              <button
                key={option.value}
                className={`vote-option ${form.solutionRating === option.value ? 'selected' : ''}`}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    solutionRating: option.value,
                  }))
                }
              >
                {option.value === 'LIKE' && <ThumbsUp size={24} />}
                {option.value === 'PARTIAL' && <CheckCircle2 size={24} />}
                {option.value === 'DISLIKE' && <ThumbsDown size={24} />}

                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card vote-card">
          <span className="step-badge">4</span>
          <h2>Você compraria ou adotaria essa solução?</h2>

          <div className="option-grid">
            {purchaseIntentOptions.map((option) => (
              <button
                key={option.value}
                className={`vote-option ${form.purchaseIntent === option.value ? 'selected' : ''}`}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    purchaseIntent: option.value,
                  }))
                }
              >
                <ShoppingCart size={24} />
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && <div className="feedback-message">{message}</div>}

      <div className="submit-area">
        <button className="primary-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registrando voto...' : 'Confirmar voto'}
        </button>
      </div>
    </section>
  );
}