import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import { permissionApi } from '../../api/endpoints/permission';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (success: boolean, errorMessage?: string) => void;
  permission?: { id: string; name: string; key?: string; description?: string } | null;
}

const PERMISSION_NAME_REGEX = /^[a-z0-9_]+:[a-z0-9_]+$/;

function validatePermissionName(name: string): string | null {
  if (!name.trim()) return null;
  if (!PERMISSION_NAME_REGEX.test(name)) {
    return 'Use lowercase, colon separator (e.g. articles:read)';
  }
  return null;
}

export function PermissionModal({ isOpen, onClose, onResult, permission }: PermissionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState(false);

  const addPermission = useStore((s) => s.addPermission);
  const updatePermission = useStore((s) => s.updatePermission);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setDescription(permission.description || '');
      setLoadingDesc(true);
      permissionApi.getById(Number(permission.id))
        .then((data) => {
          setDescription(data.description || '');
        })
        .catch(() => {})
        .finally(() => setLoadingDesc(false));
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
    setTouched(false);
    setSubmitting(false);
  }, [permission, isOpen]);

  const validationError = touched ? validatePermissionName(name) : null;
  const isValid = name.trim() && !validationError;

  const handleSubmit = async () => {
    if (!isValid) return;
    setTouched(true);
    setSubmitting(true);
    setError(null);

    if (permission) {
      const result = await updatePermission(permission.id, { name: name.trim(), description: description.trim() || undefined });
      setSubmitting(false);
      if (result.success) {
        onClose();
        onResult?.(true);
      } else {
        setError(result.error || 'Failed to update permission');
        onResult?.(false, result.error);
      }
      return;
    }

    const result = await addPermission({ name: name.trim(), description: description.trim() || undefined });
    setSubmitting(false);

    if (result.success) {
      onClose();
      onResult?.(true);
    } else {
      setError(result.error || 'Failed to create permission');
      onResult?.(false, result.error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={permission ? 'Edit Permission' : 'Create Permission'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? (permission ? 'Saving...' : 'Creating...') : permission ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Permission Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. articles:read"
            maxLength={50}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
          {!validationError && name.trim() && (
            <p className="mt-1 text-sm text-green-600">Valid format</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this permission controls"
            maxLength={255}
            rows={3}
            disabled={loadingDesc}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:bg-gray-100"
          />
          <p className="mt-1 text-xs text-gray-400">{description.length}/255</p>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </Modal>
  );
}