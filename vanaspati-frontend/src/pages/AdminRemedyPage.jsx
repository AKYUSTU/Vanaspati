import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRemedy, deleteRemedy, fetchAllRemedies, updateRemedy } from '../api/remedy';
import { getApiErrorMessage } from '../api/errors';
import styles from './AdminRemedyPage.module.css';

const emptyForm = {
  name: '',
  forAilment: '',
  difficulty: 'BEGINNER',
  prepTimeMinutes: 10,
  description: '',
  precautions: '',
  ingredients: [{ ingredientName: '', quantity: '', notes: '' }],
  steps: [{ stepNumber: 1, instruction: '' }],
};

export default function AdminRemedyPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data: remedies = [] } = useQuery({
    queryKey: ['admin-remedies'],
    queryFn: fetchAllRemedies,
  });

  const createMutation = useMutation({
    mutationFn: createRemedy,
    onSuccess: () => {
      setMessage('Remedy created successfully');
      setError('');
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-remedies'] });
    },
    onError: (err) => {
      setError(getApiErrorMessage(err, 'Failed to create remedy'));
      setMessage('');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateRemedy(id, payload),
    onSuccess: () => {
      setMessage('Remedy updated successfully');
      setError('');
      setEditingId(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ['admin-remedies'] });
    },
    onError: (err) => {
      setError(getApiErrorMessage(err, 'Failed to update remedy'));
      setMessage('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRemedy,
    onSuccess: () => {
      setMessage('Remedy deleted successfully');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['admin-remedies'] });
    },
    onError: (err) => {
      setError(getApiErrorMessage(err, 'Failed to delete remedy'));
      setMessage('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      setError('Name and description are required');
      return;
    }

    const payload = {
      ...form,
      ingredients: form.ingredients.filter((i) => i.ingredientName.trim()),
      steps: form.steps.filter((s) => s.instruction.trim()),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = async (id) => {
    const remedy = await import('../api/remedy').then((m) => m.fetchRemedyById(id));
    setEditingId(remedy.id);
    setForm({
      name: remedy.name || '',
      forAilment: remedy.forAilment || '',
      difficulty: remedy.difficulty || 'BEGINNER',
      prepTimeMinutes: remedy.prepTimeMinutes || 10,
      description: remedy.description || '',
      precautions: remedy.precautions || '',
      ingredients: remedy.ingredients?.length
        ? remedy.ingredients.map((i) => ({ ingredientName: i.ingredientName || '', quantity: i.quantity || '', notes: i.notes || '' }))
        : [{ ingredientName: '', quantity: '', notes: '' }],
      steps: remedy.steps?.length
        ? remedy.steps.map((s, idx) => ({ stepNumber: s.stepNumber || idx + 1, instruction: s.instruction || '' }))
        : [{ stepNumber: 1, instruction: '' }],
    });
  };

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientName: '', quantity: '', notes: '' }],
    }));
  };

  const updateIngredient = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (index) => {
    if (form.ingredients.length === 1) return;
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { stepNumber: prev.steps.length + 1, instruction: '' }],
    }));
  };

  const updateStep = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
    }));
  };

  const removeStep = (index) => {
    if (form.steps.length === 1) return;
    setForm((prev) => {
      const newSteps = prev.steps.filter((_, i) => i !== index);
      return {
        ...prev,
        steps: newSteps.map((s, i) => ({ ...s, stepNumber: i + 1 })),
      };
    });
  };

  return (
    <main className={styles.container}>
      <h1>Admin Remedy Management</h1>

      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2>{editingId ? 'Edit Remedy' : 'Create Remedy'}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Remedy Name
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </label>

            <label>
              For Ailment
              <input value={form.forAilment} onChange={(e) => setForm((p) => ({ ...p, forAilment: e.target.value }))} />
            </label>

            <div className={styles.row}>
              <label>
                Difficulty
                <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))}>
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="INTERMEDIATE">INTERMEDIATE</option>
                  <option value="ADVANCED">ADVANCED</option>
                </select>
              </label>

              <label>
                Prep Time (min)
                <input
                  type="number"
                  value={form.prepTimeMinutes}
                  onChange={(e) => setForm((p) => ({ ...p, prepTimeMinutes: Number(e.target.value) || 0 }))}
                />
              </label>
            </div>

            <label>
              Description
              <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            </label>

            <label>
              Precautions
              <textarea rows={3} value={form.precautions} onChange={(e) => setForm((p) => ({ ...p, precautions: e.target.value }))} />
            </label>

            <div className={styles.sectionHeader}>
              <h3>Ingredients</h3>
              <button type="button" onClick={addIngredient}>+ Add Ingredient</button>
            </div>
            {form.ingredients.map((ing, index) => (
              <div key={`ing-${index}`} className={styles.nestedBlock}>
                <div className={styles.row}>
                  <input
                    placeholder="Ingredient"
                    value={ing.ingredientName}
                    onChange={(e) => updateIngredient(index, 'ingredientName', e.target.value)}
                  />
                  <input
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  />
                </div>
                <div className={styles.row}>
                  <input
                    placeholder="Notes"
                    value={ing.notes}
                    onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                  />
                  <button type="button" onClick={() => removeIngredient(index)} disabled={form.ingredients.length === 1}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.sectionHeader}>
              <h3>Steps</h3>
              <button type="button" onClick={addStep}>+ Add Step</button>
            </div>
            {form.steps.map((step, index) => (
              <div key={`step-${index}`} className={styles.nestedBlock}>
                <div className={styles.row}>
                  <input
                    type="number"
                    min="1"
                    value={step.stepNumber}
                    onChange={(e) => updateStep(index, 'stepNumber', Number(e.target.value) || 1)}
                  />
                  <input
                    placeholder="Instruction"
                    value={step.instruction}
                    onChange={(e) => updateStep(index, 'instruction', e.target.value)}
                  />
                  <button type="button" onClick={() => removeStep(index)} disabled={form.steps.length === 1}>
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.row}>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update Remedy' : 'Create Remedy'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <h2>Existing Remedies ({remedies.length})</h2>
          <div className={styles.list}>
            {remedies.map((remedy) => (
              <article key={remedy.id} className={styles.card}>
                <h3>{remedy.name}</h3>
                <p>{remedy.forAilment || 'General wellness'}</p>
                <p>{remedy.difficulty} • {remedy.prepTimeMinutes || 0} min</p>
                <div className={styles.row}>
                  <button type="button" onClick={() => startEdit(remedy.id)}>Edit</button>
                  <button type="button" onClick={() => deleteMutation.mutate(remedy.id)} disabled={deleteMutation.isPending}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
