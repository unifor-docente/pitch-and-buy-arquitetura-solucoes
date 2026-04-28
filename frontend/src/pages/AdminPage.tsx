import { useEffect, useState } from 'react';
import { Plus, RefreshCcw, Users } from 'lucide-react';
import { api } from '../api/http';
import type { Team, Voter } from '../types';

type TeamForm = {
  name: string;
  solutionName: string;
  theme: string;
};

type VoterForm = {
  name: string;
  teamId: string;
};

export function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [teamForm, setTeamForm] = useState<TeamForm>({
    name: '',
    solutionName: '',
    theme: '',
  });
  const [voterForm, setVoterForm] = useState<VoterForm>({
    name: '',
    teamId: '',
  });
  const [message, setMessage] = useState('');

  async function loadData() {
    const [teamsResponse, votersResponse] = await Promise.all([
      api.get<Team[]>('/teams'),
      api.get<Voter[]>('/voters'),
    ]);

    setTeams(teamsResponse.data);
    setVoters(votersResponse.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createTeam() {
    setMessage('');

    if (!teamForm.name || !teamForm.solutionName) {
      setMessage('Informe o nome da equipe e o nome da solução.');
      return;
    }

    try {
      await api.post('/teams', {
        name: teamForm.name,
        solutionName: teamForm.solutionName,
        theme: teamForm.theme || undefined,
      });

      setTeamForm({
        name: '',
        solutionName: '',
        theme: '',
      });

      setMessage('Equipe cadastrada com sucesso!');
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || 'Erro ao cadastrar equipe.');
    }
  }

  async function createVoter() {
    setMessage('');

    if (!voterForm.name || !voterForm.teamId) {
      setMessage('Informe o nome do votante e selecione a equipe.');
      return;
    }

    try {
      await api.post('/voters', voterForm);

      setVoterForm({
        name: '',
        teamId: '',
      });

      setMessage('Votante cadastrado com sucesso!');
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || 'Erro ao cadastrar votante.');
    }
  }

  return (
    <section>
      <div className="page-title">
        <h1>Admin Pitch & Buy</h1>
        <p>Cadastre equipes, soluções e votantes para a dinâmica ao vivo.</p>
      </div>

      {message && <div className="feedback-message">{message}</div>}

      <div className="admin-grid">
        <div className="card admin-card">
          <div className="section-heading">
            <Users size={22} />
            <h2>Cadastrar equipe</h2>
          </div>

          <label className="field-label">
            Nome da equipe
            <input
              className="input-field"
              value={teamForm.name}
              onChange={(event) =>
                setTeamForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex: Equipe Alpha"
            />
          </label>

          <label className="field-label">
            Nome da solução
            <input
              className="input-field"
              value={teamForm.solutionName}
              onChange={(event) =>
                setTeamForm((current) => ({
                  ...current,
                  solutionName: event.target.value,
                }))
              }
              placeholder="Ex: HealthNow"
            />
          </label>

          <label className="field-label">
            Tema
            <input
              className="input-field"
              value={teamForm.theme}
              onChange={(event) =>
                setTeamForm((current) => ({ ...current, theme: event.target.value }))
              }
              placeholder="Ex: Telemedicina"
            />
          </label>

          <button className="primary-button full-button" onClick={createTeam}>
            <Plus size={18} />
            Cadastrar equipe
          </button>
        </div>

        <div className="card admin-card">
          <div className="section-heading">
            <Users size={22} />
            <h2>Cadastrar votante</h2>
          </div>

          <label className="field-label">
            Nome do votante
            <input
              className="input-field"
              value={voterForm.name}
              onChange={(event) =>
                setVoterForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex: João - Equipe Alpha"
            />
          </label>

          <label className="field-label">
            Equipe do votante
            <select
              className="select-field"
              value={voterForm.teamId}
              onChange={(event) =>
                setVoterForm((current) => ({ ...current, teamId: event.target.value }))
              }
            >
              <option value="">Selecione uma equipe</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} — {team.solutionName}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button full-button" onClick={createVoter}>
            <Plus size={18} />
            Cadastrar votante
          </button>
        </div>
      </div>

      <div className="admin-actions">
        <button className="secondary-button" onClick={loadData}>
          <RefreshCcw size={18} />
          Atualizar dados
        </button>
      </div>

      <div className="admin-grid">
        <div className="card">
          <div className="section-heading">
            <h2>Equipes cadastradas</h2>
          </div>

          <div className="list-stack">
            {teams.map((team) => (
              <div className="list-item" key={team.id}>
                <strong>{team.name}</strong>
                <span>{team.solutionName}</span>
                {team.theme && <small>{team.theme}</small>}
              </div>
            ))}

            {teams.length === 0 && <div className="empty-state">Nenhuma equipe cadastrada.</div>}
          </div>
        </div>

        <div className="card">
          <div className="section-heading">
            <h2>Votantes cadastrados</h2>
          </div>

          <div className="list-stack">
            {voters.map((voter) => (
              <div className="list-item" key={voter.id}>
                <strong>{voter.name}</strong>
                <span>{voter.team?.name || 'Equipe não informada'}</span>
              </div>
            ))}

            {voters.length === 0 && <div className="empty-state">Nenhum votante cadastrado.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}