import { useState, useEffect } from 'react';
import styles from './NewClientForm.module.css';

// O formulário agora recebe onSave, editingClient e onCancel do App.jsx
function NewClientForm({ onSave, editingClient, onCancel }) {
  const [formData, setFormData] = useState({ 
    nome_fantasia: '', 
    cnpj_cpf: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // 1. Determina se o formulário está em modo de edição
  const isEditing = !!editingClient;

  // 2. Efeito que preenche ou limpa o formulário com base no modo
  useEffect(() => {
    if (isEditing) {
      // Se está editando, preenche o formulário com os dados do cliente
      setFormData({
        nome_fantasia: editingClient.nome_fantasia || '',
        cnpj_cpf: editingClient.cnpj_cpf || '',
        email: editingClient.email || ''
      });
      setFeedback({ type: '', message: '' }); // Limpa feedbacks antigos
    } else {
      // Se não está editando (novo cadastro ou cancelamento), limpa o formulário
      setFormData({ nome_fantasia: '', cnpj_cpf: '', email: '' });
    }
  }, [editingClient, isEditing]); // Roda sempre que o cliente em edição mudar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome_fantasia || !formData.cnpj_cpf) {
      setFeedback({ type: 'error', message: 'Por favor, preencha Nome Fantasia e CNPJ/CPF.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    // 3. Chama a função onSave (que agora é inteligente no App.jsx)
    const result = await onSave(formData);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      // O App.jsx vai limpar o estado de edição, e o useEffect vai limpar o formulário
    } else {
      setFeedback({ type: 'error', message: `Falha: ${result.message}` }); 
    }

    setIsSubmitting(false);
  };

  return (
    <aside className={styles.formContainer}>
      {/* 4. Título dinâmico */}
      <h3 className={styles.formTitle}>{isEditing ? 'Editar Cliente' : 'Cadastro Rápido de Cliente'}</h3>
      <form onSubmit={handleSubmit} noValidate>
        {/* Inputs (nenhuma mudança aqui) */}
        <div className={styles.formGroup}>
          <label htmlFor="nome_fantasia">Nome Fantasia</label>
          <input id="nome_fantasia" name="nome_fantasia" value={formData.nome_fantasia} onChange={handleChange} disabled={isSubmitting} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cnpj_cpf">CNPJ / CPF</label>
          <input id="cnpj_cpf" name="cnpj_cpf" value={formData.cnpj_cpf} onChange={handleChange} disabled={isSubmitting} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
        </div>

        {feedback.message && (
          <div className={feedback.type === 'success' ? styles.successBox : styles.errorBox}>
            {feedback.message}
          </div>
        )}
        
        {/* 5. Botões dinâmicos */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? (isEditing ? 'Salvando...' : 'Cadastrando...') : (isEditing ? 'Salvar Alterações' : 'Cadastrar Cliente')}
          </button>
          {isEditing && (
            <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </aside>
  );
}

export default NewClientForm;
