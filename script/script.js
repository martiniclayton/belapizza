  atualizarBotoesLogin();


console.log("Script de login carregado!");

let pizzas = [];
let complementos = [];
let bebidas = [];
let pizzaEdicao = {
    nome: "",
    descricao: "",
    preco: 0,
    observacao: ""
};

const loadPizzas = async (tipo) => {
    if (tipo == undefined) {
        tipo = "salgada";
    }
    const pizzasContainer = document.querySelector("#pizzasContainer");

    pizzas = await fetch('./mock/pizzas.json')
        .then(async response => await response.json())
    console.log(pizzas);
    console.log(tipo);

    let pizzasFiltradas = await pizzas.filter((pizza) => pizza.tipo === tipo);
    console.log(pizzasFiltradas);

    pizzasContainer.innerHTML = "";

    await pizzasFiltradas.forEach((pizza) => {
        pizzasContainer.innerHTML += `
        <div class="pizzas">
                <h2>${pizza.nome}</h2>
                <img src="${pizza.imagem}" width="150" alt="">
                <p>${pizza.descricao}</p>
                <span class="valor-pizza">R$ ${pizza.preco}</span>
                <button class="botao-adcpizza" onclick="adicionarCustomizacao(${pizza.id})">Adicionar ao Carrinho</button>
            </div>
        `
    });
}

function filtrarPizzas(tipo) {
    const tabsContainer = document.querySelector("#tabsContainer")
    const tabs = tabsContainer.getElementsByTagName("button");
    for (let tab of tabs) {
        tab.classList.remove("active");
        if (tab.id === tipo) {
            tab.classList.add("active");
        }
    };

    loadPizzas(tipo)
}

async function loadComplementos() {
    complementos = await fetch('./mock/complementos.json')
        .then(async response => await response.json())
    console.log(complementos);
}

async function loadBebidas() {
    bebidas = await fetch('./mock/bebidas.json')
       .then(async response => await response.json())
    console.log(bebidas);
}

window.addEventListener("load", () => {
    loadPizzas();
    loadComplementos();
    loadBebidas();
})


const buttonOpenLogin = document.querySelector("#botaoLogin")
const modalLogin = document.querySelector("#modalLogin")
const modalPizzaCustomizador = document.querySelector("#modalPizzaCustomizador")
const overlay = document.querySelector("#overlay")

buttonOpenLogin.onclick = function () {
    modalLogin.showModal();
    overlay.style.display = "block";
}
modalLogin.addEventListener("close", (e) => {
    overlay.style.display = "none";
})

window.addEventListener("click", (e) => {
    if (e.target === modalLogin) {
        modalLogin.close()
        overlay.style.display = "none";
    }
})

const fecharModalLogin = document.getElementById("fechar-modal-login")

fecharModalLogin.onclick = function(){
    modalLogin.close()
}

let cart = []
let total = 0;

function adicionarCustomizacao(id) {
    templateCustomizador(id);
    modalPizzaCustomizador.showModal();
    overlay.style.display = "block";    
}

modalPizzaCustomizador.addEventListener("close", (e) => {
    overlay.style.display = "none";
})

window.addEventListener("click", (e) => {
    if (e.target === modalPizzaCustomizador) {
        modalPizzaCustomizador.close()
        overlay.style.display = "none";
    }
})

const atualizarPreco = (pizzaPrecoInicial) => {
    let precoTotal = 0;
    const tipoMassa = document.getElementById("tipo-massa")?.value || "massa-fina";
    const tipoBorda = document.getElementById("tipo-borda")?.value || "sem-borda";
    const complementosSelecionados = document.querySelectorAll(".complementos input:checked");
    const bebidaSelecionada = document.getElementById("bebida")?.value || "sem-bebida";
    let preco = pizzaPrecoInicial;
    pizzaEdicao.descricao = "Massa Fina"

    if (tipoMassa === "massa-media") {
        preco += 5;
        pizzaEdicao.descricao = "Massa Media"
    } else if (tipoMassa === "massa-grossa") {
        preco += 10;
        pizzaEdicao.descricao = "Massa Grossa"
    }

    if (tipoBorda === "borda-catupiry") {
        preco += 5;
        pizzaEdicao.descricao += " com borda catupiry"
    } else if (tipoBorda === "borda-calabresa") {
        preco += 5;
        pizzaEdicao.descricao += " com borda calabresa"
    } else if (tipoBorda === "borda-frango") {
        preco += 5;
        pizzaEdicao.descricao += " com borda frango"
    } else {
        pizzaEdicao.descricao += " sem borda"
    }

    complementosSelecionados.forEach(complemento => {
        console.log(complemento);
        let temp = complementos.find(item => item.id === parseInt(complemento.value));
        preco += parseFloat(temp.preco);
        pizzaEdicao.descricao += `, adicional ${temp.nome}`
    });

    if (bebidaSelecionada !== "sem-bebida") {
        const bebida = bebidas.find(bebida => bebida.id === parseInt(bebidaSelecionada));
        console.log(bebida);
        preco += parseFloat(bebida.preco);
        pizzaEdicao.descricao += `, acompanha bebida ${bebida.nome}`
    }

    precoTotal = preco;
    const precoTotalElement = document.getElementById("cm-precoTotal");
    precoTotalElement.textContent = `R$ ${precoTotal.toFixed(2)}`;
    pizzaEdicao.preco = precoTotal;
    return precoTotal;
}

