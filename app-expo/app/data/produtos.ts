import { Produto } from '../types';

export const produtos: Produto[] = [
  {
    id: 7,
    nome: "Oversized Jesus is king",
    descricao: "Camisa de algodão",
    preco: 110.0,
    categoria: "oversized",
    estampa: 0,
    
    tamanhos: ["P", "M", "G", "GG"],
    imagemUrl: "n"
  },
  {
    id: 8,
    nome: "Oversized 70x7 Marrom",
    descricao: "Cor Marrom, tecido otimo",
    preco: 109.99,
    categoria: "oversized",
    estampa: 1,
    
    tamanhos: ["P", "M", "G"],
    imagemUrl: "https://via.placeholder.com/400x400"
  },
];
