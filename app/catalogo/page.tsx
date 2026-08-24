'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// catalogo principal
const pecasCatalogo = [
  { id: 1, nome: 'Aro Work VS-XX', categoria: 'Rodas & Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', imagem: '/roda1.png', descricao: 'descrição.' },
  { id: 2, nome: 'Calota Porsche Rim', categoria: 'Rodas & Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', imagem: '/roda2.png', descricao: 'descrição.' },
  { id: 3, nome: 'Pneu Toyo Tires', categoria: 'Rodas & Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', imagem: '/roda3.png', descricao: 'descrição' },
  { id: 4, nome: 'Aerofolio Spoiler', categoria: 'Aerofolio', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', imagem: '/aerofolio.jpg', descricao: 'descrição' },
  { id: 5, nome: 'Aerofolio', categoria: 'Aerofolio', precoOriginal: 'R$ ? ', precoPromo: 'R$ ?', imagem: '/aerofolio2.jpg', descricao: 'descrição' },
  { id: 6, nome: 'Aerofolio', categoria: 'Aerofolio', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', imagem: '/aerofolio3.jpg', descricao: 'descrição' },
  { id: 7, nome: 'Aerofolio', categoria: 'Escapamento', precoOriginal: 'R$', precoPromo: 'R$ ?', imagem: '/escapamento5.jpg', descricao: ''},
  { id: 8, nome: 'Escapamento', categoria: 'Escapamento', precoOriginal: 'R$', precoPromo: 'R$ ?', imagem: '/escapamento2.jpg', descricao: ''},
  { id: 9, nome: 'Escapamento', categoria: 'Escapamento', precoOriginal: 'R$', precoPromo: 'R$ ?', imagem: '/newescapamento3.png', descricao: ''},
  { id: 10, nome: 'Escapamento', categoria: 'Escapamento', precoOriginal: 'R$', precoPromo: 'R$ ?', imagem: '/escapamento4.jpg', descricao: ''},
  { id: 11, nome: 'Escapamento', categoria: 'Escapamento', precoOriginal: 'R$', precoPromo: 'R$ ?', imagem: '/newescapamento.png', descricao: ''},

];

export default function CatalogoPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // filtro
  const categoriasPecas = ['Todos', 'Rodas & Pneus', 'Escapamento', 'Aerofolio'];
  
  // Lógica do filtro
  const itensFiltrados = filtroCategoria === 'Todos' 
    ? pecasCatalogo 
    : pecasCatalogo.filter(item => item.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* titulo principal e o desconto */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mt-2">Catálogo de <span className="text-purple-500">Peças</span></h1>
            <p className="text-gray-400 text-sm mt-1">Use o cupom de <span className="text-purple-400 font-bold">10% de desconto </span> na primeira compra!</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8">
          
          {/* Lado Esquerdo do Filtro */}
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

          {/* grid das peças */}
          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itensFiltrados.map((item) => {
                const linkHref = `/monte-seu-carro?modeloId=${item.id}`;

                return (
                  <div 
                    key={item.id} 
                    className="bg-zinc-900/60 border border-purple-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/60 transition-all group shadow-lg relative"
                  >
                    {/* Tag de Desconto */}
                    <span className="absolute top-3 right-3 z-10 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg border border-purple-400/30">
                      -10% na 1ª compra
                    </span>

                    {/* Imagem  */}
                    <div className="relative w-full h-48 bg-zinc-950 overflow-hidden flex items-center justify-center">
                      <img 
                        src={item.imagem} 
                        alt={item.nome} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100" 
                      />
                      <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10">
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
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 line-through">{item.precoOriginal}</span>
                        <span className="text-md font-extrabold text-purple-400">{item.precoPromo}</span>
                      </div>
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