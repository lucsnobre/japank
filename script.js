'use strict'

import { getCategoria } from "./fetch/categoria.js"
import {  getUsuario, getUsuarios, postUsuario, deleteUsuario, putUsuario, logarUsuario, mudarSenha } from "./fetch/usuario.js"
import { getEventos, filtrarEventos, getEvento, filtroByNome } from "./fetch/evento.js"
import { getCidades } from "./fetch/cidade.js"
import { getEstados } from "./fetch/estado.js"
import { postIngresso, selectIngressosByUser } from "./fetch/ingresso.js"
import { postRecSenhaEmail, searchCodigo } from "./fetch/recSenha.js"


document.getElementById('userPfp').addEventListener('click', async() => {

  window.location.href = './telas/perfil/index.html'
})

//Funções pra requisitar os bglh
document.getElementById('form-cadastro').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value.trim()
    const senha = document.getElementById('senha').value.trim()
    const nome = document.getElementById('nome').value.trim()
    const nickname = document.getElementById('nickname').value.trim()

    const novoUsuario = {
        email: email,
        senha: senha,
        nome: nome,
        nickname: nickname
    }

    try {
        const resultado = await postUsuario(novoUsuario)
        console.log('Usuário cadastrado:', resultado)
        
        // Armazenar dados do usuário
        if (resultado.token) {
            localStorage.setItem('token', resultado.token)
            localStorage.setItem('userData', JSON.stringify(resultado))
            
            // Alternar entre os headers
            document.querySelector('.top-bar:not(.logged-in)').style.display = 'none'
            document.getElementById('header-logged-in').style.display = 'flex'
            
            // Atualizar foto do perfil se disponível
            if (resultado.fotoPerfil) {
                document.getElementById('user-profile-img').src = resultado.fotoPerfil
            }
        }

        alert('Cadastro realizado com sucesso!')

        // Fecha o modal e limpa o formulário
        document.getElementById('cadastro-overlay').classList.add('hidden')
        document.getElementById('form-cadastro').reset()
        
    } catch (error) {
        console.error('Erro ao cadastrar:', error)
        alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.')
    }
})


//Cadastro Pop-up

const abrirCadastroBtn = document.querySelector('#botaoCadastrar')
const fecharCadastroBtn = document.querySelector('#fecharCadastro')
const overlayCadastro = document.querySelector('#cadastro-overlay')

abrirCadastroBtn.addEventListener('click', () => {
    overlayCadastro.classList.remove('hidden')
})

fecharCadastroBtn.addEventListener('click', () => {
    overlayCadastro.classList.add('hidden')
})

// Fechar ao clicar fora do modal
overlayCadastro.addEventListener('click', (cadastro) => {
    if (cadastro.target === overlayCadastro) {
        overlayCadastro.classList.add('hidden')
    }
})

// ==== POP UP DE LOGIN ====

// Pop-up de Login
const abrirLoginBtn = document.querySelector('.btn.entrar')
const fecharLoginBtn = document.getElementById('fecharLogin')
const overlayLogin = document.getElementById('login-overlay')

// Abrir login
abrirLoginBtn.addEventListener('click', () => {
    overlayLogin.classList.remove('hidden')
})

// Fechar login
fecharLoginBtn.addEventListener('click', () => {
    overlayLogin.classList.add('hidden')
})

// Fechar ao clicar fora do modal
overlayLogin.addEventListener('click', (event) => {
    if (event.target === overlayLogin) {
        overlayLogin.classList.add('hidden')
    }
})

// Link para abrir o cadastro via login
document.getElementById('abrirCadastroViaLogin').addEventListener('click', (event) => {
    event.preventDefault()
    overlayLogin.classList.add('hidden')
    document.getElementById('cadastro-overlay').classList.remove('hidden')
})

