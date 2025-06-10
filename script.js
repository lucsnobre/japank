'use strict'

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
        alert('Cadastro realizado com sucesso!')

        // Fecha o modal e limpa o formulário
        document.getElementById('cadastro-overlay').classList.add('hidden')
        document.getElementById('form-cadastro').reset()

    } catch (error) {
        console.error('Erro ao cadastrar:', error)
        alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.')
    }
})




//FunçõesAPI
async function getUsuarios() {
    const url = `http://10.107.134.19:8080/v1/planify/usuario`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

async function getUsuario(id) {
    const url = `http://10.107.134.19:8080/v1/planify/usuario/${id}`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

async function postUsuario(usuario) {
    const url = `http://10.107.134.4:8080/v1/planify/usuario`

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }

    const response = await fetch(url, options)

    const data = await response.json()

    return data
}

async function putUsuario(usuario, id) {
    const url = `http://10.107.134.19:8080/v1/planify/usuario`

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }

    const response = await fetch(url, options)

    const data = await response.json()

    return data
}

async function deleteUsuario(id) {
    const url = `http://10.107.134.19:8080/v1/planify/usuario/:search_id`

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    }

    const response = await fetch(url, options)

    const data = await response.json()

    return data
}



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

/* crud login
document.getElementById('form-login').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('login-email').value.trim()
    const senha = document.getElementById('login-senha').value.trim()

    const loginData = { email, senha }

    try {
        const response = await fetch('http://10.107.134.4:8080/v1/planify/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        if (!response.ok) throw new Error('Login inválido')

        const data = await response.json()
        console.log('Login realizado:', data)

        if (data.token) {
            localStorage.setItem('token', data.token)
        }

        alert('Login realizado com sucesso!')
        overlayLogin.classList.add('hidden')
        document.getElementById('form-login').reset()

    } catch (error) {
        console.error('Erro ao fazer login:', error)
        alert('Email ou senha incorretos.')
    }
})*/

//bglh do esqueceu sunha senha
function abrirRecuperacaoSenha() {
    document.getElementById("login-overlay").classList.add("hidden");
    document.getElementById("recuperacao-overlay").classList.remove("hidden")
}

function fecharRecuperacaoSenha() {
    document.getElementById("recuperacao-overlay").classList.add("hidden")
}

function voltarParaLogin() {
    document.getElementById("recuperacao-overlay").classList.add("hidden")
    document.getElementById("login-overlay").classList.remove("hidden")
}

//Redirecionar da tela de cadastrto pra de login
// Link para abrir o login via cadastro
document.getElementById('abrirLoginViaCadastro').addEventListener('click', (event) => {
    event.preventDefault()
    overlayCadastro.classList.add('hidden')
    overlayLogin.classList.remove('hidden')
})

//Favorito
document.querySelectorAll('.btn-curtir').forEach(button => {
    button.addEventListener('click', function () {
        const heart = this.querySelector('./img/love path');
        const isFilled = heart.getAttribute('fill') === '#e74c3c';

        if (isFilled) {
            heart.setAttribute('fill', 'none');
            heart.setAttribute('stroke', '#888');
        } else {
            heart.setAttribute('fill', '#e74c3c');
            heart.setAttribute('stroke', '#e74c3c');
        }
    });
});

//pop up de Login

