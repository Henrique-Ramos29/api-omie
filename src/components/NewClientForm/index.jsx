import { useState } from 'react';
import { incluirCliente } from '../../services/omieApi.js';
import styles from './NewClientForm.module.css';

function NewClientForm({ onClientAdded }) {
  const [formData, setFormData] = useState({ nome: '', documento: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Atualiza o estado do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lida com a submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.documento) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await incluirCliente(formData);
      alert("Cliente cadastrado com sucesso!"); // Feedback para o usuário
      setFormData({ nome: '', documento: '' }); // Limpa o formulário
      
      // Avisa o componente pai (App.jsx) que um novo cliente foi adicionado
      if (onClientAdded) {
        onClientAdded();
      }
    } catch (err) {
      // Extrai a mensagem de erro da API ou usa uma mensagem padrão
      const errorMessage = err.message || 'Ocorreu um erro ao cadastrar o cliente.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className={styles.formContainer}>
      <h3 className={styles.formTitle}>Cadastro Rápido</h3>
      <form onSubmit={handleSubmit}>
        {/* Campo Nome / Razão Social */}
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome / Razão Social</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: Empresa de Teste LTDA"
            disabled={isSubmitting}
          />
        </div>

        {/* Campo CNPJ / CPF */}
        <div className={styles.formGroup}>
          <label htmlFor="documento">CNPJ / CPF</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            placeholder="Digite o documento (apenas números)"
            disabled={isSubmitting}
          />
        </div>

        {/* Exibição de Erro */}
        {error && (
          <div className={styles.errorBox}>{error}</div>
        )}

        {/* Botão de Submissão */}
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Cliente'}
        </button>
      </form>
    </aside>
  );
}

export default NewClientForm;
