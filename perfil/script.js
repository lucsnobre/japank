import { putUsuario } from "../../fetch/usuario.js";

function preencherDados() {
  const nickname = document.getElementById('nickname');
  const email = document.getElementById('email');
  const senha = document.getElementById('senha');
  const nome_completo = document.getElementById('nome-completo');
  const cpf = document.getElementById('cpf');
  const telefone = document.getElementById('telefone');
  const profileImage = document.getElementById('profileImage');


  const userData = JSON.parse(localStorage.getItem('usuario'));

  if (!userData) {
    console.warn('Nenhum dado de usuário encontrado no localStorage.');
    return;
  }

  // Preenchendo os campos
  nickname.value = userData.nickname || '';
  email.value = userData.email || '';
  senha.value = userData.senha || '';
  nome_completo.value = userData.nome || '';
  cpf.value = userData.cpf || '';
  telefone.value = userData.numero || '';

  if (userData.foto_perfil) {
    profileImage.src = userData.foto_perfil;
  }

  console.log('Dados preenchidos:', userData);
}

let mudou = false
async function triggerAtualizar() {
  const botaoSalvar = document.getElementById('salvar');

  botaoSalvar.addEventListener('click', async () => {
    // Pega os valores no momento do clique
    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const nome_completo = document.getElementById('nome-completo').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;

    const userData = JSON.parse(localStorage.getItem('usuario'));

    let profileImage

    if(mudou){
      profileImage = await enviarImagem(document.getElementById('fileUpload').files[0])
    }else{
      profileImage = JSON.parse(localStorage.getItem('usuario')).foto_perfil
    }

    // Monta o JSON para atualizar
    const usuarioJSON = {
      email: email,
      senha: senha,
      cpf: cpf,
      nome: nome_completo,
      nickname: nickname,
      numero: telefone,
      foto_perfil: profileImage,
      id: userData.id
    };


    // Chama a função que faz o PUT
    const result = await putUsuario(usuarioJSON);

    if (result.status_code == 200) {
      alert('Dados atualizados com sucesso!');

      // Atualiza o localStorage com os dados novos
      localStorage.setItem('usuario', JSON.stringify(usuarioJSON));
    } else if (result.status_code == 400) {
      alert('Preencha os campos necessários: E-mail, Senha, Nome e Nickname');
    } else {
      alert('Ocorreu algum erro inesperado. Tente novamente.');
    }
  });
}

async function triggerSair(){

    const botaoSair = document.getElementById('sair')
    const botaoVoltar = document.getElementById('voltar')

    botaoSair.addEventListener('click', ()=> {

        let usuario = JSON.parse(localStorage.getItem('usuario'))

        usuario = ''
        
        localStorage.setItem('usuario', JSON.stringify(usuario))

        window.location.href = '../../index.html'
    })

    botaoVoltar.addEventListener('click', () => {

      window.location.href = '../../index.html'
    })

}

async function enviarImagem(file) {

  // Verifica se o arquivo é vazio
  if (!file) {
    return;
  }

  const storageAccount = 'uploadsenai2025';
  const containerName = 'planify-senai';
  const sasToken = 'sp=racwl&st=2025-06-17T02:20:47Z&se=2025-06-17T20:30:00Z&sv=2024-11-04&sr=c&sig=Gc0ve8hRhv9qDa1j%2F6s4C8R75UhGyqMbBvswFk%2B3Iyk%3D';

  const blobName = `${Date.now()}-${file.name}`;
  const baseUrl = `https://${storageAccount}.blob.core.windows.net/${containerName}/${blobName}`;
  const uploadUrl = `${baseUrl}?${sasToken}`;

  const options = {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.type || "application/octet-stream"
    },
    body: file
  };

  const response = await fetch(uploadUrl, options);

  if (response.ok) {
    // Marca o arquivo como enviado

    const url = encodeURI(baseUrl);
    console.log("URL da imagem:", url);
    return url;
  } else {
    alert("Erro ao enviar.");
    console.error("Erro:", await response.text());
    return;
  }
}

async function triggerUpload(){

    const input = document.getElementById('fileUpload')
    const imagemUser = document.getElementById('profileImage')

    imagemUser.addEventListener('click', async () => {

        input.click()

    })

    input.addEventListener('change', async () => {

        if(input.files[0]){

          mudou = true
          

            imagemUser.classList.remove('hidden')

            const reader = new FileReader();
            reader.onload = function(e){
                
            imagemUser.src = e.target.result
            }

            reader.readAsDataURL(input.files[0]); // << ISSO É ESSENCIAL
        }


    })

}

document.addEventListener('DOMContentLoaded', async() => {

  let usuario = JSON.parse(localStorage.getItem('usuario'))

  if(!usuario){
    window.location.href = '../../index.html'
  }

    preencherDados()
    await triggerUpload()
    await triggerAtualizar()
    await triggerSair()

})