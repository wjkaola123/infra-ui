import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (success: boolean, errorMessage?: string) => void;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, onResult, user }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [status, setStatus] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = useStore((s) => s.roles);
  const fetchRolesFromApi = useStore((s) => s.fetchRolesFromApi);
  const addUser = useStore((s) => s.addUser);
  const updateUser = useStore((s) => s.updateUser);

  useEffect(() => {
    fetchRolesFromApi(1, 10000);
  }, [fetchRolesFromApi]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setRoleIds(user.roleIds);
      setStatus(user.status === 'active');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRoleIds([]);
      setStatus(true);
    }
    setPasswordError('');
  }, [user, isOpen]);

  const validatePassword = (pwd: string): boolean => {
    if (!pwd || pwd.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!user && !validatePassword(password)) return;
    if (user && password && !validatePassword(password)) return;

    let result: { success: boolean; error?: string };
    if (user) {
      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
        roleIds,
        status: status ? 'active' : 'inactive',
      };
      if (password) updateData.password = password;
      result = await updateUser(user.id, updateData);
    } else {
      result = await addUser({
        name: name.trim(),
        email: email.trim(),
        password,
        roleIds,
        permissionIds: [],
        status: status ? 'active' : 'inactive',
      });
    }
    onClose();
    onResult?.(result.success, result.error);
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));
  const isEditMode = !!user;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create User'}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {user ? 'Save' : 'Create'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter username"
          maxLength={20}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <Input
          label={isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) validatePassword(e.target.value);
          }}
          placeholder={isEditMode ? '••••••••' : 'Enter password'}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
        />
        {passwordError && <p className="text-xs text-red-500 -mt-2">{passwordError}</p>}
        <Select
          label="Role Assignment"
          value={roleIds}
          onChange={setRoleIds}
          options={roleOptions}
          placeholder="Select roles"
        />
        <div className="flex items-center gap-3">
          <Switch checked={status} onChange={setStatus} />
          <span className="text-sm text-gray-700">{status ? 'Active' : 'Inactive'}</span>
        </div>
      </div>
    </Modal>
  );
}