function atualizaObservacao() {
    const observacoes = document.getElementById("observacoes").value;
    pizzaEdicao.observacao = observacoes;
}

function templateCustomizador(pizzaId) {
    const pizzaSelecionada = pizzas.find((pizza) => pizza.id === pizzaId);
    console.log(pizzaSelecionada);
    const pizzaPrecoInicial = pizzaSelecionada.preco;

    // Inicializa a pizzaEdicao com os valores padrões
    pizzaEdicao.nome = pizzaSelecionada.nome;
    pizzaEdicao.descricao = "Massa Fina, Sem Borda, Sem Bebida";
    pizzaEdicao.preco = pizzaSelecionada.preco;
    pizzaEdicao.observacao = "";
    

    modalPizzaCustomizador.innerHTML = ""
    modalPizzaCustomizador.innerHTML = `        
        <div class="customizador">           
            <div class="two-columns">
                <div class="column preview">
                    <img src="${pizzaSelecionada.imagem}" width="150px" alt="Pizza Preview">
                    <h2>${pizzaSelecionada.nome}</h2>
                    <p>${pizzaSelecionada.descricao}</p>
                    <span id="cm-precoTotal" class="valor-pizza">R$ ${pizzaSelecionada.preco}</span>
                </div>
                <div class="column form">
                <div class="logoCustomizador">
                    <h4>Customize seu pedido!</h4>
                </div>
                    <label for="tipo-massa">Tipo de Massa</label>
                    <select id="tipo-massa" onchange="atualizarPreco(${pizzaPrecoInicial})">
                        <option value="massa-fina">Massa Fina</option>
                        <option value="massa-media">Massa Media</option>
                        <option value="massa-grossa">Massa Grossa</option>
                    </select>

                    <label for="tipo-borda">Selecione o tipo de borda</label>
                    <select id="tipo-borda" onchange="atualizarPreco(${pizzaPrecoInicial})">
                        <option value="sem-borda">Sem Borda</option>
                        <option value="borda-catupiry">Borda Catupiry</option>
                        <option value="borda-calabresa">Borda Calabresa</option>
                        <option value="borda-frango">Borda Frango</option>
                    </select>

                    <label for="complementos">Complementos extras</label>
                    <div class="complementos">
                        ${complementos.filter(item => item.tipo === pizzaSelecionada.tipo).map(complemento => `
                            <label for="${complemento.id}">
                                <input type="checkbox" id="${complemento.id}" value="${complemento.id}" onchange="atualizarPreco(${pizzaPrecoInicial})">
                                ${complemento.nome} - R$ ${complemento.preco}
                            </label>
                        `).join('')}
                    </div>

                    <label for="bebida">Selecione a bebida</label>
                    <select id="bebida" onchange="atualizarPreco(${pizzaPrecoInicial})">
                        <option value="sem-bebida">Sem Bebida</option>
                        ${bebidas.map(bebida => `
                            <option value="${bebida.id}">${bebida.nome} - R$ ${bebida.preco}</option>
                        `).join('')}
                    </select>

                    <label for="observacoes">Observações</label>
                    <textarea id="observacoes" rows="4" cols="50" onchange="atualizaObservacao()" ></textarea>

                    <button class="botao-adcpizza" onclick="adicionarAoCarrinho()">Adicionar ao Carrinho</button>
                    <a id="fechar-modal-pizza" onclick="fecharModalCustomizador()"><i class="fa-solid fa-circle-xmark"></i></a>
                </div>
            </div>
    `
}


function adicionarAoCarrinho() {
    cart.push({ item: pizzaEdicao.nome, preco: pizzaEdicao.preco, descricao: pizzaEdicao.descricao, observacao: pizzaEdicao.observacao });
    console.log(cart);
    total += pizzaEdicao.preco;
    modalPizzaCustomizador.close();
    overlay.style.display = "none";
    atualizarCarrinho()
    const carrinho = document.querySelector(".carrinho");
    carrinho.scrollIntoView({ behavior: "smooth" });
}

