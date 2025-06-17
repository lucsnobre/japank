'use strict'

import { getCategoria } from "../../fetch/categoria.js";
import { getEstados } from "../../fetch/estado.js";
import { getCidades } from "../../fetch/cidade.js";
import { postEvento } from "../../fetch/evento.js";

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

    const imagemPlaceholder = document.getElementById('image-placeholder')
    const input = document.getElementById('imagem-divulgacao')
    const placeholderContent = document.getElementsByClassName('placeholder')
    const imagemEvento = document.getElementById('imgEvento')

    imagemPlaceholder.addEventListener('click', async () => {

        input.click()

    })

    input.addEventListener('change', async () => {

        if(input.files[0]){
            
            Array.from(placeholderContent).forEach((e) => {

                e.classList.add('hidden')

            })

            imagemEvento.classList.remove('hidden')

            const reader = new FileReader();
            reader.onload = function(e){
                
            imagemEvento.style.backgroundImage = `url('${e.target.result}')`
            }

            reader.readAsDataURL(input.files[0]); // << ISSO É ESSENCIAL
        }

        // await enviarImagem(input.files[0])

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


async function triggerEstado(){

    let estadoSelect = document.getElementById('estado')
    let cidade = document.getElementById('cidade')
    let estado

    estadoSelect.addEventListener('change', async () => {

        estado = estadoSelect.options[estadoSelect.selectedIndex].value
        
        await liberarEstado()

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

    })

}

//chamado quando o estado mudar
async function liberarEstado(){

    const cidade = document.getElementById('cidade')
    const estado = document.getElementById('estado')

    cidade.replaceChildren('')

    if(!estado){
        cidade.textContent = 'Selecione um estado primeiro'
        cidade.disabled = true
    }else{

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

            
        });

    }

}

async function publicarEvento(){

    const foto_capa = await enviarImagem(document.getElementById('imagem-divulgacao').files[0])
    const nomeEvento = document.getElementById('nome-evento')
    const descricaoEvento = document.getElementById('descricao-evento')
    const categoriaEvento = document.getElementById('categoria')
    const cidadeEvento = document.getElementById('cidade').options[document.getElementById('cidade').selectedIndex]
    const dataEvento = document.getElementById('data')
    const hora_inicio = document.getElementById('hora-inicio')
    const hora_termino = document.getElementById('hora-termino')
    const ruaEvento = document.getElementById('rua')
    const bairroEvento = document.getElementById('bairro')
    const numeroEvento = document.getElementById('numero')


    const endereco = {
        bairro: bairroEvento.value,
        rua: ruaEvento.value,
        numero: numeroEvento.value,
        id_cidade: cidadeEvento.value
    }

    const evento = {
        capa: foto_capa,
        descricao: descricaoEvento.value,
        nome: nomeEvento.value,
        data: dataEvento.value,
        hora_inicio: `${dataEvento.value}T${hora_inicio.value}:00`,
        hora_termino: `${dataEvento.value}T${hora_termino.value}:00`,
        id_usuario: JSON.parse(localStorage.getItem('usuario')).id,
        id_categoria: categoriaEvento.value,
        endereco: endereco
}

console.log(evento)

    const response = await postEvento(evento)

    console.log(response)

    if(response.status_code == 200){

        alert('Evento criado com sucesso')

        return true
    }else if(response.status_code == 400){
        alert('Preencha os dados novamente!')

        return false
    }else{
        alert('Ocorreu um problema ao verificar os dados. Tente novamente.')

        return false
    }
    
}

function verificaLogin(){

    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if(usuario){
        return usuario
    }else{
        return false
    }

}

const botao = document.getElementById('botao')

botao.addEventListener('click', async function(){


    

    let post = await publicarEvento()

    if(post){

        botao.disabled = true
        setInterval(() => {

            window.location.href = '../../index.html'

            botao.disabled = false
            
        }, 1000);
    }

})

document.getElementById('logo').addEventListener('click', () => {

    window.location.href = '../../index.html'

})

document.addEventListener('DOMContentLoaded', async () => {

    await adicionarCategoriasSelect()
    await adicionarEstadosSelect()
    await triggerEstado()
    
    await triggerUpload()

    const userExists = await verificaLogin()

    if(userExists){
        document.getElementById('iconeUser').src = userExists.foto_perfil
    }else{
        window.location.href = '../../index.html'
    }
})