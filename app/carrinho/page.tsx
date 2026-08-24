'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface ItemCarrinho {
  nome: string;
  detalhe: string;
  preco: number;
  imagem?: string; // Adicionado para suportar a imagem do produto
}

export default function CarrinhoPage() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [total, setTotal] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    const itensSalvos = localStorage.getItem("carrinho_customizacao");
    const totalSalvo = localStorage.getItem("carrinho_total");

    if (itensSalvos) {
      try {
        setItens(JSON.parse(itensSalvos));
      } catch (e) {
        setItens([]);
      }
    }

    if (totalSalvo) {
      setTotal(Number(totalSalvo));
    }
  }, []);

  const limparCarrinho = () => {
    localStorage.removeItem("carrinho_customizacao");
    localStorage.removeItem("carrinho_total");
    setItens([]);
    setTotal(0);
    window.dispatchEvent(new Event("storage_carrinho_atualizado"));
  };

  const finalizarCompra = () => {
    setFinalizado(true);
    limparCarrinho();
  };

  // Tela de Sucesso (Mais calorosa)
  if (finalizado) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-zinc-900/80 border border-purple-500/30 p-10 rounded-2xl max-w-lg w-full flex flex-col items-center gap-6 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 border border-purple-500/40">
            <CheckCircle2 size={40} className="animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-wide">Tudo pronto!</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Recebemos o seu pedido com sucesso. 
            </p>
          </div>
          <Link href="/" className="w-full bg-purple-600 hover:bg-purple-700 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-purple-600/30 cursor-pointer">
            Voltar para o Início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white pt-28 px-6 pb-20 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        
        {/* Cabeçalho da página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">

            </div>
            <h1 className="text-3xl font-black">Revisar seus Itens</h1>
          </div>
          
        </div>

        {/* Se o carrinho estiver vazio */}
        {itens.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-16 rounded-3xl text-center flex flex-col items-center gap-5 shadow-inner">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center text-gray-500">
              <ShoppingCart size={32} />
            </div>
            <div className="flex flex-col gap-1 max-w-xs">
              <h2 className="text-lg font-bold text-gray-200">Sua garagem está vazia</h2>
              <p className="text-xs text-gray-400">Você ainda não escolheu nenhuma peça ou customizou nenhum carro.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link href="/catalogo" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 cursor-pointer">
                Ver Catálogo
              </Link>
              <Link href="/monte-seu-carro" className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl text-xs font-bold transition-all border border-zinc-700 cursor-pointer">
                Monte seu Carro
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Lista de Itens (Ocupa 2 colunas) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Peças Selecionadas ({itens.length})</span>
                <button onClick={limparCarrinho} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Trash2 size={14} /> Esvaziar carrinho
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {itens.map((item, index) => (
                  <div key={index} className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all hover:border-purple-500/40">
                    <div className="flex items-center gap-3.5">
                      {/* Substituído o ícone Wrench pela imagem do produto (ou placeholder se não tiver) */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                        {item.imagem ? (
                          <img src={item.imagem} alt={item.detalhe} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-gray-500"></span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">{item.nome}</span>
                        <span className="text-sm font-extrabold text-white capitalize">{item.detalhe}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-purple-400 shrink-0">
                      {item.preco === 0 ? "Incluso" : `R$ ${item.preco.toLocaleString('pt-BR')}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo do Pedido (Ocupa 1 coluna ao lado) */}
            <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-6 shadow-xl sticky top-28 backdrop-blur-md">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">Resumo do Pedido</h2>
              
              <div className="flex flex-col gap-3 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal das peças</span>
                  <span className="text-white font-medium">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Instalação</span>
                  <span className="text-emerald-400 font-medium">Grátis</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Valor Total</span>
                <span className="text-2xl font-black text-purple-400">R$ {total.toLocaleString('pt-BR')}</span>
              </div>

              <button 
                onClick={finalizarCompra}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-600/30 text-xs uppercase tracking-wider cursor-pointer"
              >
                Concluir Pedido
              </button>

              
            </div>

          </div>
        )}

      </div>
    </main>
  );
}