function atualizarCarrinho() {
    const cartList = document.getElementById("cart");
    const totalElement = document.getElementById("total");

    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        const row = document.createElement("tr");
        const itemColuna = document.createElement("td");
        itemColuna.textContent = item.item + " - " + item.descricao + " - " + item.observacao;

        const precoColuna = document.createElement("td")
        precoColuna.textContent = `R$ ${item.preco.toFixed(2)}`;

        const botaoRemoverColuna = document.createElement("td");
        const remove = document.createElement("button");
        remove.textContent = "Remover";

        remove.addEventListener("click", () => {
            total -= item.preco;
            cart.splice(index, 1);
            atualizarCarrinho()
        })

        botaoRemoverColuna.appendChild(remove);

        row.appendChild(itemColuna);
        row.appendChild(precoColuna);
        row.appendChild(botaoRemoverColuna);

        cartList.appendChild(row)
    })

    totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function getParam(name){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

window.addEventListener("DOMContentLoaded", ()=>{
    const modalLogin = document.querySelector("#modalLogin")
    if(getParam("modal")==="abrir"){
        modalLogin.showModal();
        overlay.style.display = "block";
    }
    console.log("DOM totalmente carregado")
    atualizarBotoesLogin();
})

const checkLoginButton = setInterval(() => {
    const btnEntrar = document.querySelector("#entrar-login");

    if (btnEntrar) {
        clearInterval(checkLoginButton);

        btnEntrar.addEventListener("click", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#email-login");
            const senha = document.querySelector("#senha-login");
            const erro = document.querySelector("#p");
            btnEntrar.parentElement.appendChild(erro); 

            const loginData = {
                login: email.value,
                senha: senha.value
            };

            try {
                const response = await fetch("https://pizzaria-api-45n7.onrender.com/api/Autenticacao/Login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(loginData)
                });

                if (!response.ok) {
                    throw new Error("Falha no login");

                }

                const data = await response.json();
                console.log("Resposta da API de login:", data);
                localStorage.setItem("clienteId", data.idCliente);
                localStorage.setItem("usuarioLogado", data.email);

                const user = localStorage.getItem("usuarioLogado");
                console.log(user)
                
                atualizarBotoesLogin();
                modalLogin.close();
                overlay.style.display = "none";
                erro.textContent = ""
                alert("Login realizado com sucesso!");

            } catch (error) {
                console.error("Erro ao fazer login:", error);
                erro.style.color = 'red'
                if(email.value ==="" || senha.value === ""){
                    erro.textContent = "Insira os dados para login"
                }else{
                    erro.textContent = "E-mail ou senha incorretos"
                }
            }
        });
    }
}, 100);

function menuToggle(){
    const nav = document.getElementById("botoesNav")
    nav.classList.toggle("show")
}

function fecharModalCustomizador(){
    modalPizzaCustomizador.close()
}

function atualizarCarrinhoStorage(){
    const carrinho = []
    const linhas = document.querySelectorAll("#cart tr");

    linhas.forEach(linha =>{
        const item = linha.children[0].textContent;
        const preco = linha.children[1].textContent;
        carrinho.push({item, preco});
    });

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

document.getElementById("btn-finalizar").addEventListener("click", () => {
    if(!localStorage.getItem("clienteId")){
        alert("Você precisa estar logado")
        modalLogin.showModal();
        overlay.style.display = "block";
    }
    else{
        if (cart.length === 0) {
            alert("Seu carrinho está vazio");
        } else {
            atualizarCarrinhoStorage();
            window.location.href = "checkout.html";
        }
    }
  });
  
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  
  const corpoResumo = document.getElementById("cart-resumo");
  carrinho.forEach(item => {
    const tr = document.createElement("tr");
  
    const tdItem = document.createElement("td");
    tdItem.textContent = item.item;
  
    const tdPreco = document.createElement("td");
    tdPreco.textContent = item.preco;
  
    tr.appendChild(tdItem);
    tr.appendChild(tdPreco);
    corpoResumo.appendChild(tr);
  });

  function atualizarBotoesLogin() {
  const btnEntrar = document.querySelector(".menuTopo");
  const btnSair = document.querySelector(".menuTopoSair");

  if (localStorage.getItem("clienteId")) {
    btnEntrar.classList.add("fechar");
    btnSair.classList.add("abrir");
  } else {
    btnEntrar.classList.remove("fechar");
    btnSair.classList.remove("abrir");
  }
}


  function sairSessao(){
    localStorage.removeItem("clienteId")
    localStorage.removeItem("usuarioLogado")
    localStorage.removeItem("carrinho")
    window.location.href = "index.html"
    atualizarBotoesLogin();
    
  }
window.addEventListener("pageshow", () => {
  atualizarBotoesLogin();
});
/* if (!localStorage.getItem("clienteId")) {
        window.location.href = "index.html?modal=abrir";
    }*/