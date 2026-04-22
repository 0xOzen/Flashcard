import { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { ChevronLeft } from 'lucide-react';
import { Flashcard } from '../types';

type CardType = 'GERMAN' | 'TURKISH';
type GridItem = { id: string; wordId: string; text: string; type: CardType; isMatched: boolean; };

export default function MatchMode({ listId, onNavigate }: { listId: string, onNavigate: (screen: Screen) => void }) {
  const { lists, recordSuccess, recordFailure, getDifficultWordsList } = useApp();
  const list = listId === 'difficult-words' ? getDifficultWordsList() : lists.find(l => l.id === listId);
  const words = list?.words || [];

  const [cards, setCards] = useState<GridItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (words.length < 2) return;
    const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, 6);
    let initialCards: GridItem[] = [];
    pool.forEach(w => {
       initialCards.push({ id: crypto.randomUUID(), wordId: w.id, text: w.term, type: 'GERMAN', isMatched: false });
       initialCards.push({ id: crypto.randomUUID(), wordId: w.id, text: w.translationTr || w.translationEn || w.translation || '', type: 'TURKISH', isMatched: false });
    });
    setCards(initialCards.sort(() => 0.5 - Math.random()));
  }, [words]);

  if (words.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
         <p className="text-gray-500 font-medium mb-6">Eşleştirme oyunu için en az 2 kelime olmalıdır.</p>
         <button onClick={() => onNavigate({ type: 'dashboard' })} className="px-6 py-2.5 bg-blue-500 text-white rounded-full font-medium transition-colors hover:bg-blue-600">Geri Dön</button>
      </div>
    );
  }

  const handleCardClick = (card: GridItem) => {
    if (isProcessing || card.isMatched || selectedIds.includes(card.id)) return;
    const newSelected = [...selectedIds, card.id];
    setSelectedIds(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const card1 = cards.find(c => c.id === newSelected[0])!;
      const card2 = cards.find(c => c.id === newSelected[1])!;

      if (card1.wordId === card2.wordId && card1.type !== card2.type) {
        recordSuccess(card1.wordId);
        setTimeout(() => {
           setCards(prev => prev.map(c => c.wordId === card1.wordId ? { ...c, isMatched: true } : c));
           setSelectedIds([]); setIsProcessing(false);
           const unMatched = cards.filter(c => !c.isMatched && c.wordId !== card1.wordId);
           if (unMatched.length === 0) setTimeout(() => { alert("Tebrikler!"); onNavigate({ type: 'dashboard' }); }, 500);
        }, 400);
      } else {
        recordFailure(card1.wordId);
        setTimeout(() => { setSelectedIds([]); setIsProcessing(false); }, 800);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="text-gray-400 hover:text-gray-700 transition-colors">
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center border border-gray-200 px-3 py-1 rounded-full">Eşleştirme</div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
          {cards.map(card => {
             const isSelected = selectedIds.includes(card.id);
             let btnClass = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
             
             if (card.isMatched) btnClass = "opacity-0 pointer-events-none scale-95";
             else if (isSelected) {
                if (selectedIds.length === 2) {
                   const c1 = cards.find(c => c.id === selectedIds[0])!;
                   const c2 = cards.find(c => c.id === selectedIds[1])!;
                   if (c1.wordId === c2.wordId) btnClass = "bg-green-500 border-green-500 text-white shadow-md scale-102";
                   else btnClass = "bg-red-500 border-red-500 text-white shadow-md";
                } else {
                   btnClass = "bg-blue-50 border-blue-200 text-blue-700";
                }
             }

             return (
               <button key={card.id} onClick={() => handleCardClick(card)}
                 className={`h-28 p-4 text-lg font-medium rounded-2xl transition-all text-center flex items-center justify-center border ${btnClass}`}>
                  <span className="line-clamp-3">{card.text}</span>
               </button>
             );
          })}
        </div>
      </div>
    </div>
  );
}