document.getElementById('form-login').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('login-email').value.trim()
    const senha = document.getElementById('login-senha').value.trim()
        
    const dataUser = await logarUsuario(email, senha)
    console.log('Login realizado:', dataUser)

    if(dataUser.status_code == 200){

        console.log(dataUser)
        
        localStorage.setItem('usuario', JSON.stringify(dataUser.usuario[0])) // pega o json e transforma em string

        console.log(dataUser.usuario[0].id)

        console.log(`Token:`, JSON.parse(localStorage.getItem('usuario'))) // pega a string e transforma em json

        overlayLogin.classList.add('hidden')
        overlayLogin.classList.add('hidden')

        document.getElementById('form-login').reset()
        alert('Login realizado com sucesso!')

        logandoUser()


    }else if(dataUser.status_code == 400){

        alert('Todos os campos precisam ser preenchidos!')

    }else if(dataUser.status_code == 404){

        alert('E-mail e/ou senha incorretos.')

    }


})

//Função para adicionar atributos do usuário na tela
async function logandoUser(){

  const authButtons = document.getElementById('authbuttons')
  const userActions = document.getElementById('useraction')
  const imagemUser = document.getElementById('user-profile-img')
  const usuarioJSON = JSON.parse(localStorage.getItem('usuario'))


  if(usuarioJSON){

    console.log(usuarioJSON.foto_perfil)
    console.log(imagemUser.src)

    imagemUser.src = usuarioJSON.foto_perfil

    authButtons.classList.add('hidden')
    userActions.classList.remove('hidden')

  }else{
    console.log('Sem user cadastrado')

    imagemUser.src = './img/user.png'

    authButtons.classList.remove('hidden')
    userActions.classList.add('hidden')
  }

}

document.getElementById('irEsquecerSenha').addEventListener('click', async(event) => {

  document.getElementById('login-overlay').classList.add('hidden')

  document.getElementById('recuperacao-overlay').classList.remove('hidden')

  await initRecuperacaoSenha()

})

async function initRecuperacaoSenha(){

  const inputEmail = document.getElementById('recuperar-email')
  const botao = document.getElementById('botao-recuperar-senha')

  const inputCodigo = document.getElementById('codigo-verificacao')
  const botaoCodigo = document.getElementById('botaoCodigo')

  const inputNovaSenha = document.getElementById('nova-senha')
  const botaoNovaSenha = document.getElementById('botaoNovaSenha')

  document.getElementById('closeNovaSenha').addEventListener('click', () => {

    document.getElementById('nova-senha-overlay').classList.add('hidden')

  })

  document.getElementById('fecharRecuperacao').addEventListener('click', () => {

    document.getElementById('recuperacao-overlay').classList.add('hidden')

  })

  document.getElementById('fecharVerificacao').addEventListener('click', () => {

    document.getElementById('verificacao-overlay').classList.add('hidden')
  })

  document.getElementById('voltarLogin').addEventListener('click', () => {

    document.getElementById('verificacao-overlay').classList.add('hidden')
    document.getElementById('login-overlay').classList.remove('hidden')

  })
  let idUser

  inputNovaSenha.addEventListener('keydown', async(e) => {

    if(e.key === 'Enter'){

      const result = await mudarSenha(inputNovaSenha.value)

      console.log(result)

      
      if(result.status_code == 200){

        document.getElementById('nova-senha-overlay').classList.add('hidden')
        alert('Senha atualizada com sucesso!')
      }else if(result.status_code == 400){

        alert('Preencha uma nova senha!')
      }else{

        alert('Tente novamente.')
      }

      inputNovaSenha.value = ''

    }

  })

  botaoNovaSenha.addEventListener('click', async(e) => {

    const result = await mudarSenha(inputNovaSenha.value, idUser)

    if(result.status_code == 200){

      document.getElementById('nova-senha-overlay').classList.add('hidden')
              alert('Senha atualizada com sucesso!')
    }else if(result.status_code == 400){

      alert('Preencha uma nova senha!')
    }else{

      alert('Tente novamente.')
    }

    console.log(result)


  })

  inputCodigo.addEventListener('keydown', async(e) => {


    if(e.key === 'Enter'){

      const result = await searchCodigo(inputCodigo.value)

      if(result.status){

        alert('Código correto!');

        idUser = result.id_usuario

        
        
       document.getElementById('verificacao-overlay').classList.add('hidden')
       document.getElementById('nova-senha-overlay').classList.remove('hidden')

       inputCodigo.value = ''

      }else{
        alert('Código errado!');
      }

    }

  })

  botaoCodigo.addEventListener('click', async() => {

    const result = await searchCodigo(inputCodigo.value)

      if(result.status){

       alert('Código correto!');

         idUser = result.id_usuario
        
       document.getElementById('verificacao-overlay').classList.add('hidden')
      document.getElementById('nova-senha-overlay').classList.remove('hidden')

      }else{
         alert('Código errado!');
      }

  })

  inputEmail.addEventListener('keydown', async(event) => {

     if (event.key === 'Enter') {
      
      console.log(inputEmail.value)

       document.getElementById('verificacao-overlay').classList.remove('hidden')


      mostrarEnviando()
      
      document.getElementById('recuperacao-overlay').classList.add('hidden')

      botaoCodigo.disabled = true

      const result = await postRecSenhaEmail(inputEmail.value)

      inputEmail.value = ''

      if(result.status_code == 200){
        esconderEnviando()
        botaoCodigo.disabled = false
      }else{
        esconderEnviando2()
      }

      
    }
    
  })

  botao.addEventListener('click', async(event) => {

      console.log(inputEmail.value)

      document.getElementById('recuperacao-overlay').classList.add('hidden')

       botaoCodigo.disabled = true

      mostrarEnviando()


       document.getElementById('verificacao-overlay').classList.remove('hidden')

      const result = await postRecSenhaEmail(inputEmail.value)

    if(result.status_code == 200){
      esconderEnviando()
      botaoCodigo.disabled = false
    }else{
      esconderEnviando2()
    }

  })




}

