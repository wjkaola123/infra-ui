import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useStore } from '../store/useStore';
import type { EntityType, Permission } from '../types';
import { Fragment } from 'react';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
}

const permissionOptions: { key: Permission; label: string }[] = [
  { key: 'READ', label: '读取' },
  { key: 'CREATE', label: '创建' },
  { key: 'UPDATE', label: '更新' },
  { key: 'DELETE', label: '删除' },
];

export function AddEntityModal({ isOpen, onClose, entityType }: AddEntityModalProps) {
  const [name, setName] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const addUser = useStore((s) => s.addUser);
  const addRole = useStore((s) => s.addRole);
  const addPermission = useStore((s) => s.addPermission);
  const permissions = useStore((s) => s.permissions);

  const typeLabel = { user: '用户', role: '角色', permission: '权限' }[entityType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (entityType === 'user') {
      addUser(name.trim());
    } else if (entityType === 'role') {
      addRole(name.trim(), selectedPerms);
    } else {
      const key = name.includes('读') ? 'READ' :
        name.includes('增') || name.includes('创') ? 'CREATE' :
        name.includes('改') || name.includes('更') ? 'UPDATE' : 'DELETE';
      addPermission(name.trim(), key);
    }

    setName('');
    setSelectedPerms([]);
    onClose();
  };

  const togglePerm = (id: string) => {
    setSelectedPerms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <form onSubmit={handleSubmit}>
                  <div className="p-6">
                    <Dialog.Title className="text-lg font-semibold mb-4">
                      添加{typeLabel}
                    </Dialog.Title>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        名称
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`输入${typeLabel}名称`}
                        autoFocus
                      />
                    </div>

                    {entityType === 'role' && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          关联权限
                        </label>
                        <div className="space-y-2">
                          {permissions.map((p) => (
                            <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedPerms.includes(p.id)}
                                onChange={() => togglePerm(p.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                              />
                              <span className="text-sm">{p.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-3 bg-gray-50 rounded-b-xl flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      确定
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
