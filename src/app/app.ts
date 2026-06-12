import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Criando uma estrutura de dados para representar um produto
interface Produto { //Modelo de dados
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  total: number;
}

@Component({
  selector: 'app-root',
  imports: [
    FormsModule, CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  //Atributo para armazenar a URL base da API
  apiUrl: string = 'http://localhost:8081/api/v1/produtos';

  //Criando um objeto da biblioteca HttpClient
  httpClient = inject(HttpClient);

  //Variavel Signal para armazenar a lista de produtos obtida da API
  produtos = signal<any[]>([]);

  //Variavel signal para exibir mensagens e notificalções na pagina
  mensagem = signal<string>('');

  //Atributo para capturar o nome do produto
  nomeProduto: string = '';

  //Atributo para guardar os dados de um produto
  produtoSelecionado = signal<Produto>({
    id: 0, //Valor inicial exibido na tela
    nome: '', //Valor inicial exibido na tela
    descricao: '', //Valor inicial exibido na tela
    preco: 0, //Valor inicial exibido na tela
    quantidade: 0, //Valor inicial exibido na tela
    total: 0 //Valor inicial exibido na tela
  });

  //Atributo para guardar uma flag que indica se o formulário de cadastro 
  //ou de edição de produto deve ser exibido ou não
  exibirFormulario = signal<boolean>(false);


  //Função que será executada quando o usuário clicar no botão de pesquisa 
  pesquisarProdutos() {
    //Fazendo uma requisição GET para consultar os produtos na API
    this.httpClient
      .get<any[]>(`${this.apiUrl}/listar?nome=${this.nomeProduto}`)
      .subscribe((data) => { //Capturando a resposta da API
        this.produtos.set(data); //Armazenar os dados obtidos da API no signal
      });
  }

  //Função para ser executada quando clicarmos no botão de excluir
  excluirProduto(id: number) {
    if (confirm('Deseja realmente excluir o produto selecionado?')) {
      //Fazendo uma requisição HTTP DELETE para excluir o produto na API
      this.httpClient
        .delete(`${this.apiUrl}/excluir/${id}`, { responseType: 'text' }) //Especificando que a resposta da API será do tipo texto
        .subscribe((response) => {
          //Armazendo a resposta obtida pela API
          this.mensagem.set(response);
          //Atualizando a lista de produtos após a exclusão
          this.pesquisarProdutos();
        })
    }
  }

  //Função para exibir o formulario de cadastro de produto
  novoProduto() {
    this.exibirFormulario.set(true); //Exibir o formulário
    this.mensagem.set(''); //Limpar a mensagem exibida na tela
  }

  //Função para ocultar o formulário e limpar os valores dos campos
  cancelarEdicao() {
    this.exibirFormulario.set(false); //Ocultar o formulário
    this.produtoSelecionado.set({ //Limpar os valores dos campos do formulário
      id: 0,
      nome: '',
      descricao: '',
      preco: 0,
      quantidade: 0,
      total: 0
    });
  }

  //Função para relizar o cadstro do produto na API
  cadastrarProduto() {
    //Enviando uma requisição POST para a API
    this.httpClient.post(`${this.apiUrl}/criar`, this.produtoSelecionado(), { responseType: 'text' }) //Especificando que a resposta da API será do tipo texto
      .subscribe((response) => {
        this.mensagem.set(response);
        this.cancelarEdicao(); //Limpar os campos do formulário e ocultá-lo

        //Verificar se há uma consulta de produtos exibida na tela
        if(this.produtos().length > 0) {
          this.pesquisarProdutos(); //Executando a consulta
        }
      });
  }
}