//Redirecionar da tela de cadastrto pra de login
// Link para abrir o login via cadastro
document.getElementById('abrirLoginViaCadastro').addEventListener('click', (event) => {
    event.preventDefault()
    overlayCadastro.classList.add('hidden')
    overlayLogin.classList.remove('hidden')
})

//Favorito
// document.querySelectorAll('.btn-curtir').forEach(button => {
//     button.addEventListener('click', function () {
//         const heart = this.querySelector('./img/love path');
//         const isFilled = heart.getAttribute('fill') === '#e74c3c';

//         if (isFilled) {
//             heart.setAttribute('fill', 'none');
//             heart.setAttribute('stroke', '#888');
//         } else {
//             heart.setAttribute('fill', '#e74c3c');
//             heart.setAttribute('stroke', '#e74c3c');
//         }
//     });
// });

// coisa relacionada a usuario

// // Adicionar evento de clique na foto do perfil
// document.getElementById('user-profile-img').addEventListener('click', function() {
//     window.location.href = '/perfil/index.html'
// })

// // Adicionar evento de clique no botão de criar evento
// document.querySelector('.btn.criar-evento').addEventListener('click', function() {
//     // Aqui você pode adicionar a lógica para criar um evento
//     // Por exemplo, redirecionar para uma página de criação de evento
//     window.location.href = '/criar-evento/index.html'
// })

// // Verificar se o usuário já está logado ao carregar a página
// document.addEventListener('DOMContentLoaded', function() {
//     const token = localStorage.getItem('token')
//     const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    
//     if (token) {
//         document.querySelector('.top-bar:not(.logged-in)').style.display = 'none'
//         document.getElementById('header-logged-in').style.display = 'flex'
        
//         if (userData.fotoPerfil) {
//             document.getElementById('user-profile-img').src = userData.fotoPerfil
//         }
//     }
// })

