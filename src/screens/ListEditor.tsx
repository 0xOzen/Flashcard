import { useState } from 'react';
import { useApp } from '../AppContext';
import { Screen } from '../App';
import { Flashcard } from '../types';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';

import WordEditorItem from './WordEditorItem';

export default function ListEditor({ listId, onNavigate }: { listId: string, onNavigate: (screen: Screen) => void }) {
  const { lists, addList, updateList, deleteList } = useApp();
  const existingList = lists.find(l => l.id === listId);
  const isNew = listId === 'new';

  const [title, setTitle] = useState(existingList?.title || '');
  const [words, setWords] = useState<Flashcard[]>(existingList?.words || []);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const addWord = () => setWords([...words, {
      id: crypto.randomUUID(), term: '', translationTr: '', example: '', exampleTranslation: ''
  }]);
  const updateWord = (id: string, field: keyof Flashcard, value: string) => setWords(words.map(w => w.id === id ? { ...w, [field]: value } : w));
  const removeWord = (id: string) => setWords(words.filter(w => w.id !== id));

  const handleDeleteList = () => {
    deleteList(listId); 
    onNavigate({ type: 'dashboard' });
  };

  return (
    <div className="max-w-5xl mx-auto p-8 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <button onClick={() => onNavigate({ type: 'dashboard' })} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-3">
          {!isNew && !existingList?.isDefault && (
             showConfirmDelete ? (
               <div className="flex items-center gap-2 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                 <span className="text-red-600 text-sm font-medium px-2">Silinecek?</span>
                 <button onClick={handleDeleteList} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-red-600 transition-colors">Evet</button>
                 <button onClick={() => setShowConfirmDelete(false)} className="text-gray-500 hover:text-gray-800 text-xs font-medium px-2 py-1">İptal</button>
               </div>
             ) : (
               <button onClick={() => setShowConfirmDelete(true)} className="text-red-500 px-4 py-2 rounded-full font-medium text-sm hover:bg-red-50 transition-colors">Sil</button>
             )
          )}
          <button 
            onClick={() => {
              if (!title.trim()) return;
              if (isNew) addList(title, words); else updateList(listId, title, words);
              onNavigate({ type: 'dashboard' });
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm shadow-sm transition-colors"
          >
             Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/60 flex-1 overflow-auto">
        <div className="mb-10">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={existingList?.isDefault}
            className="w-full bg-transparent border-b border-gray-200 py-3 text-3xl font-semibold text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            placeholder="Liste Adı (Örn: Seyahat)"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Kelimeler ({words.length})</h3>
          {!existingList?.isDefault && (
             <button onClick={addWord} className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1.5 text-sm transition-colors">
              <Plus size={16} /> Kelime Ekle
            </button>
          )}
        </div>

        <div className="space-y-4">
          {words.map((word) => (
            <WordEditorItem 
              key={word.id} 
              word={word} 
              isDefault={existingList?.isDefault} 
              onUpdate={updateWord} 
              onRemove={removeWord} 
            />
          ))}
          {words.length === 0 && <div className="text-center py-10 text-gray-400 font-medium">Listeniz boş.</div>}
        </div>
      </div>
    </div>
  );
}
