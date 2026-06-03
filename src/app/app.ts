import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  //Criando um objeto da biblioteca HttpClient
  httpClient = inject(HttpClient);

  //Atributo para capturar o nome do produto
  nomeProduto: string = '';

  //Função que será executada quando o usuário clicar no botão de pesquisa 
  pesquisarProdutos() {
    //Fazendo uma requisição GET para consultar os produtos na API
    this.httpClient
      .get('http://localhost:8081/api/v1/produtos/listar?nome=' + this.nomeProduto)
      .subscribe((data) => { //Capturando a resposta da API
        console.log(data); //Exibindo a resposta no console do navegador
      });
  }
}