// --- Carregar eventos dinamicamente ---
async function carregarEventos(response) {
  const container = document.querySelector('.eventos-container');
  if (!container) return;
  container.innerHTML = '<p style="color:#fff">Carregando eventos...</p>';

    console.log(response)

  try {

    if (response.status_code == 404) {
      container.innerHTML = '<p style="color:black">Nenhum evento encontrado.</p>';
      return;
    }

    const eventos = response.eventos
    
    container.innerHTML = '';
    eventos.forEach(evento => {




        if(evento.id == 1){
                    console.log(`EXEMPLO EVENTO 1: DATA = ${evento.data}`)
        }

        const [ano, mes, dia] = evento.data.split(/[-\/]/)

        evento.data = `${dia}/${mes}/${ano}`

      container.innerHTML += `
        <div class="evento-card" data-id="${evento.id}">
          <button class="btn-curtir" title="Salvar evento">
            <img class="icone-curtir-img" src="./img/coracao.png" alt="Curtir">
          </button>
          <img class="evento-img" src="${evento.capa || './img/Rectangle.png'}" alt="Imagem do Evento">
          <div class="evento-info">
            <h3>${evento.nome || ''}</h3>
            <p>${evento.data ? evento.data : ''}${evento.cidade ? ' - ' + extrairNome(evento.cidade) : ''}</p>
            ${evento.descricao ? `<p style='font-size:0.95em;color:#444;margin-top:6px;'>${evento.descricao}</p>` : ''}
            ${evento.endereco ? `<p style='font-size:0.92em;color:#666;margin-top:2px;'></p>` : ''}
            ${evento.preco ? `<p style='font-size:1em;color:#b4580f;margin-top:2px;'>R$ ${evento.preco}</p>` : ''}
          </div>
          <div class="evento-arrow">
            <img src="./img/seta_direita.png" alt="Ver mais">
          </div>
        </div>
      `;
    });

    await triggerEventos()
  } catch (err) {
    console.error('Erro ao carregar eventos:', err);
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #fff;">
        <p style="margin-bottom: 10px;">Não foi possível carregar os eventos.</p>
        <p style="font-size: 0.9em; color: #ccc;">O servidor pode estar indisponível no momento.</p>
        <button onclick="carregarEventos()" style="margin-top: 15px; padding: 8px 16px; background: #FF7100; border: none; border-radius: 4px; color: white; cursor: pointer;">
          Tentar novamente
        </button>
      </div>
    `;
  }
}

async function carregarEvento(id){

    const evento = await getEvento(id)

    const dadosEvento = evento.eventos[0]

    const cardEvento = document.getElementById('overlay-evento')

    let dadosEndereco = dadosEvento.endereco[0]

    document.getElementById('botaoFechar').addEventListener('click', function(event){

        cardEvento.classList.add('hidden')
    })


    if(evento.status_code == 200){

        const nomeEvento = document.getElementById('eventoNome')
        const capaEvento = document.getElementById('capaEvento')
        const localEvento = document.getElementById('localEvento')
        const dataEvento = document.getElementById('dataEvento')
        const descricaoEvento = document.getElementById('descricaoEvento')
        const horasEvento = document.getElementById('horasEvento')
        const categoriaEvento = document.getElementById('categoriaEvento')

        // capa, descricao, hora_inicio e hora_termino, data, endereço

        nomeEvento.textContent = dadosEvento.nome
        capaEvento.src = dadosEvento.capa
        descricaoEvento.textContent = dadosEvento.descricao
        localEvento.textContent = `${dadosEndereco.rua} ${dadosEndereco.numero} - ${dadosEndereco.bairro}, ${dadosEndereco.cidade.nome} - ${dadosEndereco.cidade.estado}` 
        // arrumar abreviação do estado
        horasEvento.textContent = `${formatarHoras(dadosEvento.hora_inicio)} - ${formatarHoras(dadosEvento.hora_termino)}`
        categoriaEvento.textContent = dadosEvento.categoria.nome + ` - ${dadosEvento.categoria.descricao}`
        dataEvento.textContent = formatarData(dadosEvento.data)

        // const dados = {
        //   nomeEvento: nomeEvento.textContent,
        //   capaEvento: capaEvento.src,
        //   descricaoEvento: descricaoEvento.textContent,
        //   localEvento: localEvento.textContent,
        //   horasEvento: horasEvento.textContent,
        //   categoriaEvento: categoriaEvento.textContent,
        //   dataEvento: dataEvento.textContent
        // }

        document.getElementById('ingresso').addEventListener('click', async() => {

          mostrarToast()

          let ingresso = {
            id_usuario: JSON.parse(localStorage.getItem('usuario')).id,
            id_evento: dadosEvento.id
          }

          const result = await postIngresso(ingresso)

          if(result.status_code == 200){
            mostrarToast(true)
          }else{
            console.log(result)
            mostrarToast(false)
          }

        })

    }

}



function carregarIngresso(evento, ativo){

  if(ativo){

    const ativosTab = document.getElementById('tk-ativos')

    ativosTab.innerHTML += `<div class="tk-ticket-item">
                            <img src="${evento.capa}" class="tk-ticket-image" alt="Ingresso: ${evento.nome}">

                            <div class="tk-ticket-details">
                              <h4>${evento.nome}</h4>
                              <p>Categoria: ${evento.categoria.nome}</p>
                              <span class="tk-status">Ativo</span>
                            </div>
                          </div>`

  }else{

    const encerradosTab = document.getElementById('tk-encerrados')

    encerradosTab.innerHTML += `<div class="tk-ticket-item">
                            <img src="${evento.capa}" class="tk-ticket-image" alt="Ingresso: ${evento.nome}">

                            <div class="tk-ticket-details">
                              <h4>${evento.nome}</h4>
                              <p>Categoria: ${evento.categoria.nome}</p>
                               <span class="tk-status tk-encerrado">Encerrado</span>
                            </div>

                          </div>`

    
  }

}

function mostrarToast(deuCerto) {
  const toast = document.getElementById('toast');
  toast.classList.remove('hidden');
  toast.classList.add('show');

  if(deuCerto == false){
    toast.textContent = 'Deu ruim!'
  }

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300); // espera a animação terminar
  }, 2000); // mostra por 3 segundos
}

function mostrarEnviando() {
  const toast = document.getElementById('toastEnviando');

  
  toast.textContent = 'Enviando...'
  toast.classList.remove('hidden');
  toast.classList.add('show');
}

function esconderEnviando() {
  const toast = document.getElementById('toastEnviando');

  toast.textContent = 'Enviado!'

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden')

  }, 1000);
}

function esconderEnviando2() {
  const toast = document.getElementById('toastEnviando');

  toast.textContent = 'Erro!'

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden')

  }, 1000);
}

function formatarData(dataDia){

    let ano = dataDia.slice(0, 4)
    let mes = dataDia.slice(5, 7)
    let dia = dataDia.slice(8, 10)

    return `${dia}/${mes}/${ano}`

}

function formatarHoras(tempo){

    let horas = tempo.slice(0, 2)
    let minutos = tempo.slice(3, 5)

    if(minutos[0] == 0 && minutos[1] == 0){


        return `${horas}h`
    }else{
        return `${horas}h${minutos}`
    }


}

async function triggerEventos(){

    const eventos = document.getElementsByClassName('evento-card')
    const cardEvento = document.getElementById('overlay-evento')

    Array.from(eventos).forEach(evento => {

        evento.addEventListener('click', async function(){

            cardEvento.classList.remove('hidden')

            await carregarEvento(evento.dataset.id)
            
        })


    })

}

async function adicionarCategoriasSelect(){

  const selectCategoria = document.getElementById('categoria')

  const categorias = await getCategoria()


  categorias.categorias.forEach(categoria => {

    const option = document.createElement('option')
    option.value = categoria.id
    option.textContent = categoria.nome

    selectCategoria.appendChild(option)
    
  });

}

async function adicionarEstadosSelect(){

    const selectEstado = document.getElementById('estado')

    const estados = await getEstados()

    localStorage.setItem('estados', JSON.stringify(estados))

    estados.estados.forEach(estado => {

        const option = document.createElement('option')
        option.value = estado.id
        option.textContent = estado.nome

        selectEstado.appendChild(option)

    })

}



let categoria
let cidade
let data
let estado


async function triggerFiltros(){

    const allFiltros = document.getElementsByClassName('selectFiltro')



    Array.from(allFiltros).forEach(filtro => {

        if(filtro.localName == 'input'){

            console.log('a')
            
            const menuCalendarioCascata = document.getElementById('menu-calendario-cascata');
            const calTableBody = menuCalendarioCascata ? menuCalendarioCascata.querySelector('tbody') : null;
            const inputData = document.getElementById('quando')
        
                    
            inputData.addEventListener('click', async function(e){

                inputData.value = ''

                data = ''

                const eventosFiltrados = await filtrarEventos(categoria, data, cidade, estado)

                await carregarEventos(eventosFiltrados)

            })

            calTableBody.addEventListener('click', async function(){
                 setTimeout(async () => {
                data = inputData.value;

                console.log(`chega assim: ${data}`);

                if (!categoria && !cidade && !data && !estado) {
                    const eventos = await getEventos();
                    await carregarEventos(eventos);
                } else {
                    const eventosFiltrados = await filtrarEventos(categoria, data, cidade, estado);
                    await carregarEventos(eventosFiltrados);
                }
            }, 0); 

            })

            
            


        }else{

            console.log('entrei aqui')

            filtro.addEventListener('change', async function(){



            if(filtro.id == 'estado'){

                estado = filtro.options[filtro.selectedIndex].value

                console.log(`Estado = ${estado}`)
                
                await liberarFiltro()

                console.log(estado.length)

                if(estado.length < 1){

                    const cidade = document.getElementById('cidade')
                    cidade.disabled = true
            
                    const option = document.createElement('option')
                    option.text = 'Selecione um estado primeiro'
                    option.value = ''
                    cidade.add(option)

                }

                cidade = '' // deixa null aqui pq caso o estado mude, o filtro tem que resetar a cidade selecionada
                            // (até pq não tem como achar no filtro um evento em SP com a cidade em BH, por exemplo)

            }else if(filtro.id == 'categoria'){

                categoria = filtro.options[filtro.selectedIndex].value

            }else if(filtro.id == 'cidade'){

                cidade = filtro.options[filtro.selectedIndex].value


            }

            if(!categoria && !cidade && !data && !estado){

                const eventos = await getEventos()

                await carregarEventos(eventos)
            }else{
                
                const eventosFiltrados = await filtrarEventos(categoria, data, cidade, estado)

                await carregarEventos(eventosFiltrados)

            }   


        })
        }
            

        

    })

}
//Libera o filtro por cidade assim que o estado for escolhido.


async function liberarFiltro(){

    const cidade = document.getElementById('cidade')
    const estado = document.getElementById('estado')

    cidade.replaceChildren('')

    if(!estado){
        console.log('entrou aqui')
        cidade.textContent = 'Selecione um estado primeiro'
        cidade.disabled = true
    }else{

        console.log('nao entrou ali')

        cidade.textContent = 'Selecione o estado'

        cidade.disabled = false
        
        const dataCidades = await getCidades()

        console.log(dataCidades.cidades)

        const option = document.createElement('option')
        option.text = 'Selecione um estado primeiro'
        option.value = ''
        cidade.add(option)

        dataCidades.cidades.forEach(element => {

            if(element.estado == estado.options[estado.selectedIndex].textContent){
                const option = document.createElement('option')
                option.text = element.nome
                option.value = element.id
                cidade.add(option)
            }

            console.log(`elemento:`, element)

            
        });


    }

}

//calendario

function initCalendarioCustomizado() {
  const inputQuando = document.getElementById('quando');
  const menuCalendarioCascata = document.getElementById('menu-calendario-cascata');
  const calHeader = menuCalendarioCascata ? menuCalendarioCascata.querySelector('.cal-mesano') : null;
  const calPrev = menuCalendarioCascata ? menuCalendarioCascata.querySelector('.cal-prev') : null;
  const calNext = menuCalendarioCascata ? menuCalendarioCascata.querySelector('.cal-next') : null;
  const calTableBody = menuCalendarioCascata ? menuCalendarioCascata.querySelector('tbody') : null;

  let calData = {
    mes: new Date().getMonth(),
    ano: new Date().getFullYear(),
    selecionado: null
  };

  function renderCalendario() {
    if (!calHeader || !calTableBody) return;
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    calHeader.textContent = `${meses[calData.mes]} ${calData.ano}`;
    const primeiroDia = new Date(calData.ano, calData.mes, 1).getDay();
    const diasNoMes = new Date(calData.ano, calData.mes + 1, 0).getDate();
    let html = '<tr>';
    let dia = 1;

    // Espaços vazios antes do primeiro dia da semana
    for (let i = 0; i < primeiroDia; i++) html += '<td></td>';

    for (let i = primeiroDia; i < 7; i++) {
      html += `<td data-dia="${dia}">${dia}</td>`;
      dia++;
    }
    html += '</tr>';

    while (dia <= diasNoMes) {
      html += '<tr>';
      for (let i = 0; i < 7 && dia <= diasNoMes; i++) {
        html += `<td data-dia="${dia}">${dia}</td>`;
        dia++;
      }
      html += '</tr>';
    }
    calTableBody.innerHTML = html;

    // Marca visualmente o dia selecionado
    if (calData.selecionado && calData.selecionado.mes === calData.mes && calData.selecionado.ano === calData.ano) {
      const tds = calTableBody.querySelectorAll('td[data-dia]');
      tds.forEach(td => {
        if (parseInt(td.getAttribute('data-dia')) === calData.selecionado.dia) {
          td.classList.add('selected');
        }
      });
    }
  }

  if (inputQuando && menuCalendarioCascata && calPrev && calNext && calTableBody) {
    inputQuando.addEventListener('focus', () => {
      menuCalendarioCascata.style.display = 'flex';
      renderCalendario();
    });

    inputQuando.addEventListener('click', () => {
      menuCalendarioCascata.style.display = 'flex';
      renderCalendario();
    });

    document.addEventListener('mousedown', (e) => {
      if (!menuCalendarioCascata.contains(e.target) && e.target !== inputQuando) {
        
        menuCalendarioCascata.style.display = 'none';
      }
    });


    calPrev.addEventListener('click', () => {
      if (calData.mes === 0) {
        calData.mes = 11;
        calData.ano--;
      } else {
        calData.mes--;
      }
      renderCalendario();
    });

    calNext.addEventListener('click', () => {
      if (calData.mes === 11) {
        calData.mes = 0;
        calData.ano++;
      } else {
        calData.mes++;
      }
      renderCalendario();
    });

    calTableBody.addEventListener('click', (e) => {
      if (e.target.tagName === 'TD' && e.target.hasAttribute('data-dia')) {
        const dia = parseInt(e.target.getAttribute('data-dia'));
        calData.selecionado = { dia, mes: calData.mes, ano: calData.ano };
        const diaStr = String(dia).padStart(2,'0');
        const mesStr = String(calData.mes + 1).padStart(2,'0');
        inputQuando.value = `${diaStr}/${mesStr}/${calData.ano}`;
        menuCalendarioCascata.style.display = 'none';
        console.log(`input 3 = ${inputQuando.value}`)
      }
    });
  }
}

function initSearchBarToggle() {
  const searchIcon = document.getElementById('search-icon');
  const searchBar = document.getElementById('search-bar');
  const searchIconLoggedIn = document.getElementById('search-icon-logged-in');
  const searchBarLoggedIn = document.getElementById('search-bar-logged-in');

  function toggleSearchBar(icon, bar) {
    if (icon && bar) {

      icon.id = ''
      icon.addEventListener('click', function (event) {

        icon.id = 'search-icon-logged-in'

        
        event.stopPropagation(); // Impede que o clique no ícone feche a barra imediatamente
        const isCurrentlyActive = bar.classList.contains('active');
        
        // Se a barra NÃO está ativa, atfiva e foca.
        // Se ESTÁ ativa, desativa.
        if (!isCurrentlyActive) {
          bar.classList.add('active');
          icon.classList.add('active');
          bar.style.pointerEvents = 'auto'; // Permite digitação
          setTimeout(() => bar.focus(), 0); // Garante o foco após a transição
        } else {
          bar.classList.remove('active');
          icon.classList.remove('active');
          bar.style.pointerEvents = 'none'; // Impede digitação quando inativa
        }
      });

      // Impede a digitação quando a barra não está visível (ativa)
      if (!bar.classList.contains('active')) {
        bar.style.pointerEvents = 'none';
      }
    }
  }

  toggleSearchBar(searchIcon, searchBar);
  toggleSearchBar(searchIconLoggedIn, searchBarLoggedIn);

  // Adiciona um event listener para fechar a barra de pesquisa se clicar fora dela
  document.addEventListener('click', function(event) {
    function closeSearchBar(bar, icon) {
      if (bar && bar.classList.contains('active') && !bar.contains(event.target) && !icon.contains(event.target)) {

        document.getElementById('search-bar-logged-in').value = ''

        icon.id = ''
        bar.classList.remove('active');
        icon.classList.remove('active');
        bar.style.pointerEvents = 'none'; // Impede digitação quando inativa
      }
    }
    closeSearchBar(searchBar, searchIcon);
    closeSearchBar(searchBarLoggedIn, searchIconLoggedIn);
  });
}

async function initMeusIngressos(){

  const modalIngressos = document.getElementById('tk-ticketModal')  

  console.log(modalIngressos)

  document.getElementById('meusIngressos').addEventListener('click', async() => {

    modalIngressos.classList.remove('hidden')

    const eventos = await selectIngressosByUser(JSON.parse(localStorage.getItem('usuario')).id)

    console.log(JSON.parse(localStorage.getItem('usuario')).id)

    console.log(eventos)

    eventos.ingressos.encerrados.forEach(evento =>{

      carregarIngresso(evento, false)
    })

    eventos.ingressos.ativos.forEach(evento =>{

      carregarIngresso(evento, true)
    })

  })

  document.getElementById('tk-closeModal').addEventListener('click', () => {

    modalIngressos.classList.add('hidden')

  })

  const tabButtons = document.querySelectorAll(".tk-tab-button");
  const tabContents = document.querySelectorAll(".tk-tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("tk-active"));
      tabContents.forEach(content => content.classList.remove("tk-active"));



      button.classList.add("tk-active");
      document.getElementById(button.dataset.tab).classList.add("tk-active");
    });
  });

}

async function triggerLupa(){
    
  document.getElementById('search-bar-logged-in').addEventListener('keydown', async(e) => {

    if(e.key === 'Enter'){

        if(document.getElementById('search-bar-logged-in').value){
          const resultEventos = await filtroByNome(document.getElementById('search-bar-logged-in').value)

          await carregarEventos(resultEventos)

        }else{
          const resultEventos = await getEventos()

          await carregarEventos(resultEventos)
        }

    
    }
  })

  document.getElementById('pesquisarNome').addEventListener('click', async(e) => {

      if(document.getElementById('search-bar-logged-in').value){
          const resultEventos = await filtroByNome(document.getElementById('search-bar-logged-in').value)

          await carregarEventos(resultEventos)

        }else{
          const resultEventos = await getEventos()

          await carregarEventos(resultEventos)
        }

  })
}



document.addEventListener('DOMContentLoaded', async () => {


  initSearchBarToggle()
  const eventos = await getEventos()

  await adicionarCategoriasSelect()
  await adicionarEstadosSelect()

  await triggerFiltros()

  await carregarEventos(eventos);

  await logandoUser()

  await initMeusIngressos()

  await triggerLupa()

  initCalendarioCustomizado()

})