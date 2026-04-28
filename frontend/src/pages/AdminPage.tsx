import { useEffect, useState } from 'react';
import { Edit3, Plus, RefreshCcw, Trash2, Users, X } from 'lucide-react';
import { api } from '../api/http';
import type { Team, Voter } from '../types';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

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
  const [loading, setLoading] = useState(false);

  // --- Funções de Notificação e Feedback ---
  function showSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: message,
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#2563eb',
    });
  }

  function showError(message: string | string[]) {
    const text = Array.isArray(message) ? message.join(', ') : message;
    Swal.fire({
      icon: 'error',
      title: 'Ops...',
      text: text || 'Ocorreu um erro inesperado.',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#dc2626',
    });
  }

  async function showConfirm(title: string, text: string) {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#334155',
    });
    return result.isConfirmed;
  }

  // --- Carregamento de Dados ---
  async function loadData() {
    setLoading(true);
    try {
      const [teamsResponse, votersResponse] = await Promise.all([
        api.get<Team[]>('/teams'),
        api.get<Voter[]>('/voters'),
      ]);
      setTeams(teamsResponse.data);
      setVoters(votersResponse.data);
    } catch (error) {
      showError('Erro ao carregar dados do servidor.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // --- Helpers de Formulário ---
  function clearTeamForm() {
    setTeamForm(emptyTeamForm);
    setEditingTeamId(null);
  }

  function clearVoterForm() {
    setVoterForm(emptyVoterForm);
    setEditingVoterId(null);
  }

  // --- Ações de Equipe ---
  function editTeam(team: Team) {
    setEditingTeamId(team.id);
    setTeamForm({
      name: team.name,
      solutionName: team.solutionName,
      theme: team.theme || '',
    });
  }

  async function saveTeam() {
    if (!teamForm.name || !teamForm.solutionName) {
      showError('Informe o nome da equipe e o nome da solução.');
      return;
    }

    try {
      const payload = {
        name: teamForm.name,
        solutionName: teamForm.solutionName,
        theme: teamForm.theme || undefined,
      };

      if (editingTeamId) {
        await api.patch(`/teams/${editingTeamId}`, payload);
        showSuccess('Equipe atualizada com sucesso!');
      } else {
        await api.post('/teams', payload);
        showSuccess('Equipe cadastrada com sucesso!');
      }

      clearTeamForm();
      await loadData();
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Erro ao salvar equipe.');
    }
  }

  async function deleteTeam(team: Team) {
    const confirmed = await showConfirm(
      'Confirmação',
      `Deseja excluir a equipe "${team.name}"? Isso também removerá votantes e votos relacionados.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/teams/${team.id}`);
      if (editingTeamId === team.id) clearTeamForm();
      showSuccess('Equipe excluída com sucesso!');
      await loadData();
    } catch (error: any) {
      showError('Erro ao excluir equipe.');
    }
  }

  // --- Ações de Votante ---
  function editVoter(voter: Voter) {
    setEditingVoterId(voter.id);
    setVoterForm({
      name: voter.name,
      teamId: voter.teamId,
    });
  }

  async function saveVoter() {
    if (!voterForm.name || !voterForm.teamId) {
      showError('Informe o nome do votante e selecione a equipe.');
      return;
    }

    try {
      if (editingVoterId) {
        await api.patch(`/voters/${editingVoterId}`, voterForm);
        showSuccess('Votante atualizado com sucesso!');
      } else {
        await api.post('/voters', voterForm);
        showSuccess('Votante cadastrado com sucesso!');
      }

      clearVoterForm();
      await loadData();
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Erro ao salvar votante.');
    }
  }

  async function deleteVoter(voter: Voter) {
    const confirmed = await showConfirm(
      'Confirmação',
      `Deseja excluir o votante "${voter.name}"? Isso também removerá os votos realizados por ele.`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/voters/${voter.id}`);
      if (editingVoterId === voter.id) clearVoterForm();
      showSuccess('Votante excluído com sucesso!');
      await loadData();
    } catch (error: any) {
      showError('Erro ao excluir votante.');
    }
  }

  return (
    <section>
      <div className="page-title">
        <h1>Admin Pitch & Buy</h1>
        <p>Cadastre, edite e remova equipes, soluções e votantes para a dinâmica ao vivo.</p>
      </div>

      <div className="admin-grid">
        {/* Card Cadastro Equipe */}
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
              onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Equipe Alpha"
            />
          </label>

          <label className="field-label">
            Nome da solução
            <input
              className="input-field"
              value={teamForm.solutionName}
              onChange={(e) => setTeamForm(prev => ({ ...prev, solutionName: e.target.value }))}
              placeholder="Ex: HealthNow"
            />
          </label>

          <label className="field-label">
            Tema
            <input
              className="input-field"
              value={teamForm.theme}
              onChange={(e) => setTeamForm(prev => ({ ...prev, theme: e.target.value }))}
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
                <X size={18} /> Cancelar edição
              </button>
            )}
          </div>
        </div>

        {/* Card Cadastro Votante */}
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
              onChange={(e) => setVoterForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: João - Equipe Alpha"
            />
          </label>

          <label className="field-label">
            Equipe do votante
            <select
              className="select-field"
              value={voterForm.teamId}
              onChange={(e) => setVoterForm(prev => ({ ...prev, teamId: e.target.value }))}
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
                <X size={18} /> Cancelar edição
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button className="secondary-button" onClick={loadData} disabled={loading}>
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Atualizando...' : 'Atualizar dados'}
        </button>
      </div>

      <div className="admin-grid">
        {/* Lista Equipes */}
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
                  <button className="icon-button danger" onClick={() => deleteTeam(team)} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {teams.length === 0 && <div className="empty-state">Nenhuma equipe cadastrada.</div>}
          </div>
        </div>

        {/* Lista Votantes */}
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
                  <button className="icon-button danger" onClick={() => deleteVoter(voter)} title="Excluir">
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