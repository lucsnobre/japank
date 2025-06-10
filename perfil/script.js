document.addEventListener('DOMContentLoaded', function() {
  // Manipulação da foto de perfil
  const photoInput = document.getElementById('photo-input');
  const profilePhoto = document.getElementById('profile-photo');
  const changePhotoBtn = document.querySelector('.change-photo-btn');

  // Função para atualizar a foto no servidor
  async function uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da foto');
      }

      const data = await response.json();
      return data.photoUrl;
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    }
  }

  photoInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
      // Verifica o tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem válida.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      // Mostra preview imediato
      const reader = new FileReader();
      reader.onload = function(e) {
        profilePhoto.src = e.target.result;
      }
      reader.readAsDataURL(file);

      // Tenta fazer upload
      try {
        const photoUrl = await uploadProfilePhoto(file);
        if (photoUrl) {
          // Atualiza a foto com a URL do servidor
          profilePhoto.src = photoUrl;
        }
      } catch (error) {
        console.error('Erro no upload:', error);
      }
    }
  });

  // Botão de editar dados
  const editDataBtn = document.querySelector('.edit-data-btn');
  const dataValues = document.querySelectorAll('.data-value');
  let isEditing = false;

  // Função para atualizar os dados no servidor
  async function updateUserData(data) {
    try {
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }

  editDataBtn.addEventListener('click', async function() {
    if (!isEditing) {
      // Entrar no modo de edição
      dataValues.forEach(value => {
        const currentValue = value.textContent;
        value.innerHTML = `<input type="text" class="edit-input" value="${currentValue}">`;
      });
      editDataBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
      isEditing = true;
    } else {
      try {
        // Coleta os novos valores
        const newValues = {};
        dataValues.forEach((value, index) => {
          const input = value.querySelector('.edit-input');
          const fieldName = ['nome', 'email', 'telefone'][index];
          newValues[fieldName] = input.value;
        });

        // Tenta salvar no servidor
        await updateUserData(newValues);

        // Atualiza a interface
        dataValues.forEach((value, index) => {
          const input = value.querySelector('.edit-input');
          value.textContent = input.value;
        });
        editDataBtn.innerHTML = '<i class="fas fa-edit"></i> Editar Dados';
        isEditing = false;

        // Feedback visual
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Dados atualizados com sucesso!';
        document.querySelector('.account-section').prepend(successMessage);
        setTimeout(() => successMessage.remove(), 3000);

      } catch (error) {
        alert('Erro ao salvar as alterações. Tente novamente.');
        console.error('Erro:', error);
      }
    }
  });

  // Adiciona estilo para mensagem de sucesso
  const style = document.createElement('style');
  style.textContent = `
    .success-message {
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      text-align: center;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // Botão de Meus Eventos
  const eventosBtn = document.querySelector('.action-btn:first-child');
  eventosBtn.addEventListener('click', function() {
    // Aqui você pode adicionar o código para redirecionar para a página de eventos
    // window.location.href = '/meus-eventos';
    console.log('Redirecionando para Meus Eventos');
  });

  // Botão de Meus Ingressos
  const ingressosBtn = document.querySelector('.action-btn:last-child');
  ingressosBtn.addEventListener('click', function() {
    // Aqui você pode adicionar o código para redirecionar para a página de ingressos
    // window.location.href = '/meus-ingressos';
    console.log('Redirecionando para Meus Ingressos');
  });
}); 