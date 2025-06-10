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




//FunçõesAPI
async function getUsuarios() {
    const url = `http://10.107.144.23:3030/v1/planify/usuario`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

async function getUsuario(id) {
    const url = `http://10.107.144.23:3030/v1/planify/usuario/${id}`

    const response = await fetch(url)

    const data = await response.json()

    return data
}

async function postUsuario(usuario) {
    const url = `http://10.107.144.23:3030/v1/planify/usuario`

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
    const url = `http://10.107.144.23:3030/v1/planify/usuario`

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
    const url = `http://10.107.144.23:3030/v1/planify/usuario/:search_id`

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
        const url = `http://10.107.144.23:3030/v1/planify/usuario/login/email/senha?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        })

        if (!response.ok) throw new Error('Login inválido')

        const data = await response.json()
        console.log('Login realizado:', data)

        if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('userData', JSON.stringify(data))
            
            // Alternar entre os headers
            document.querySelector('.top-bar:not(.logged-in)').style.display = 'none'
            document.getElementById('header-logged-in').style.display = 'flex'
            
            // Atualizar foto do perfil se disponível
            if (data.fotoPerfil) {
                document.getElementById('user-profile-img').src = data.fotoPerfil
            }
        }

        alert('Login realizado com sucesso!')
        overlayLogin.classList.add('hidden')
        document.getElementById('form-login').reset()
        
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        alert('Email ou senha incorretos.')
    }
})

// Adicionar evento de clique na foto do perfil
document.getElementById('user-profile-img').addEventListener('click', function() {
    window.location.href = '/perfil/index.html'
})

// Adicionar evento de clique no botão de criar evento
document.querySelector('.btn.criar-evento').addEventListener('click', function() {
    // Aqui você pode adicionar a lógica para criar um evento
    // Por exemplo, redirecionar para uma página de criação de evento
    window.location.href = '/criar-evento/index.html'
})

// Verificar se o usuário já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token')
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    
    if (token) {
        document.querySelector('.top-bar:not(.logged-in)').style.display = 'none'
        document.getElementById('header-logged-in').style.display = 'flex'
        
        if (userData.fotoPerfil) {
            document.getElementById('user-profile-img').src = userData.fotoPerfil
        }
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

// Função para enviar email de recuperação
document.getElementById('form-recuperar-senha').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const email = document.getElementById('recuperar-email').value.trim();
        console.log('[1] Email capturado:', email);

        const response = await fetch(`http://10.107.144.23:3030/v1/planify/recuperar-senha/${email}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) throw new Error('Erro ao enviar email de recuperação');

        const data = await response.json();
        console.log('Resposta da API:', data);

        // Armazena o email para uso posterior
        recoveryEmail = email;

        // Fecha o modal de recuperação e abre o modal de verificação
        document.getElementById('recuperacao-overlay').classList.add('hidden');
        document.getElementById('verificacao-overlay').classList.remove('hidden');

        alert('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        alert('Erro ao enviar email de recuperação. Por favor, tente novamente.');
    }
});

// Função para verificar o código
document.getElementById('form-verificacao-codigo').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const codigo = document.getElementById('codigo-verificacao').value.trim();
        
        if (!recoveryEmail) {
            throw new Error('Email de recuperação não encontrado');
        }

        const response = await fetch(`http://10.107.144.23:3030/v1/planify/verificar-codigo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: recoveryEmail,
                codigo: codigo
            })
        });

        if (!response.ok) throw new Error('Código inválido');

        const data = await response.json();
        recoveryToken = data.token; // Armazena o token para uso na redefinição de senha

        // Fecha o modal de verificação e abre o modal de nova senha
        document.getElementById('verificacao-overlay').classList.add('hidden');
        document.getElementById('nova-senha-overlay').classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao verificar código:', error);
        alert('Código inválido. Por favor, tente novamente.');
    }
});

// Função para redefinir a senha
document.getElementById('form-nova-senha').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const novaSenha = document.getElementById('nova-senha').value.trim();
        
        if (!recoveryEmail || !recoveryToken) {
            throw new Error('Dados de recuperação não encontrados');
        }

        const response = await fetch(`http://10.107.144.23:3030/v1/planify/redefinir-senha`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${recoveryToken}`
            },
            body: JSON.stringify({
                email: recoveryEmail,
                novaSenha: novaSenha
            })
        });

        if (!response.ok) throw new Error('Erro ao redefinir senha');

        // Limpa as variáveis de recuperação
        recoveryEmail = null;
        recoveryToken = null;

        // Fecha o modal de nova senha e abre o modal de login
        document.getElementById('nova-senha-overlay').classList.add('hidden');
        document.getElementById('login-overlay').classList.remove('hidden');

        alert('Senha redefinida com sucesso! Faça login com sua nova senha.');

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        alert('Erro ao redefinir senha. Por favor, tente novamente.');
    }
});

