class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validar_dados(){
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd {
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id',0)
        }
    }

    get_proximo_id() {
        let proximo_id = localStorage.getItem('id')
        return parseInt(proximo_id) + 1 
    }

    gravar(d){
        //Acesso ao local storage
        //localStorage.setItem('despesa', JSON.stringify(d))//Coloca apenas um item
        let id = this.get_proximo_id()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperar_todos_registros(){

        //array despesas
        let despesas = Array()

        //console.log('Estamos chegando até aqui')
        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            //recupera a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //teste a possibilidade de haver indices que foram removidos entao ele pula os indices
            if(despesa === null){
                continue //inicia o próximo laço
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return(despesas)
    }

    pesquisar(despesa){
        let despesas_filtradas = Array()
        despesas_filtradas = this.recuperar_todos_registros()

        //ano
        if(despesa.ano != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.valor == despesa.valor)
        }
        return despesas_filtradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrar_despesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validar_dados()){
        bd.gravar(despesa)
        console.log('Dados válidos!')
        document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido'
        document.getElementById('descricao_modal').innerHTML = 'Despesa foi cadastrada com sucesso!'
        document.getElementById('modal_voltar').innerHTML = 'Voltar'
        document.getElementById('exampleModalLabel').className = 'text-success'
        document.getElementById('modal_voltar').className = 'btn-success'
        
        //Também dá certo ↓ 
        //document.querySelector('#exampleModalLabel').classList.add('text-success')
        //document.querySelector('#modal_voltar').classList.add('btn-success')
        $('#gravacao').modal('show')

        //limpa formulários após o cadastro anterior
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else{
        console.log('Dados inválidos!')        
        document.getElementById('exampleModalLabel').innerHTML = 'Erro na gravação'
        document.getElementById('descricao_modal').innerHTML = 'Existem campos obrigatórios que não foram preenchidos!'
        document.getElementById('modal_voltar').innerHTML = 'Voltar e Corrigir'
        document.getElementById('exampleModalLabel').className = 'text-danger'
        document.getElementById('modal_voltar').className = 'btn-danger'
        
        //Também dá certo ↓
        //document.querySelector('#exampleModalLabel').classList.add('text-danger')
        //document.querySelector('#modal_voltar').classList.add('btn-danger')   
        $('#gravacao').modal('show')     
    } 
}

function carrega_lista_despesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperar_todos_registros()
    }

    //selecionando o elemento tbody da tabela
    let lista_despesas = document.getElementById('lista_despesas')
    lista_despesas.innerHTML = ''
    //console.log(despesas)

    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d){ //O "d" é uma função de CALLBACK

        //criando linha (tr)
        let linha = lista_despesas.insertRow()

        //inserir valores - criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-time"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisar_despesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carrega_lista_despesas(despesas, true)
}