document.getElementById('form-login').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('login-email').value.trim()
    const senha = document.getElementById('login-senha').value.trim()

    try {
        const url = `http://10.107.134.4:8080/v1/planify/usuario/login/email/senha?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Email ou senha incorretos')
        }

        const data = await response.json();
        console.log('Login realizado:', data)

        alert('Login realizado com sucesso!')
        document.getElementById('overlayLogin').classList.add('hidden')
        document.getElementById('form-login').reset()

    } catch (error) {

    }
})

// === RECUPERAÇÃO DE SENHA (PRIMEIRA TELA) ===
let recoveryEmail = null;
let recoveryToken = null;

// Modified "Forgot Password" link handler
document.addEventListener("DOMContentLoaded", () => {
    const linkRecuperar = document.querySelector(".esqueceu-senha a");

    linkRecuperar.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("login-overlay").classList.add("hidden");
        document.getElementById("recuperacao-overlay").classList.remove("hidden");
    });
});


document.getElementById('form-recuperar-senha').addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
        const email = document.getElementById('recuperar-email').value.trim();
        console.log('[1] Email capturado:', email);

        console.log('[DEBUG] Antes do fetch');
        const response = await fetch(`http://10.107.134.4:8080/v1/planify/recuperar-senha/${email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        console.log(response)
    
        console.log('[DEBUG] Depois do fetch');
        console.log('Status da resposta:', response.status);
        if (!response.ok) {
            console.error('[2] Erro na resposta do servidor');
            throw new Error('Erro ao enviar e-mail');
        }

        console.log('[3] Requisição enviada com sucesso');
        recoveryEmail = email;

        // Oculta recuperação
        const recuperacao = document.getElementById('recuperacao-overlay');
        recuperacao.classList.add('hidden');
        console.log('[4] Escondeu recuperação?', recuperacao.classList.contains('hidden'));

        // Mostra verificação
        alert('Sucesso!');
        const verificacao = document.getElementById('verificacao-overlay');
        verificacao.classList.remove('hidden');
    } catch (error) {
        console.error('[GLOBAL CATCH] Erro inesperado:', error);
        alert('Erro inesperado: ' + error.message);
    }
});




//Verficar codigo
document.getElementById('form-verificacao-codigo').addEventListener('submit', async function (e) {
    e.preventDefault();

    const codigo = document.getElementById('codigo-verificacao').value.trim();

    if (!recoveryEmail) {
        alert('Email de recuperação não encontrado. Por favor, inicie o processo novamente.');
        return;
    }

    try {
        const response = await fetch(`http://10.107.134.4:8080/v1/planify/verificar-codigo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: recoveryEmail, codigo: codigo })
        });

        if (!response.ok) {
            throw new Error('Código inválido');
        }

        const data = await response.json();
        recoveryToken = data.token;

        const overlay = document.getElementById('verificacao-overlay');
        overlay.classList.remove('hidden');
        document.getElementById('nova-senha-overlay').classList.remove('hidden');

    } catch (error) {
        console.error('Erro:', error);
        alert('Código inválido. Por favor, verifique o código recebido por e-mail.');
    }
});

//NOVA senha
document.getElementById('form-nova-senha').addEventListener('submit', async function (e) {
    e.preventDefault();

    const novaSenha = document.getElementById('nova-senha').value.trim();

    if (!recoveryToken) {
        alert('Token de recuperação não encontrado. Por favor, inicie o processo novamente.');
        return;
    }

    try {
        const response = await fetch(`http://10.107.134.4:8080/v1/planify/redefinir-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: recoveryToken, novaSenha: novaSenha })
        });

        if (!response.ok) {
            throw new Error('Erro ao redefinir senha');
        }

        alert('Senha redefinida com sucesso! Agora você pode fazer login com a nova senha.');
        document.getElementById('nova-senha-overlay').classList.add('hidden');
        document.getElementById('login-overlay').classList.remove('hidden');
        recoveryEmail = null;
        recoveryToken = null;

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao redefinir senha. Por favor, tente novamente.');
    }
});


// fechar popups
document.querySelectorAll('.fechar').forEach(button => {
    button.addEventListener('click', () => {
        const overlay = button.closest('.overlay');
        overlay.classList.add('hidden');
        recoveryEmail = null;
        recoveryToken = null;
    });
});

/*document.getElementById('form-recuperar-senha').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('recuperar-email').value;
  
    console.log('Email digitado:', email); // TESTE AQUI
  
    try {
      const response = await fetch(`http://10.107.144.9:8080/v1/planify/recuperar-senha/${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) throw new Error('Erro ao enviar e-mail');
  
      // Sucesso: abre o pop-up de verificação
      document.getElementById('recuperacao-overlay').classList.add('hidden');
      document.getElementById('verificacao-overlay').classList.remove('hidden');
  
      window.emailRecuperacao = email;
  
    } catch (error) {
      alert('Erro ao enviar e-mail: ' + error.message);
    }
  });
  
 
*/

const estadosCidades = document.ATTRIBUTE_NODE