// Funções auxiliares para navegação entre modais
function voltarParaLogin() {
    document.getElementById('recuperacao-overlay').classList.add('hidden');
    document.getElementById('verificacao-overlay').classList.add('hidden');
    document.getElementById('nova-senha-overlay').classList.add('hidden');
    document.getElementById('login-overlay').classList.remove('hidden');
    
    // Limpa as variáveis de recuperação
    recoveryEmail = null;
    recoveryToken = null;
}

function fecharRecuperacaoSenha() {
    document.getElementById('recuperacao-overlay').classList.add('hidden');
    recoveryEmail = null;
}

function fecharVerificacao() {
    document.getElementById('verificacao-overlay').classList.add('hidden');
    recoveryEmail = null;
    recoveryToken = null;
}

function fecharNovaSenha() {
    document.getElementById('nova-senha-overlay').classList.add('hidden');
    recoveryEmail = null;
    recoveryToken = null;
}

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
          cidadeLi.textContent = cidade.nome?.nome || cidade.nome || cidade.cidade || JSON.stringify(cidade);
          cidadeLi.addEventListener('click', () => {
            // Salva seleção e fecha menu
            selectEstadoFiltro.value = estado;
            selectEstadoFiltro.setAttribute('data-cidade', cidade.nome);
            // Atualiza o texto exibido no select para Estado - Cidade
            let option = selectEstadoFiltro.querySelector('option.custom-cidade');
            if (!option) {
              option = document.createElement('option');
              option.className = 'custom-cidade';
              selectEstadoFiltro.appendChild(option);
            }
            option.value = estado;
            option.textContent = `${this.parentElement.previousElementSibling ? this.parentElement.previousElementSibling.textContent : estado} - ${cidade.nome?.nome || cidade.nome || cidade.cidade || JSON.stringify(cidade)}`;
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
    const response = await fetch('http://10.107.144.23:3030/v1/planify/evento');
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
          <img class="evento-img" src="${evento.imagem || './img/pau nu jugu.jpg'}" alt="Imagem do Evento">
          <div class="evento-info">
            <h3>${evento.nome || ''}</h3>
            <p>${evento.data ? formatarData(evento.data) : ''}${evento.cidade ? ' - ' + extrairNome(evento.cidade) : ''}</p>
            ${evento.descricao ? `<p style='font-size:0.95em;color:#444;margin-top:6px;'>${evento.descricao}</p>` : ''}
            ${evento.endereco ? `<p style='font-size:0.92em;color:#666;margin-top:2px;'>${formatarEndereco(evento.endereco)}</p>` : ''}
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

// Função para filtrar eventos
async function filtrarEventos() {
    const tipoEvento = document.getElementById('tipo-evento').value;
    const estado = document.getElementById('estado').value;
    const data = document.getElementById('quando').value;
    
    try {
        // Construir a URL com os parâmetros de filtro
        let url = 'http://10.107.144.23:3030/v1/planify/evento/filtro';
        const params = new URLSearchParams();
        
        if (tipoEvento) {
            const [tipo, subtipo] = tipoEvento.split(' - ');
            params.append('tipo', tipo);
            if (subtipo) params.append('subtipo', subtipo);
        }
        
        if (estado) {
            const [estadoSigla, cidade] = estado.split(' - ');
            params.append('estado', estadoSigla);
            if (cidade) params.append('cidade', cidade);
        }
        
        if (data) {
            // Converter a data do formato dd/mm/aaaa para aaaa-mm-dd
            const [dia, mes, ano] = data.split('/');
            const dataFormatada = `${ano}-${mes}-${dia}`;
            params.append('data', dataFormatada);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erro ao buscar eventos');
        
        const data = await response.json();
        const eventos = data.eventos || data;
        
        // Atualizar a exibição dos eventos
        const container = document.querySelector('.eventos-container');
        if (!eventos.length) {
            container.innerHTML = '<p style="color:#666;text-align:center;width:100%;">Nenhum evento encontrado com os filtros selecionados.</p>';
            return;
        }
        
        container.innerHTML = '';
        eventos.forEach(evento => {
            container.innerHTML += `
                <div class="evento-card">
                    <button class="btn-curtir" title="Salvar evento">
                        <img class="icone-curtir-img" src="./img/coracao.png" alt="Curtir">
                    </button>
                    <img class="evento-img" src="${evento.capa || './img/placeholder.jpg'}" alt="Imagem do Evento">
                    <div class="evento-info">
                        <h3>${evento.nome || ''}</h3>
                        <p>${evento.data ? formatarData(evento.data) : ''}${evento.cidade ? ' - ' + extrairNome(evento.cidade) : ''}</p>
                        ${evento.descricao ? `<p style='font-size:0.95em;color:#444;margin-top:6px;'>${evento.descricao}</p>` : ''}
                        ${evento.endereco ? `<p style='font-size:0.92em;color:#666;margin-top:2px;'>${formatarEndereco(evento.endereco)}</p>` : ''}
                        ${evento.preco ? `<p style='font-size:1em;color:#b4580f;margin-top:2px;'>R$ ${evento.preco}</p>` : ''}
                    </div>
                    <div class="evento-arrow">
                        <img src="./img/seta.png" alt="Ver mais">
                    </div>
                </div>
            `;
        });
        
    } catch (error) {
        console.error('Erro ao filtrar eventos:', error);
        alert('Erro ao filtrar eventos. Por favor, tente novamente.');
    }
}

// Adicionar event listeners para os filtros
document.getElementById('tipo-evento').addEventListener('change', filtrarEventos);
document.getElementById('estado').addEventListener('change', filtrarEventos);
document.getElementById('quando').addEventListener('change', filtrarEventos);

// Função auxiliar para formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Função para buscar locais registrados
async function buscarLocaisRegistrados() {
    try {
        const response = await fetch('http://10.107.144.23:3030/v1/planify/evento/locais');
        if (!response.ok) throw new Error('Erro ao buscar locais');
        
        const data = await response.json();
        const locais = data.locais || [];
        
        // Organizar locais por estado
        const locaisPorEstado = {};
        locais.forEach(local => {
            if (!locaisPorEstado[local.estado]) {
                locaisPorEstado[local.estado] = new Set();
            }
            locaisPorEstado[local.estado].add(local.cidade);
        });
        
        // Atualizar o menu de estados e cidades
        const estadosLista = document.querySelectorAll('.estados-lista li');
        const cidadesLista = document.querySelector('.cidades-lista');
        
        if (estadosLista && cidadesLista) {
            estadosLista.forEach(li => {
                const estado = li.getAttribute('data-estado');
                if (!locaisPorEstado[estado]) {
                    li.style.display = 'none';
                } else {
                    li.style.display = 'block';
                    li.addEventListener('mouseenter', function() {
                        estadosLista.forEach(e => e.classList.remove('active'));
                        this.classList.add('active');
                        
                        cidadesLista.innerHTML = '';
                        Array.from(locaisPorEstado[estado]).forEach(cidade => {
                            const cidadeLi = document.createElement('li');
                            cidadeLi.textContent = cidade;
                            cidadesLista.appendChild(cidadeLi);
                        });
                    });
                }
            });
        }
        
        // Atualizar o select de estado
        const selectEstado = document.getElementById('estado');
        if (selectEstado) {
            const options = selectEstado.querySelectorAll('option');
            options.forEach(option => {
                const estado = option.value;
                if (!locaisPorEstado[estado]) {
                    option.style.display = 'none';
                } else {
                    option.style.display = 'block';
                }
            });
        }
        
    } catch (error) {
        console.error('Erro ao buscar locais:', error);
    }
}

// Chamar a função quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    carregarEventos();
});

// Adicionar estilo para o campo Quando
document.addEventListener('DOMContentLoaded', () => {
    const inputQuando = document.getElementById('quando');
    if (inputQuando) {
        inputQuando.style.color = '#fff';
    }
});

// Função para buscar e preencher os estados no filtro
async function preencherEstadosFiltro() {
    const selectEstado = document.getElementById('estado');
    if (!selectEstado) return;
    try {
        const response = await fetch('http://10.107.144.23:3030/v1/planify/estado');
        if (!response.ok) throw new Error('Erro ao buscar estados');
        const data = await response.json();
        // Tenta pegar o array de estados de diferentes formas
        const estados = Array.isArray(data) ? data : (data.estados || data.items || []);
        selectEstado.innerHTML = '<option value="">Selecione o estado</option>';
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla || estado.nome || estado.id;
            option.textContent = estado.nome;
            selectEstado.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao buscar estados:', error);
    }
}

// Função para buscar e preencher as cidades do estado selecionado
async function preencherCidadesFiltro() {
    const selectEstado = document.getElementById('estado');
    const selectCidade = document.getElementById('cidade');
    if (!selectEstado || !selectCidade) return;
    const estadoSelecionado = selectEstado.value;
    if (!estadoSelecionado) {
        selectCidade.innerHTML = '<option value="">Selecione o estado primeiro</option>';
        selectCidade.disabled = true;
        return;
    }
    try {
        const response = await fetch('http://10.107.144.23:3030/v1/planify/cidade');
        if (!response.ok) throw new Error('Erro ao buscar cidades');
        const data = await response.json();
        // Tenta pegar o array de cidades de diferentes formas
        const cidades = Array.isArray(data) ? data : (data.cidades || data.items || []);
        const cidadesFiltradas = cidades.filter(cidade => cidade.estado === estadoSelecionado || cidade.estadoSigla === estadoSelecionado);
        selectCidade.innerHTML = '';
        cidadesFiltradas.forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            selectCidade.appendChild(option);
        });
        selectCidade.disabled = cidadesFiltradas.length === 0;
        if (!cidadesFiltradas.length) {
            selectCidade.innerHTML = '<option value="">Nenhuma cidade encontrada</option>';
        }
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        selectCidade.disabled = true;
    }
}

