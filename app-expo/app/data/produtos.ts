import { Produto } from '..types';

export const produtos: Produto[] = [
  {
    id: 1,
    nome: "Produto Teste Python",
    descricao: "Esse é um produto teste",
    preco: 119.1,
    categoria: "camisa",
    estampa: 1,
    
    tamanhos: ["P", "M", "G", "GG"],
    imagemUrl: "https://via.placeholder.com/400x400"
  },
  {
    id: 2,
    nome: "Camisa TESTE",
    descricao: "Essa camisa é para teste",
    preco: 100.0,
    categoria: "oversized",
    estampa: 0,
    
    tamanhos: ["P", "M", "G", "GG"],
    imagemUrl: "https://via.placeholder.com/400x400"
  },
  {
    id: 3,
    nome: "Teste",
    descricao: "teste",
    preco: 100.0,
    categoria: "oversized",
    estampa: 0,
    
    tamanhos: ["M"],
    imagemUrl: "https://via.placeholder.com/400x400"
  },
  {
    id: 4,
    nome: "Camisa Oversized Jesus é King",
    descricao: "Camisa muito boa",
    preco: 110.0,
    categoria: "oversized",
    estampa: 1,
    
    tamanhos: ["P", "M", "G", "GG"],
    imagemUrl: "https://via.placeholder.com/400x400"
  },
];