//Favoritos
document.querySelectorAll('.btn-curtir').forEach(button => {
    button.addEventListener('click', function () {
        const heart = this.querySelector('img');
        // Toggle favorite state by changing the image source or adding a class
        if (heart.style.filter === 'invert(1)') {
            heart.style.filter = '';
        } else {
            heart.style.filter = 'invert(1)';
        }
    });
});

// Teste de fetch para endpoint público ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(r => r.json())
        .then(data => console.log('[FETCH TEST] Sucesso no fetch público:', data))
        .catch(err => console.error('[FETCH TEST] Erro no fetch público:', err));
});

// Estados e cidades (exemplo, adicione mais conforme necessário)
const cidadesPorEstado = {
  'PE': ['Recife', 'Olinda', 'Jaboatão dos Guararapes'],
  'SP': ['São Paulo', 'Campinas', 'Santos'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  // ... outros estados
};

const selectEstado = document.getElementById('estado');

if (selectEstado) {
  selectEstado.addEventListener('change', function() {
    const estado = this.value;
    if (estado && cidadesPorEstado[estado]) {
      const selectCidade = document.getElementById('cidade');
      selectCidade.innerHTML = '';
      cidadesPorEstado[estado].forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidade.appendChild(option);
      });
      selectCidade.disabled = false;
    } else {
      const selectCidade = document.getElementById('cidade');
      selectCidade.innerHTML = '<option value="">Selecione o estado primeiro</option>';
      selectCidade.disabled = true;
    }
  });
}

