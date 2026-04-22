import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bulkImportPlants, changeUserRole, createPlant, deletePlant, fetchAdminStats, fetchAdminUsers, updatePlant } from '../api/admin';
import { getPlants } from '../api/plants';
import { getApiErrorMessage } from '../api/errors';
import styles from './AdminPage.module.css';

const SAMPLE_IMPORT = JSON.stringify([
  {
    commonName: 'Sample Herb',
    scientificName: 'Herba samplea',
    nativeRegion: 'India',
    description: 'Sample import payload item.',
    isActive: true,
  },
], null, 2);

export default function AdminPage() {
  const token = window.localStorage.getItem('vanaspati_token');
  const queryClient = useQueryClient();
  const [payloadText, setPayloadText] = useState(SAMPLE_IMPORT);
  const [parseError, setParseError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [roleUpdatingUserId, setRoleUpdatingUserId] = useState(null);
  const [deletingPlantId, setDeletingPlantId] = useState(null);
  const [plantSearchInput, setPlantSearchInput] = useState('');
  const [plantSearchTerm, setPlantSearchTerm] = useState('');
  const [plantPageIndex, setPlantPageIndex] = useState(0);
  const [editingPlantId, setEditingPlantId] = useState(null);
  const [plantForm, setPlantForm] = useState({
    commonName: '',
    scientificName: '',
    plantType: 'HERB',
    nativeRegion: '',
    description: '',
    mainImageUrl: '',
    isActive: true,
  });

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    enabled: Boolean(token),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchAdminUsers,
    enabled: Boolean(token),
  });

  const { data: plantPage } = useQuery({
    queryKey: ['admin-plants', plantPageIndex, plantSearchTerm],
    queryFn: () => getPlants({
      page: plantPageIndex,
      size: 10,
      sort: 'RECENTLY_ADDED',
      q: plantSearchTerm || undefined,
    }),
    enabled: Boolean(token),
  });

  const plants = plantPage?.content || [];
  const plantTotalPages = plantPage?.totalPages || 0;
  const currentPageLabel = (plantPage?.number ?? 0) + 1;

  const changeRoleMutation = useMutation({
    mutationFn: changeUserRole,
    onMutate: async ({ userId, role }) => {
      setActionError('');
      setActionMessage('Updating role...');
      setRoleUpdatingUserId(userId);
      await queryClient.cancelQueries({ queryKey: ['admin-users'] });
      const previousUsers = queryClient.getQueryData(['admin-users']);
      queryClient.setQueryData(['admin-users'], (old = []) => old.map((u) => (
        u.id === userId ? { ...u, role } : u
      )));
      return { previousUsers };
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['admin-users'], context.previousUsers);
      }
      setActionError(getApiErrorMessage(error, 'Role update failed.'));
      setActionMessage('');
    },
    onSuccess: () => {
      setActionMessage('Role updated successfully.');
    },
    onSettled: () => {
      setRoleUpdatingUserId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const importMutation = useMutation({
    mutationFn: bulkImportPlants,
    onSuccess: () => {
      setActionError('');
      setActionMessage('Bulk import completed.');
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Bulk import failed.'));
      setActionMessage('');
    },
  });

  const createPlantMutation = useMutation({
    mutationFn: createPlant,
    onSuccess: () => {
      setActionError('');
      setActionMessage('Plant created successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setEditingPlantId(null);
      setPlantForm({
        commonName: '',
        scientificName: '',
        plantType: 'HERB',
        nativeRegion: '',
        description: '',
        mainImageUrl: '',
        isActive: true,
      });
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Plant creation failed.'));
      setActionMessage('');
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: updatePlant,
    onSuccess: () => {
      setActionError('');
      setActionMessage('Plant updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      setEditingPlantId(null);
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Plant update failed.'));
      setActionMessage('');
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: deletePlant,
    onMutate: (plantId) => {
      setDeletingPlantId(plantId);
      setActionError('');
      setActionMessage('Deactivating plant...');
    },
    onSuccess: () => {
      setActionMessage('Plant deactivated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-plants'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Plant deactivation failed.'));
      setActionMessage('');
    },
    onSettled: () => {
      setDeletingPlantId(null);
    },
  });

  const isGuest = !token;

  const importResult = useMemo(() => importMutation.data, [importMutation.data]);

  const handleRunImport = () => {
    setActionError('');
    setActionMessage('');
    setParseError('');
    let parsed;
    try {
      parsed = JSON.parse(payloadText);
    } catch {
      setParseError('Payload must be valid JSON.');
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError('Payload must be a JSON array of plant objects.');
      return;
    }

    importMutation.mutate(parsed);
  };

  const handleSubmitPlant = (e) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    const payload = {
      commonName: plantForm.commonName,
      scientificName: plantForm.scientificName,
      plantType: plantForm.plantType,
      nativeRegion: plantForm.nativeRegion,
      description: plantForm.description,
      mainImageUrl: plantForm.mainImageUrl,
      isActive: plantForm.isActive,
    };

    if (editingPlantId) {
      updatePlantMutation.mutate({ id: editingPlantId, payload });
      return;
    }
    createPlantMutation.mutate(payload);
  };

  const startEditPlant = (plant) => {
    setActionError('');
    setActionMessage('Editing selected plant.');
    setEditingPlantId(plant.id);
    setPlantForm({
      commonName: plant.commonName || '',
      scientificName: plant.scientificName || '',
      plantType: plant.plantType || 'HERB',
      nativeRegion: plant.nativeRegion || '',
      description: plant.description || '',
      mainImageUrl: plant.mainImageUrl || '',
      isActive: true,
    });
  };

  const cancelEditPlant = () => {
    setEditingPlantId(null);
    setActionMessage('Edit canceled.');
    setPlantForm({
      commonName: '',
      scientificName: '',
      plantType: 'HERB',
      nativeRegion: '',
      description: '',
      mainImageUrl: '',
      isActive: true,
    });
  };

  if (isGuest) {
    return (
      <main className={styles.root}>
        <h1>Admin Panel</h1>
        <p className={styles.muted}>Sign in with an admin account to access admin tools.</p>
      </main>
    );
  }

  return (
    <main className={styles.root}>
      <div className={styles.header}>
        <h1>Admin Panel</h1>
        <div className={styles.adminLinks}>
          <a href="/admin/quiz" className={styles.quizLink}>
            Manage Quiz
          </a>
          <a href="/admin/remedies" className={styles.quizLink}>
            Manage Remedies
          </a>
        </div>
      </div>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Plants</p>
          <h3 className={styles.statValue}>{stats?.plants ?? '-'}</h3>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Users</p>
          <h3 className={styles.statValue}>{stats?.users ?? '-'}</h3>
        </article>
        <article className={styles.statCard}>
          <p className={styles.statLabel}>Remedies</p>
          <h3 className={styles.statValue}>{stats?.remedies ?? '-'}</h3>
        </article>
      </section>

      {actionMessage ? <p className={styles.feedbackOk}>{actionMessage}</p> : null}
      {actionError ? <p className={styles.feedbackError}>{actionError}</p> : null}

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <h3>User Role Management</h3>
          <span className={styles.muted}>{users.length} users</span>
        </div>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => changeRoleMutation.mutate({ userId: user.id, role: e.target.value })}
                    disabled={changeRoleMutation.isPending && roleUpdatingUserId === user.id}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{user.points ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.panel}>
        <h3>Plant Bulk Import</h3>
        <p className={styles.muted}>Paste a JSON array of plant objects. Existing plants are matched by scientific name and updated.</p>
        <textarea
          className={styles.textarea}
          value={payloadText}
          onChange={(e) => setPayloadText(e.target.value)}
          spellCheck={false}
        />
        {parseError ? <p className={styles.muted}>{parseError}</p> : null}
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleRunImport} disabled={importMutation.isPending}>
            {importMutation.isPending ? 'Importing...' : 'Run Import'}
          </button>
          <button type="button" className={styles.btn} onClick={() => setPayloadText(SAMPLE_IMPORT)}>
            Reset Sample
          </button>
        </div>

        {importResult ? (
          <div className={styles.resultBox}>
            <strong>Result:</strong> total {importResult.total}, created {importResult.created}, updated {importResult.updated}, failed {importResult.failed}
            {importResult.errors?.length ? (
              <ul className={styles.errors}>
                {importResult.errors.map((err, idx) => (
                  <li key={`${idx}-${err}`}>{err}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={styles.panel}>
        <h3>Plant Management</h3>
        <div className={styles.searchRow}>
          <input
            value={plantSearchInput}
            onChange={(e) => setPlantSearchInput(e.target.value)}
            placeholder="Search by common/scientific/sanskrit name"
          />
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setPlantPageIndex(0);
              setPlantSearchTerm(plantSearchInput.trim());
            }}
          >
            Search
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setPlantSearchInput('');
              setPlantSearchTerm('');
              setPlantPageIndex(0);
            }}
          >
            Reset
          </button>
        </div>
        <form className={styles.formGrid} onSubmit={handleSubmitPlant}>
          <label>
            Common Name
            <input
              value={plantForm.commonName}
              onChange={(e) => setPlantForm((p) => ({ ...p, commonName: e.target.value }))}
              required
            />
          </label>
          <label>
            Scientific Name
            <input
              value={plantForm.scientificName}
              onChange={(e) => setPlantForm((p) => ({ ...p, scientificName: e.target.value }))}
              required
            />
          </label>
          <label>
            Plant Type
            <select
              value={plantForm.plantType}
              onChange={(e) => setPlantForm((p) => ({ ...p, plantType: e.target.value }))}
            >
              <option value="TREE">TREE</option>
              <option value="SHRUB">SHRUB</option>
              <option value="HERB">HERB</option>
              <option value="CLIMBER">CLIMBER</option>
              <option value="GRASS">GRASS</option>
            </select>
          </label>
          <label>
            Native Region
            <input
              value={plantForm.nativeRegion}
              onChange={(e) => setPlantForm((p) => ({ ...p, nativeRegion: e.target.value }))}
            />
          </label>
          <label className={styles.span2}>
            Main Image URL
            <input
              value={plantForm.mainImageUrl}
              onChange={(e) => setPlantForm((p) => ({ ...p, mainImageUrl: e.target.value }))}
            />
          </label>
          <label className={styles.span2}>
            Description
            <textarea
              value={plantForm.description}
              onChange={(e) => setPlantForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
            />
          </label>
          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={plantForm.isActive}
              onChange={(e) => setPlantForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Active
          </label>
          <div className={`${styles.actions} ${styles.span2}`}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={createPlantMutation.isPending || updatePlantMutation.isPending}>
              {editingPlantId ? 'Update Plant' : 'Create Plant'}
            </button>
            {editingPlantId ? (
              <button type="button" className={styles.btn} onClick={cancelEditPlant}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Scientific</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id}>
                <td>{plant.commonName}</td>
                <td>{plant.scientificName}</td>
                <td>{plant.plantType || '-'}</td>
                <td>
                  <div className={styles.actions}>
                    <button type="button" className={styles.btn} onClick={() => startEditPlant(plant)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={() => deletePlantMutation.mutate(plant.id)}
                      disabled={deletePlantMutation.isPending && deletingPlantId === plant.id}
                    >
                      {deletePlantMutation.isPending && deletingPlantId === plant.id ? 'Deactivating...' : 'Deactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.paginationRow}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setPlantPageIndex((p) => Math.max(0, p - 1))}
            disabled={plantPageIndex <= 0}
          >
            Previous
          </button>
          <span className={styles.muted}>
            Page {currentPageLabel}{plantTotalPages ? ` of ${plantTotalPages}` : ''}
          </span>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setPlantPageIndex((p) => p + 1)}
            disabled={plantTotalPages > 0 ? plantPageIndex >= plantTotalPages - 1 : true}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
