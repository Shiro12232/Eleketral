'use client';

import React, { useState } from 'react';

// Catálogo principal
const pecasCatalogo = [
  { id: 1, nome: 'Aro Work VS-XX', categoria: 'Rodas e Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/roda1.png', descricao: 'Aro esportivo de alta performance.' },
  { id: 2, nome: 'Calota Porsche Rim', categoria: 'Rodas e Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/roda2.png', descricao: 'Calota com acabamento premium.' },
  { id: 3, nome: 'Pneu Toyo Tires', categoria: 'Rodas e Pneus', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/roda3.png', descricao: 'Pneu aderente para alta velocidade.' },
  { id: 4, nome: 'Aerofólio Wing', categoria: 'Aerofólio', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/aerofolio.jpg', descricao: 'Aerofólio aerodinâmico em fibra.' },
  { id: 5, nome: 'Aerofólio GT', categoria: 'Aerofólio', precoOriginal: 'R$?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/aerofolio2.jpg', descricao: 'Estilo agressivo de pista.' },
  { id: 6, nome: 'Aerofólio Carbon', categoria: 'Aerofólio', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/aerofolio3.jpg', descricao: 'Fibra de carbono.' },
  { id: 7, nome: 'Escapamento Esportivo', categoria: 'Escapamento', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/escapamento5.jpg', descricao: 'Ronco encorpado e esportivo.' },
  { id: 8, nome: 'Escapamento Duplo', categoria: 'Escapamento', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/escapamento2.jpg', descricao: 'Saída dupla em inox.' },
  { id: 9, nome: 'Escapamento Inox', categoria: 'Escapamento', precoOriginal: 'R$ ?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/newescapamento3.png', descricao: 'Resistente a altas temperaturas.' },
  { id: 10, nome: 'Escapamento Race', categoria: 'Escapamento', precoOriginal: 'R$?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/escapamento4.jpg', descricao: 'Modelo de competição.' },
  { id: 11, nome: 'Escapamento Titanium', categoria: 'Escapamento', precoOriginal: 'R$?', precoPromo: 'R$ ?', precoNum: 1, imagem: '/newescapamento.png', descricao: 'Ultra leve em titânio.' },
];

export default function CatalogoPage() {
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const categoriasPecas = ['Todos', 'Rodas e Pneus', 'Escapamento', 'Aerofólio'];
  
  const itensFiltrados = filtroCategoria === 'Todos' 
    ? pecasCatalogo 
    : pecasCatalogo.filter(item => item.categoria === filtroCategoria);

  // colocar peça no localStorage e colocar no carrinho
  const adicionarAoCarrinho = (peca: typeof pecasCatalogo[0]) => {
    const carrinhoAtualStr = localStorage.getItem("carrinho_customizacao");
    let carrinhoAtual = [];
    
    try {
      carrinhoAtual = carrinhoAtualStr ? JSON.parse(carrinhoAtualStr) : [];
    } catch (e) {
      carrinhoAtual = [];
    }

    const novoItem = {
      nome: peca.categoria,
      detalhe: peca.nome,
      preco: peca.precoNum
    };

    carrinhoAtual.push(novoItem);

    const novoTotal = carrinhoAtual.reduce((acc: number, item: { preco: number }) => acc + item.preco, 0);

    localStorage.setItem("carrinho_customizacao", JSON.stringify(carrinhoAtual));
    localStorage.setItem("carrinho_total", novoTotal.toString());

    //  atualizar o contador da Navbar em tempo real
    window.dispatchEvent(new Event("storage_carrinho_atualizado"));

    // aviso de adicionado 
    setMensagemSucesso(`"${peca.nome}" foi adicionado ao carrinho!`);
    setTimeout(() => {
      setMensagemSucesso(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white pt-24 pb-16 px-4 md:px-8 relative">
      
      {/* Pop-up de sucesso */}
      {mensagemSucesso && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-2xl border border-purple-400 text-xs font-bold animate-bounce">
          {mensagemSucesso}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/*  desconto */}
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

          {/* Grid das peças */}
          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {itensFiltrados.map((item) => {
                return (
                  <div 
                    key={item.id} 
                    className="bg-zinc-900/60 border border-purple-500 overflow-hidden flex flex-col justify-between hover:border-purple-500/60
                     transition-all group shadow-lg relative"
                  >
                    {/* Tag de Desconto */}
                    <span className="absolute top-3 right-3 z-10 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg border border-purple-400/30">
                      -10% na 1ª compra
                    </span>

                    {/* Imagem */}
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
                      
                      {/* Botão ADICIONAR */}
                      <button 
                        onClick={() => adicionarAoCarrinho(item)} 
                        className="bg-purple-600/10 hover:bg-purple-600 border border-purple-500/30 text-white 
                        text-xs font-bold px-3 py-2 rounded-xl transition-all text-center cursor-pointer"
                      >
                        ADICIONAR AO CARRINHO
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* filtro quando nao tem nada */}
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