// Menu lateral de estados e cidades
const cidadesPorEstadoMenu = {
  'PE': ['Recife', 'Olinda', 'Jaboatão dos Guararapes'],
  'SP': ['São Paulo', 'Campinas', 'Santos'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  // ... outros estados
};

const estadosLista = document.querySelectorAll('.estados-lista li');
const cidadesLista = document.querySelector('.cidades-lista');

if (estadosLista && cidadesLista) {
  estadosLista.forEach(li => {
    li.addEventListener('mouseenter', function() {
      // Remove active de todos
      estadosLista.forEach(e => e.classList.remove('active'));
      this.classList.add('active');
      // Preenche cidades
      const estado = this.getAttribute('data-estado');
      cidadesLista.innerHTML = '';
      if (cidadesPorEstadoMenu[estado]) {
        cidadesPorEstadoMenu[estado].forEach(cidade => {
          const cidadeLi = document.createElement('li');
          cidadeLi.textContent = cidade;
          cidadesLista.appendChild(cidadeLi);
        });
      }
    });
  });
}

// --- Filtro Estado com menu cascata de cidades ---
const cidadesPorEstadoCascata = {
  'PE': ['Recife', 'Olinda', 'Jaboatão dos Guararapes'],
  'SP': ['São Paulo', 'Campinas', 'Santos'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
};

const selectEstadoFiltro = document.getElementById('estado');
const menuCidadesCascata = document.getElementById('menu-cidades-cascata');
const estadosListaCascata = menuCidadesCascata ? menuCidadesCascata.querySelectorAll('.estados-lista li') : [];
const cidadesListaCascata = menuCidadesCascata ? menuCidadesCascata.querySelector('.cidades-lista') : null;

if (selectEstadoFiltro && menuCidadesCascata) {
  // Mostrar menu ao focar/clicar no select
  selectEstadoFiltro.addEventListener('focus', () => {
    menuCidadesCascata.style.display = 'flex';
    selectEstadoFiltro.classList.add('menu-cidades-open');
  });
  selectEstadoFiltro.addEventListener('click', () => {
    menuCidadesCascata.style.display = 'flex';
    selectEstadoFiltro.classList.add('menu-cidades-open');
  });
  // Esconder menu ao clicar fora
  document.addEventListener('mousedown', (e) => {
    if (!menuCidadesCascata.contains(e.target) && e.target !== selectEstadoFiltro) {
      menuCidadesCascata.style.display = 'none';
      selectEstadoFiltro.classList.remove('menu-cidades-open');
    }
  });
  // Preencher cidades ao passar mouse em estado
  estadosListaCascata.forEach(li => {
    li.addEventListener('mouseenter', function() {
      estadosListaCascata.forEach(e => e.classList.remove('active'));
      this.classList.add('active');
      const estado = this.getAttribute('data-estado');
      cidadesListaCascata.innerHTML = '';
      if (cidadesPorEstadoCascata[estado]) {
        cidadesPorEstadoCascata[estado].forEach(cidade => {
          const cidadeLi = document.createElement('li');
          cidadeLi.textContent = cidade;
          cidadeLi.addEventListener('click', () => {
            // Salva seleção e fecha menu
            selectEstadoFiltro.value = estado;
            selectEstadoFiltro.setAttribute('data-cidade', cidade);
            // Atualiza o texto exibido no select para Estado - Cidade
            let option = selectEstadoFiltro.querySelector('option.custom-cidade');
            if (!option) {
              option = document.createElement('option');
              option.className = 'custom-cidade';
              selectEstadoFiltro.appendChild(option);
            }
            option.value = estado;
            option.textContent = `${this.parentElement.previousElementSibling ? this.parentElement.previousElementSibling.textContent : estado} - ${cidade}`;
            option.selected = true;
            menuCidadesCascata.style.display = 'none';
            selectEstadoFiltro.classList.remove('menu-cidades-open');
            // Opcional: mostrar cidade selecionada em algum lugar
          });
          cidadesListaCascata.appendChild(cidadeLi);
        });
      }
    });
  });
}

// --- Filtro Procurando por com menu cascata de subcategorias ---
const subtiposPorTipo = {
  'show': ['Pagode', 'Sertanejo', 'Rock', 'Pop'],
  'festa': ['Universitária', 'Open Bar', 'Balada'],
  'standup': ['Comédia', 'Improviso'],
  // ... outros tipos e subtipos
};

const selectTipoEvento = document.getElementById('tipo-evento');
const menuTipoCascata = document.getElementById('menu-tipo-cascata');
const tiposListaCascata = menuTipoCascata ? menuTipoCascata.querySelectorAll('.tipos-lista li') : [];
const subtiposListaCascata = menuTipoCascata ? menuTipoCascata.querySelector('.subtipos-lista') : null;

if (selectTipoEvento && menuTipoCascata) {
  // Mostrar menu ao focar/clicar no select
  selectTipoEvento.addEventListener('focus', () => {
    menuTipoCascata.style.display = 'flex';
    selectTipoEvento.classList.add('menu-cidades-open');
  });
  selectTipoEvento.addEventListener('click', () => {
    menuTipoCascata.style.display = 'flex';
    selectTipoEvento.classList.add('menu-cidades-open');
  });
  // Esconder menu ao clicar fora
  document.addEventListener('mousedown', (e) => {
    if (!menuTipoCascata.contains(e.target) && e.target !== selectTipoEvento) {
      menuTipoCascata.style.display = 'none';
      selectTipoEvento.classList.remove('menu-cidades-open');
    }
  });
  // Preencher subtipos ao passar mouse em tipo
  tiposListaCascata.forEach(li => {
    li.addEventListener('mouseenter', function() {
      tiposListaCascata.forEach(e => e.classList.remove('active'));
      this.classList.add('active');
      const tipo = this.getAttribute('data-tipo');
      subtiposListaCascata.innerHTML = '';
      if (subtiposPorTipo[tipo]) {
        subtiposPorTipo[tipo].forEach(subtipo => {
          const subtipoLi = document.createElement('li');
          subtipoLi.textContent = subtipo;
          subtipoLi.addEventListener('click', () => {
            // Salva seleção e fecha menu
            selectTipoEvento.value = tipo;
            selectTipoEvento.setAttribute('data-subtipo', subtipo);
            // Atualiza o texto exibido no select para Tipo - Subtipo
            let option = selectTipoEvento.querySelector('option.custom-subtipo');
            if (!option) {
              option = document.createElement('option');
              option.className = 'custom-subtipo';
              selectTipoEvento.appendChild(option);
            }
            option.value = tipo;
            option.textContent = `${this.parentElement.previousElementSibling ? this.parentElement.previousElementSibling.textContent : tipo} - ${subtipo}`;
            option.selected = true;
            menuTipoCascata.style.display = 'none';
            selectTipoEvento.classList.remove('menu-cidades-open');
          });
          subtiposListaCascata.appendChild(subtipoLi);
        });
      }
    });
  });
}

// --- Filtro Quando: calendário customizado ---
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
  // Dias do mês
  const primeiroDia = new Date(calData.ano, calData.mes, 1).getDay();
  const diasNoMes = new Date(calData.ano, calData.mes+1, 0).getDate();
  let html = '<tr>';
  let dia = 1;
  // Espaços vazios antes do primeiro dia
  for (let i=0; i<primeiroDia; i++) html += '<td></td>';
  for (let i=primeiroDia; i<7; i++) {
    html += `<td data-dia="${dia}">${dia}</td>`;
    dia++;
  }
  html += '</tr>';
  while (dia <= diasNoMes) {
    html += '<tr>';
    for (let i=0; i<7 && dia<=diasNoMes; i++) {
      html += `<td data-dia="${dia}">${dia}</td>`;
      dia++;
    }
    html += '</tr>';
  }
  calTableBody.innerHTML = html;
  // Seleção visual
  if (calData.selecionado && calData.selecionado.mes === calData.mes && calData.selecionado.ano === calData.ano) {
    const tds = calTableBody.querySelectorAll('td[data-dia]');
    tds.forEach(td => {
      if (parseInt(td.getAttribute('data-dia')) === calData.selecionado.dia) {
        td.classList.add('selected');
      }
    });
  }
}

if (inputQuando && menuCalendarioCascata) {
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
  // Navegação
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
  // Seleção de dia
  calTableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD' && e.target.hasAttribute('data-dia')) {
      const dia = parseInt(e.target.getAttribute('data-dia'));
      calData.selecionado = { dia, mes: calData.mes, ano: calData.ano };
      // Formatar para dd/mm/aaaa
      const diaStr = String(dia).padStart(2,'0');
      const mesStr = String(calData.mes+1).padStart(2,'0');
      inputQuando.value = `${diaStr}/${mesStr}/${calData.ano}`;
      menuCalendarioCascata.style.display = 'none';
    }
  });
}

