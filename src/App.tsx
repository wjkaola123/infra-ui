import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EntityGrid } from './components/EntityGrid';
import { DetailPanel } from './components/DetailPanel';
import { AddEntityModal } from './components/AddEntityModal';
import type { EntityType } from './types';

function App() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<EntityType>('user');

  const openAddModal = (type: EntityType) => {
    setAddModalType(type);
    setAddModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />

      {/* 快捷操作栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex gap-2">
        <button
          onClick={() => openAddModal('user')}
          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        >
          + 用户
        </button>
        <button
          onClick={() => openAddModal('role')}
          className="px-3 py-1.5 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
        >
          + 角色
        </button>
        <button
          onClick={() => openAddModal('permission')}
          className="px-3 py-1.5 text-sm bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
        >
          + 权限
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <EntityGrid />
        <DetailPanel />
      </div>

      <Footer />

      <AddEntityModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        entityType={addModalType}
      />
    </div>
  );
}

export default App;
