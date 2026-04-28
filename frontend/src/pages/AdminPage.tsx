import { useEffect, useState } from 'react';
import { Edit3, Plus, RefreshCcw, Trash2, Users, X } from 'lucide-react';
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

const emptyTeamForm: TeamForm = {
  name: '',
  solutionName: '',
  theme: '',
};

const emptyVoterForm: VoterForm = {
  name: '',
  teamId: '',
};

export function AdminPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);

  const [teamForm, setTeamForm] = useState<TeamForm>(emptyTeamForm);
  const [voterForm, setVoterForm] = useState<VoterForm>(emptyVoterForm);

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingVoterId, setEditingVoterId] = useState<string | null>(null);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [teamsResponse, votersResponse] = await Promise.all([
        api.get<Team[]>('/teams'),
        api.get<Voter[]>('/voters'),
      ]);

      setTeams(teamsResponse.data);
      setVoters(votersResponse.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function clearTeamForm() {
    setTeamForm(emptyTeamForm);
    setEditingTeamId(null);
  }

  function clearVoterForm() {
    setVoterForm(emptyVoterForm);
    setEditingVoterId(null);
  }

  function editTeam(team: Team) {
    setMessage('');
    setEditingTeamId(team.id);
    setTeamForm({
      name: team.name,
      solutionName: team.solutionName,
      theme: team.theme || '',
    });
  }

  function editVoter(voter: Voter) {
    setMessage('');
    setEditingVoterId(voter.id);
    setVoterForm({
      name: voter.name,
      teamId: voter.teamId,
    });
  }

  async function saveTeam() {
    setMessage('');

    if (!teamForm.name || !teamForm.solutionName) {
      setMessage('Informe o nome da equipe e o nome da solução.');
      return;
    }

    try {
      if (editingTeamId) {
        await api.patch(`/teams/${editingTeamId}`, {
          name: teamForm.name,
          solutionName: teamForm.solutionName,
          theme: teamForm.theme || undefined,
        });

        setMessage('Equipe atualizada com sucesso!');
      } else {
        await api.post('/teams', {
          name: teamForm.name,
          solutionName: teamForm.solutionName,
          theme: teamForm.theme || undefined,
        });

        setMessage('Equipe cadastrada com sucesso!');
      }

      clearTeamForm();
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Erro ao salvar equipe.',
      );
    }
  }

  async function saveVoter() {
    setMessage('');

    if (!voterForm.name || !voterForm.teamId) {
      setMessage('Informe o nome do votante e selecione a equipe.');
      return;
    }

    try {
      if (editingVoterId) {
        await api.patch(`/voters/${editingVoterId}`, {
          name: voterForm.name,
          teamId: voterForm.teamId,
        });

        setMessage('Votante atualizado com sucesso!');
      } else {
        await api.post('/voters', voterForm);

        setMessage('Votante cadastrado com sucesso!');
      }

      clearVoterForm();
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Erro ao salvar votante.',
      );
    }
  }

  async function deleteTeam(team: Team) {
    const confirmed = window.confirm(
      `Deseja excluir a equipe "${team.name}"?\n\nIsso também removerá votantes e votos relacionados.`,
    );

    if (!confirmed) return;

    setMessage('');

    try {
      await api.delete(`/teams/${team.id}`);

      if (editingTeamId === team.id) {
        clearTeamForm();
      }

      setMessage('Equipe excluída com sucesso!');
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Erro ao excluir equipe.',
      );
    }
  }

  async function deleteVoter(voter: Voter) {
    const confirmed = window.confirm(
      `Deseja excluir o votante "${voter.name}"?\n\nIsso também removerá os votos realizados por ele.`,
    );

    if (!confirmed) return;

    setMessage('');

    try {
      await api.delete(`/voters/${voter.id}`);

      if (editingVoterId === voter.id) {
        clearVoterForm();
      }

      setMessage('Votante excluído com sucesso!');
      await loadData();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      setMessage(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Erro ao excluir votante.',
      );
    }
  }

  return (
    <section>
      <div className="page-title">
        <h1>Admin Pitch & Buy</h1>
        <p>Cadastre, edite e remova equipes, soluções e votantes para a dinâmica ao vivo.</p>
      </div>

      {message && <div className="feedback-message">{message}</div>}

      <div className="admin-grid">
        <div className="card admin-card">
          <div className="section-heading">
            <Users size={22} />
            <h2>{editingTeamId ? 'Editar equipe' : 'Cadastrar equipe'}</h2>
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

          <div className="form-actions">
            <button className="primary-button full-button" onClick={saveTeam}>
              {editingTeamId ? <Edit3 size={18} /> : <Plus size={18} />}
              {editingTeamId ? 'Salvar alterações' : 'Cadastrar equipe'}
            </button>

            {editingTeamId && (
              <button className="secondary-button full-button" onClick={clearTeamForm}>
                <X size={18} />
                Cancelar edição
              </button>
            )}
          </div>
        </div>

        <div className="card admin-card">
          <div className="section-heading">
            <Users size={22} />
            <h2>{editingVoterId ? 'Editar votante' : 'Cadastrar votante'}</h2>
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

          <div className="form-actions">
            <button className="primary-button full-button" onClick={saveVoter}>
              {editingVoterId ? <Edit3 size={18} /> : <Plus size={18} />}
              {editingVoterId ? 'Salvar alterações' : 'Cadastrar votante'}
            </button>

            {editingVoterId && (
              <button className="secondary-button full-button" onClick={clearVoterForm}>
                <X size={18} />
                Cancelar edição
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button className="secondary-button" onClick={loadData} disabled={loading}>
          <RefreshCcw size={18} />
          {loading ? 'Atualizando...' : 'Atualizar dados'}
        </button>
      </div>

      <div className="admin-grid">
        <div className="card">
          <div className="section-heading">
            <h2>Equipes cadastradas</h2>
          </div>

          <div className="list-stack">
            {teams.map((team) => (
              <div className="list-item list-item-with-actions" key={team.id}>
                <div>
                  <strong>{team.name}</strong>
                  <span>{team.solutionName}</span>
                  {team.theme && <small>{team.theme}</small>}
                </div>

                <div className="item-actions">
                  <button className="icon-button" onClick={() => editTeam(team)} title="Editar">
                    <Edit3 size={16} />
                  </button>

                  <button
                    className="icon-button danger"
                    onClick={() => deleteTeam(team)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
              <div className="list-item list-item-with-actions" key={voter.id}>
                <div>
                  <strong>{voter.name}</strong>
                  <span>{voter.team?.name || 'Equipe não informada'}</span>
                </div>

                <div className="item-actions">
                  <button className="icon-button" onClick={() => editVoter(voter)} title="Editar">
                    <Edit3 size={16} />
                  </button>

                  <button
                    className="icon-button danger"
                    onClick={() => deleteVoter(voter)}
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {voters.length === 0 && <div className="empty-state">Nenhum votante cadastrado.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}