// Função para preencher a cascata de estados
async function preencherCascataEstados() {
    const estadosLista = document.querySelectorAll('.estados-lista');
    if (!estadosLista.length) return;
    try {
        const response = await fetch('http://10.107.144.23:3030/v1/planify/estado');
        if (!response.ok) throw new Error('Erro ao buscar estados');
        const data = await response.json();
        const estados = Array.isArray(data) ? data : (data.estados || data.items || []);
        estadosLista.forEach(lista => {
            lista.innerHTML = '';
            estados.forEach(estado => {
                const li = document.createElement('li');
                li.setAttribute('data-estado', estado.sigla || estado.nome || estado.id);
                li.textContent = estado.nome;
                lista.appendChild(li);
            });
        });
    } catch (error) {
        console.error('Erro ao preencher cascata de estados:', error);
    }
}

// Função para preencher a cascata de cidades ao passar mouse em um estado
async function adicionarEventoCascataCidades() {
    const estadosListas = document.querySelectorAll('.estados-lista');
    const cidadesListas = document.querySelectorAll('.cidades-lista');
    if (!estadosListas.length || !cidadesListas.length) return;
    estadosListas.forEach(estadosLista => {
        estadosLista.addEventListener('mouseover', async function(e) {
            if (e.target.tagName !== 'LI') return;
            const estadoSigla = e.target.getAttribute('data-estado');
            cidadesListas.forEach(async cidadesLista => {
                cidadesLista.innerHTML = '<li>Carregando...</li>';
                try {
                    const response = await fetch('http://10.107.144.23:3030/v1/planify/cidade');
                    if (!response.ok) throw new Error('Erro ao buscar cidades');
                    const data = await response.json();
                    console.log(data)
                    const cidades = Array.isArray(data) ? data : (data.cidades || data.items || []);
                    console.log(cidadesLista)
                    const cidadesFiltradas = cidades.filter(cidade => cidade.estado === estadoSigla || cidade.estadoSigla === estadoSigla);
                    cidadesLista.innerHTML = '';
                    cidadesFiltradas.forEach(cidade => {

                      console.log(cidade);
                        const li = document.createElement('li');
                        li.textContent = extrairNome(cidade);
                        cidadesLista.appendChild(li);
                    });
                    if (!cidadesFiltradas.length) {
                        cidadesLista.innerHTML = '<li>Nenhuma cidade encontrada</li>';
                    }
                } catch (error) {
                  console.log(error);
                    cidadesLista.innerHTML = '<li>Erro ao carregar cidades</li>';
                }
            });
        });
    });
}

