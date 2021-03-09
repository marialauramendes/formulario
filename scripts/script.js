
//Máscaras com Jquery

$(document).ready(function () {
  var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
  }, spOptions = {
    onKeyPress: function (val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
    }
  };

  if ($("#cep").length > 0) {
    $("#cep").mask('99.999-999');
  } 
  if ($("#telefone").length > 0) {
    $('#telefone').mask(SPMaskBehavior, spOptions);
  }

});



//fetch para busca e preenchimento do endereço através da API viacep
// Os campos que devem ser preenchidos pelo fetch são selecionados pelo id do input e vinculados a uma variável
const inputCep = document.querySelector('#cep');
const resultadoLogradouro = document.querySelector('#logradouro');
const resultadoComplemento = document.querySelector('#complemento');
const resultadoBairro = document.querySelector('#bairro');
const resultadoCidade= document.querySelector('#cidade');
const resultadoEstado = document.querySelector('#estado');


// Adicionado um eventListener para identificar quando o campo de inputCep for alterado e assim lidar com a busca, só inicia a funcao callback quando o usuario apertar enter ou tab no teclado e passar para o proximo campo
inputCep.addEventListener('change', handleSearch);

//função para busca do cep digitado
function handleSearch(event) {
  event.preventDefault();
  const cep = inputCep.value;
  buscaCep(cep);
}

//funcao para realizar o fetch e preencher cada campo com o valor do objeto json retornado pela funcao. 

function buscaCep(cep) {
  //replace utilizado para retirar a mascara e realizar a busca apenas com os digitos do input
  var cep = cep.replace(/\D/g, '');

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
  .then(response => response.json())
  .then(cepJson => {
    resultadoLogradouro.value= cepJson.logradouro;
    resultadoComplemento.value= cepJson.complemento;
    resultadoBairro.value= cepJson.bairro;
    resultadoCidade.value= cepJson.localidade;
    resultadoEstado.value= cepJson.uf;
  })
 
}

// Validação preenchimento dos campos.

const fields = document.querySelectorAll("[required]")

function ValidateField(field) {
    // logica para verificar se existem erros
    function verifyErrors() {
        let foundError = false;

        for(let error in field.validity) {
            // se não for customError
            // então verifica se tem erro
            if (field.validity[error] && !field.validity.valid ) {
                foundError = error
            }
        }
        return foundError;
    }

    function customMessage(typeError) {
        const messages = {
            text: {
                valueMissing: "* Por favor, preencha este campo"
            },
            email: {
                valueMissing: "Email é obrigatório",
                typeMismatch: "Por favor, preencha um email válido."
            }
        }

        return messages[field.type][typeError]
    }

    function setCustomMessage(message) {
        const spanError = field.parentNode.querySelector("span.error")
        
        if (message) {
            spanError.classList.add("active")
            spanError.innerHTML = message
        } else {
            spanError.classList.remove("active")
            spanError.innerHTML = ""
        }
    }

    return function() {

        const error = verifyErrors()

        if(error) {
            const message = customMessage(error)

            field.style.borderColor = "#e14747";
            setCustomMessage(message)
        } else {
            field.style.borderColor = "#1ED271";
            setCustomMessage()
        }
    }
}


function customValidation(event) {

    const field = event.target
    const validation = ValidateField(field)
    validation()

}

for( field of fields ){
    field.addEventListener("invalid", event => { 
        // eliminar o bubble da mensagem de erro padrao do html
        event.preventDefault()

        customValidation(event)
    })
    field.addEventListener("blur", customValidation)
}

// o alerta com a confirmacao do envio do formulario só será exibido se não houver erro no preenchimento. 
document.querySelector("form")
.addEventListener("submit", event => {
    alert("Formulário enviado com sucesso, obrigado!");

    event.preventDefault()
})