// --- Carregar eventos dinamicamente ---
async function carregarEventos() {
  const container = document.querySelector('.eventos-container');
  if (!container) return;
  container.innerHTML = '<p style="color:#fff">Carregando eventos...</p>';
  try {
    const response = await fetch('http://10.107.134.4:8080/v1/planify/evento');
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    const data = await response.json();
    console.log('Eventos retornados pela API:', data);
    const eventos = data.eventos || data;
    if (!eventos.length) {
      container.innerHTML = '<p style="color:#fff">Nenhum evento encontrado.</p>';
      return;
    }
    container.innerHTML = '';
    eventos.forEach(evento => {
      container.innerHTML += `
        <div class="evento-card">
          <button class="btn-curtir" title="Salvar evento">
            <img class="icone-curtir-img" src="./img/coracao.png" alt="Curtir">
          </button>
          <img class="evento-img" src="${evento.imagem || './img/placeholder.jpg'}" alt="Imagem do Evento">
          <div class="evento-info">
            <h3>${evento.nome || ''}</h3>
            <p>${evento.data ? formatarData(evento.data) : ''}${evento.cidade ? ' - ' + evento.cidade : ''}</p>
            ${evento.descricao ? `<p style='font-size:0.95em;color:#444;margin-top:6px;'>${evento.descricao}</p>` : ''}
            ${evento.endereco ? `<p style='font-size:0.92em;color:#666;margin-top:2px;'>${evento.endereco}</p>` : ''}
            ${evento.preco ? `<p style='font-size:1em;color:#b4580f;margin-top:2px;'>R$ ${evento.preco}</p>` : ''}
          </div>
          <div class="evento-arrow">
            <img src="./img/seta.png" alt="Ver mais">
          </div>
        </div>
      `;
    });
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

function formatarData(dataStr) {
  const data = new Date(dataStr);
  if (isNaN(data)) return '';
  return data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

window.addEventListener('DOMContentLoaded', carregarEventos);