// Função utilitária para extrair o nome de cidade, estado ou objeto aninhado
function extrairNome(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) return extrairNome(obj[0]);
    if (obj.nome) return extrairNome(obj.nome);
    if (obj.cidade) return extrairNome(obj.cidade);
    if (obj.estado) return extrairNome(obj.estado);
    return JSON.stringify(obj);
  }
  return String(obj);
}

// Função para formatar o endereço do evento
function formatarEndereco(endereco) {
  if (Array.isArray(endereco)) endereco = endereco[0];
  if (!endereco || typeof endereco !== 'object') return '';
  return [
    extrairNome(endereco.rua),
    extrairNome(endereco.numero),
    extrairNome(endereco.bairro),
    extrairNome(endereco.cidade),
    extrairNome(endereco.estado)
  ].filter(Boolean).join(', ');
}

// Função robusta para extrair nome de estado e cidade de um endereço
function extrairEstadoCidade(endereco) {
  let estado = '';
  let cidade = '';
  if (!endereco) return { estado, cidade };
  // Cidade
  if (endereco.cidade && typeof endereco.cidade === 'object' && endereco.cidade.nome) {
    cidade = endereco.cidade.nome;
    // Estado dentro da cidade
    if (endereco.cidade.estado && typeof endereco.cidade.estado === 'string') {
      estado = endereco.cidade.estado;
    } else if (endereco.cidade.estado && typeof endereco.cidade.estado === 'object' && endereco.cidade.estado.nome) {
      estado = endereco.cidade.estado.nome;
    }
  }
  // Estado direto no endereço (caso exista)
  if (!estado && endereco.estado && typeof endereco.estado === 'object' && endereco.estado.nome) {
    estado = endereco.estado.nome;
  }
  return { estado, cidade };
}

