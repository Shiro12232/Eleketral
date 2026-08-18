'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- CATÁLOGO DE PEÇAS & KITS ---
const pecasCatalogo = [
  { id: 1, nome: 'Aro Work VS-XX', categoria: 'Rodas & Pneus', preco: 'R$ ?', imagem: '/roda1.png', descricao: 'descrição.' },
  { id: 2, nome: 'Calota Porsche Rim', categoria: 'Rodas & Pneus', preco: 'R$ ?', imagem: '/roda2.png', descricao: 'descrição.' },
  { id: 3, nome: 'Pneu Toyo Tires', categoria: 'Rodas & Pneus', preco: 'R$ ?', imagem: '/roda3.png', descricao: 'descrição' },
  { id: 4, nome: 'a4', categoria: '', preco: 'R$ ?', imagem: '/fundoInicio_upscaled.png', descricao: 'descrição' },
  { id: 5, nome: 'a5', categoria: 'a5', preco: 'R$ ?', imagem: '/fundoInicio_upscaled.png', descricao: 'descrição' },
  { id: 6, nome: 'a6', categoria: 'a6', preco: 'R$ ?', imagem: '/fundoInicio_upscaled.png', descricao: 'descrição' },
];

export default function CatalogoPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // Filtros que aparecem na lateral
  const categoriasPecas = ['Todos', 'Rodas & Pneus', 'Escapamento', 'Aerofolio'];
  
  // Lógica simples pra filtrar os itens na tela
  const itensFiltrados = filtroCategoria === 'Todos' 
    ? pecasCatalogo 
    : pecasCatalogo.filter(item => item.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mt-2">Catálogo de <span className="text-purple-500">Peças</span></h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          
          {/* Lado Esquerdo: Filtros */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h2 className="text-lg font-bold mb-6 border-b border-zinc-800 pb-2">
              Categorias de Peças
            </h2>
            <div className="flex flex-col gap-2">
              {categoriasPecas.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`text-left px-4 py-3 transition-all border rounded-xl cursor-pointer ${
                    filtroCategoria === cat
                      ? 'bg-zinc-800 border-purple-500 text-purple-400 font-bold'
                      : 'bg-zinc-900/50 border-zinc-800/50 text-gray-400 hover:border-purple-500/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          {/* Grid de Peças */}
          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensFiltrados.map((item) => {
                const linkHref = `/monte-seu-carro?modeloId=${item.id}`;

                return (
                  <div 
                    key={item.id} 
                    className="bg-zinc-900/60 border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/60 transition-all group shadow-lg"
                  >
                    {/* Imagem do item */}
                    <div className="relative w-full h-48 bg-zinc-950 overflow-hidden flex items-center justify-center">
                      <img 
                        src={item.imagem} 
                        alt={item.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100" 
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {item.categoria}
                      </span>
                    </div>

                    {/* Descrição */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                        {item.nome}
                      </h3>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                        {item.descricao}
                      </p>
                    </div>

                    {/* Preço e Botão */}
                    <div className="p-5 pt-0 flex items-center justify-between mt-2">
                      <span className="text-md font-extrabold text-white">{item.preco}</span>
                      <Link 
                        href={linkHref} 
                        className="bg-purple-600/10 hover:bg-purple-600 border border-purple-500/30 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all text-center cursor-pointer"
                      >
                        ADICIONAR
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Caso não ache nada */}
            {itensFiltrados.length === 0 && (
              <div className="text-center text-gray-500 py-20 border border-zinc-800/50 bg-zinc-900/20 rounded-2xl">
                Nenhum item encontrado nesta categoria.
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}