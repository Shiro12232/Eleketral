import Link from 'next/link';
import { Search, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#0a0a0c] text-white shadow-lg py-4 px-8 flex items-center justify-between z-50 border-b border-gray-800">
      
     
      <div className="flex flex-col w-1/4">
        <span className="text-lg font-black tracking-widest text-white italic">
          ELEKETRAL
        </span>
        <span className="text-[10px] tracking-widest text-gray-400 uppercase -mt-1">
          Auto Peças
        </span>
      </div>

      
      <nav className="flex-1 flex justify-center gap-8 text-gray-300 font-medium text-sm">
        <Link href="/" className="hover:text-purple-400 transition-colors">Início</Link>
        <Link href="/catalogo" className="hover:text-purple-400 transition-colors">Catálogo</Link>
        <Link href="/monte-seu-carro" className="hover:text-purple-400 transition-colors">Monte seu carro</Link>
       
      </nav>

     
      <div className="w-1/4 flex justify-end items-center gap-6 text-gray-300">

        <button aria-label="Pesquisar" className="hover:text-purple-400 transition-colors cursor-pointer">
          <Search size={20}
  />
        </button>
        
        <button aria-label="Perfil do usuário" className="hover:text-purple-400 transition-colors cursor-pointer">
          <User size={20} />
        </button>
        <div className="relative">
         
          <button aria-label="Carrinho de compras" className="hover:text-purple-400 transition-colors cursor-pointer">
            <ShoppingCart size={20} />
          </button>
         
          <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            ⚡
          </span>
        </div>


      </div>

    </header>
  );
}