// Função para montar o mapa de estados-cidades para cidades com base nos eventos
async function getMapaEstadosCidadesComEventos() {
  try {
    const response = await fetch('http://10.107.144.23:3030/v1/planify/evento');
    if (!response.ok) throw new Error('Erro ao buscar eventos');
    const data = await response.json();
    const eventos = Array.isArray(data) ? data : (data.eventos || data.items || []);
    console.log('EVENTOS:', eventos);
    const mapa = {};
    eventos.forEach(evento => {
      let endereco = evento.endereco;
      if (Array.isArray(endereco)) endereco = endereco[0];
      console.log('ENDERECO:', endereco);
      const { estado, cidade } = extrairEstadoCidade(endereco);
      console.log('ESTADO FINAL:', estado, 'CIDADE FINAL:', cidade);
      if (estado && cidade && estado.trim() && cidade.trim()) {
        if (!mapa[estado]) mapa[estado] = new Set();
        mapa[estado].add(cidade);
      } else {
        console.log('NÃO ADICIONADO AO MAPA:', { estado, cidade, endereco });
      }
    });
    // Converta os sets para arrays
    Object.keys(mapa).forEach(estado => {
      mapa[estado] = Array.from(mapa[estado]);
    });
    console.log('MAPA ESTADO-CIDADE FINAL:', mapa);
    return mapa;
  } catch (error) {
    console.error('Erro ao montar mapa de estados/cidades:', error);
    return {};
  }
}

