'use client';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { User, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [qtdItens, setQtdItens] = useState(0);

  useEffect(() => {
    // Função para verificar quantos itens estão salvos no carrinho
    const atualizarContador = () => {
      const itensSalvos = localStorage.getItem("carrinho_customizacao");
      if (itensSalvos) {
        try {
          const parsed = JSON.parse(itensSalvos);
          setQtdItens(parsed.length);
        } catch (e) {
          setQtdItens(0);
        }
      } else {
        setQtdItens(0);
      }
    };

    // Executa ao carregar o componente na tela
    atualizarContador();

    // Ouve o evento disparado pelo configurador 3D quando o usuário clica em adicionar
    window.addEventListener("storage_carrinho_atualizado", atualizarContador);
    
    return () => {
      window.removeEventListener("storage_carrinho_atualizado", atualizarContador);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0a0c] text-white shadow-lg py-4 px-8 flex items-center justify-between z-50 border-b border-gray-800">
      
      {/* Logo  */}
      <div className="flex flex-col w-1/4">
        <span className="text-lg font-black tracking-widest text-white italic">
          ELEKETRAL
        </span>
        <span className="text-[10px] tracking-widest text-gray-400 uppercase -mt-1">
          Auto Peças
        </span>
      </div>

      {/* Links  */}
      <nav className="flex-1 flex justify-center gap-8 text-gray-300 font-medium text-sm">
        <Link href="/" className="hover:text-purple-400 transition-colors">Início</Link>
        <Link href="/catalogo" className="hover:text-purple-400 transition-colors">Catálogo</Link>
        <Link href="/selecionar-carro" className="hover:text-purple-400 transition-colors">Monte seu carro</Link>
      </nav>

      {/* Ícones da direita  */}
      <div className="w-1/4 flex justify-end items-center gap-6 text-gray-300">
        
        

        {/* Carrinho com contador dinâmico */}
        <Link 
          href="/carrinho" 
          aria-label="Carrinho de compras" 
          className="relative hover:text-purple-400 transition-colors cursor-pointer p-1"
        >
          <ShoppingCart size={20} />
          
          {/* Mostra o número de itens ou o raiozinho se houver itens */}
          {qtdItens > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              {qtdItens}
            </span>
          )}
        </Link>

      </div>

    </header>
  );
}