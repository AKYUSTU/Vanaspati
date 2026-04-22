import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuestion, deleteQuestion, fetchQuizQuestions, updateQuestion } from '../api/quiz';
import { getApiErrorMessage } from '../api/errors';
import styles from './AdminQuizPage.module.css';

export default function AdminQuizPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    doshaA: '',
    optionB: '',
    doshaB: '',
    optionC: '',
    doshaC: '',
    displayOrder: 0,
  });
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const { data: questions = [] } = useQuery(['quiz-questions'], fetchQuizQuestions);

  const createMutation = useMutation({
    mutationFn: (payload) => createQuestion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz-questions']);
      setFormData({
        questionText: '',
        optionA: '',
        doshaA: '',
        optionB: '',
        doshaB: '',
        optionC: '',
        doshaC: '',
        displayOrder: 0,
      });
      setActionMessage('Question created successfully');
      setTimeout(() => setActionMessage(''), 3000);
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Failed to create question'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateQuestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz-questions']);
      setFormData({
        questionText: '',
        optionA: '',
        doshaA: '',
        optionB: '',
        doshaB: '',
        optionC: '',
        doshaC: '',
        displayOrder: 0,
      });
      setEditingId(null);
      setActionMessage('Question updated successfully');
      setTimeout(() => setActionMessage(''), 3000);
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Failed to update question'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['quiz-questions']);
      setActionMessage('Question deleted successfully');
      setTimeout(() => setActionMessage(''), 3000);
    },
    onError: (error) => {
      setActionError(getApiErrorMessage(error, 'Failed to delete question'));
    },
  });

  const handleEdit = (question) => {
    setEditingId(question.id);
    setFormData({
      questionText: question.questionText,
      optionA: question.optionA,
      doshaA: question.doshaA,
      optionB: question.optionB,
      doshaB: question.doshaB,
      optionC: question.optionC,
      doshaC: question.doshaC,
      displayOrder: question.displayOrder,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.questionText.trim()) {
      setActionError('Question text is required');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      questionText: '',
      optionA: '',
      doshaA: '',
      optionB: '',
      doshaB: '',
      optionC: '',
      doshaC: '',
      displayOrder: 0,
    });
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Quiz Management</h1>

      {actionMessage && <div className={styles.successBanner}>{actionMessage}</div>}
      {actionError && <div className={styles.errorBanner}>{actionError}</div>}

      <div className={styles.mainGrid}>
        <div className={styles.formSection}>
          <h2>{editingId ? 'Edit Question' : 'Add New Question'}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Question Text *</label>
              <textarea
                value={formData.questionText}
                onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                placeholder="Enter quiz question"
                rows={3}
              />
            </div>

            {['A', 'B', 'C'].map((letter) => (
              <div key={letter} className={styles.optionGroup}>
                <h3>Option {letter}</h3>
                <div className={styles.formGroup}>
                  <label>Option Text *</label>
                  <input
                    type="text"
                    value={formData[`option${letter}`]}
                    onChange={(e) => setFormData({ ...formData, [`option${letter}`]: e.target.value })}
                    placeholder={`Enter option ${letter}`}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Associated Dosha</label>
                  <select
                    value={formData[`dosha${letter}`] || ''}
                    onChange={(e) => setFormData({ ...formData, [`dosha${letter}`]: e.target.value })}
                  >
                    <option value="">Select Dosha...</option>
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                  </select>
                </div>
              </div>
            ))}

            <div className={styles.formGroup}>
              <label>Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Update Question' : 'Add Question'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className={styles.listSection}>
          <h2>Questions ({questions.length})</h2>
          <div className={styles.questionsList}>
            {questions.length === 0 ? (
              <p>No questions added yet</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <h4>{q.questionText}</h4>
                    <span className={styles.questionId}>ID: {q.id}</span>
                  </div>
                  <div className={styles.optionsPreview}>
                    {['A', 'B', 'C'].map((letter) => (
                      <div key={letter} className={styles.optionPreview}>
                        <strong>{letter}:</strong> {q[`option${letter}`]}
                        {q[`dosha${letter}`] && (
                          <span className={styles.doshaLabel}>{q[`dosha${letter}`]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => handleEdit(q)} className={styles.editBtn}>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(q.id)}
                      className={styles.deleteBtn}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