// Função para preencher filtros e cascatas apenas com estados/cidades que têm eventos
async function preencherFiltrosComEventos() {
  const mapa = await getMapaEstadosCidadesComEventos();
  const estados = Object.keys(mapa);
  // Preencher select de estados
  const selectEstado = document.getElementById('estado');
  if (selectEstado) {
    selectEstado.innerHTML = '<option value="">Selecione o estado</option>';
    estados.forEach(estado => {
      const option = document.createElement('option');
      option.value = estado;
      option.textContent = estado;
      selectEstado.appendChild(option);
    });
  }
  // Preencher select de cidades (se existir) - só mostra cidades do estado selecionado
  const selectCidade = document.getElementById('cidade');
  if (selectCidade) {
    selectEstado?.addEventListener('change', function() {
      const estadoSelecionado = selectEstado.value;
      selectCidade.innerHTML = '<option value="">Selecione a cidade</option>';
      if (mapa[estadoSelecionado]) {
        mapa[estadoSelecionado].forEach(cidade => {
          const option = document.createElement('option');
          option.value = cidade;
          option.textContent = cidade;
          selectCidade.appendChild(option);
        });
        selectCidade.disabled = false;
      } else {
        selectCidade.disabled = true;
      }
    });
    // Inicialmente desabilitado
    selectCidade.innerHTML = '<option value="">Selecione o estado primeiro</option>';
    selectCidade.disabled = true;
  }
  // Preencher cascata de estados
  const estadosListas = document.querySelectorAll('.estados-lista');
  estadosListas.forEach(lista => {
    lista.innerHTML = '';
    estados.forEach(estado => {
      const li = document.createElement('li');
      li.setAttribute('data-estado', estado);
      li.textContent = estado;
      lista.appendChild(li);
    });
  });
  // Preencher cascata de cidades ao passar mouse em estado
  const cidadesListas = document.querySelectorAll('.cidades-lista');
  estadosListas.forEach((estadosLista, idx) => {
    estadosLista.addEventListener('mouseenter', function(e) {
      let estado;
      if (e.target.tagName === 'LI') {
        estado = e.target.getAttribute('data-estado');
      } else {
        // Se mouse entra na ul, não faz nada
        return;
      }
      cidadesListas[idx].innerHTML = '';
      if (mapa[estado]) {
        mapa[estado].forEach(cidade => {
          const li = document.createElement('li');
          li.textContent = cidade;
          cidadesListas[idx].appendChild(li);
        });
      } else {
        cidadesListas[idx].innerHTML = '<li>Nenhuma cidade encontrada</li>';
      }
    });
  });
}

// Chamar ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  preencherFiltrosComEventos();
});

// Preencher a cascata de estados e cidades com todos os dados da API
async function preencherCascataEstadosECidades() {
  // Buscar estados e cidades
  const responseEstados = await fetch('http://10.107.144.23:3030/v1/planify/estado');
  const estadosData = await responseEstados.json();
  const estados = Array.isArray(estadosData) ? estadosData : (estadosData.estados || estadosData.items || []);
  
  const responseCidades = await fetch('http://10.107.144.23:3030/v1/planify/cidade');
  const cidadesData = await responseCidades.json();
  const cidades = Array.isArray(cidadesData) ? cidadesData : (cidadesData.cidades || cidadesData.items || []);

  // Preencher estados
  const estadosLista = document.querySelector('.estados-lista');
  estadosLista.innerHTML = '';
  estados.forEach(estado => {
    const li = document.createElement('li');
    li.setAttribute('data-estado', estado.sigla || estado.nome || estado.id);
    li.textContent = estado.nome;
    estadosLista.appendChild(li);
  });

  // Evento para mostrar cidades ao passar mouse no estado
  const cidadesLista = document.querySelector('.cidades-lista');
  estadosLista.addEventListener('mouseover', function(e) {
    if (e.target.tagName !== 'LI') return;
    const estado = e.target.getAttribute('data-estado');
    cidadesLista.innerHTML = '';
    const cidadesFiltradas = cidades.filter(cidade =>
      cidade.estado === estado || cidade.estadoSigla === estado || cidade.estado?.sigla === estado
    );
    if (cidadesFiltradas.length) {
      cidadesFiltradas.forEach(cidade => {
        const li = document.createElement('li');
        li.textContent = cidade.nome;
        cidadesLista.appendChild(li);
      });
    } else {
      cidadesLista.innerHTML = '<li>Nenhuma cidade encontrada</li>';
    }
  });
}

window.addEventListener('DOMContentLoaded', preencherCascataEstadosECidades);