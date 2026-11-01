'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  BankAccountForm,
  BankAccountStatusFilter,
  BankAccountView,
} from '../interfaces/admin-bank-account.interface';
import { AdminBankAccountsTemplate } from '../templates/AdminBankAccounts.template';

const emptyForm: BankAccountForm = {
  bankName: 'BCA',
  accountNumber: '',
  accountHolder: '',
  label: '',
  status: 'Aktif',
  isPrimary: false,
};

export const AdminBankAccountsPage = () => {
  const [accounts, setAccounts] = useState<BankAccountView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BankAccountStatusFilter>('Semua Status');
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BankAccountForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<BankAccountView | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/admin/bank-accounts/v1/list', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Gagal memuat rekening.');
      setAccounts(payload.data?.bankAccounts ?? []);
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal memuat rekening.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          `${account.bankName} ${account.accountNumber} ${account.accountHolder} ${account.label}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (statusFilter === 'Semua Status' || account.status === statusFilter)
      ),
    [accounts, query, statusFilter]
  );
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormMode('create');
  };
  const openEdit = (account: BankAccountView) => {
    setEditingId(account.id);
    setForm({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
      label: account.label,
      status: account.status,
      isPrimary: account.isPrimary,
    });
    setFormMode('edit');
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      accountNumber: form.accountNumber.trim(),
      accountHolder: form.accountHolder.trim(),
      label: form.label.trim(),
    };
    try {
      const response = await apiFetch(
        formMode === 'edit' && editingId
          ? `/api/admin/bank-accounts/v1/update/${encodeURIComponent(editingId)}`
          : '/api/admin/bank-accounts/v1/create',
        {
          method: formMode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? 'Gagal menyimpan rekening.');
      setFormMode(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan rekening.');
    }
  };
  const makePrimary = async (id: string) => {
    setError('');
    try {
      const response = await apiFetch(`/api/admin/bank-accounts/v1/set-primary/${encodeURIComponent(id)}`, {
        method: 'POST',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? 'Gagal mengubah rekening utama.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal mengubah rekening utama.');
    }
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setError('');
    try {
      const response = await apiFetch(`/api/admin/bank-accounts/v1/delete/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? 'Gagal menghapus rekening.');
      setDeleteTarget(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menghapus rekening.');
    }
  };
  return (
    <AdminBankAccountsTemplate
      accounts={accounts}
      filteredAccounts={filteredAccounts}
      query={query}
      onQueryChange={setQuery}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      formMode={formMode}
      form={form}
      onFormChange={setForm}
      onCreate={openCreate}
      onEdit={openEdit}
      onSave={handleSave}
      onCloseForm={() => setFormMode(null)}
      onMakePrimary={makePrimary}
      deleteTarget={deleteTarget}
      onDeleteSelect={setDeleteTarget}
      onDeleteConfirm={confirmDelete}
      loading={loading}
      error={error}
    />
  );
};
