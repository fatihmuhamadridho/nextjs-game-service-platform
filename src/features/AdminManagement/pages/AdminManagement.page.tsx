'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  AdminAccountForm,
  AdminAccountRoleFilter,
  AdminAccountStatusFilter,
  AdminAccountView,
} from '../interfaces/admin-account.interface';
import { AdminManagementTemplate } from '../templates/AdminManagement.template';

type RoleOption = { id: string; name: string; protected?: boolean };
const emptyForm: AdminAccountForm = { name: '', username: '', email: '', roleIds: [], status: 'Aktif' };
export const AdminManagementPage = () => {
  const [query, setQuery] = useState('');
  const [admins, setAdmins] = useState<AdminAccountView[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [roleFilter, setRoleFilter] = useState<AdminAccountRoleFilter>('Semua Role');
  const [statusFilter, setStatusFilter] = useState<AdminAccountStatusFilter>('Semua');
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<AdminAccountForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccountView | null>(null);
  const [viewTarget, setViewTarget] = useState<AdminAccountView | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    const status = statusFilter === 'Semua' ? '' : statusFilter === 'Aktif' ? 'ACTIVE' : 'INACTIVE';
    const params = new URLSearchParams({
      page: '1',
      pageSize: '100',
      ...(query ? { search: query } : {}),
      ...(status ? { status } : {}),
    });
    try {
      const [adminResponse, roleResponse] = await Promise.all([
        apiFetch(`/api/admin/admin-users/v1/list?${params}`, { cache: 'no-store' }),
        apiFetch('/api/admin/roles/v1/list', { cache: 'no-store' }),
      ]);
      const [adminPayload, rolePayload] = await Promise.all([adminResponse.json(), roleResponse.json()]);
      if (!adminResponse.ok || !roleResponse.ok)
        throw new Error(adminPayload.message ?? rolePayload.message ?? 'Gagal memuat akun admin.');
      setAdmins(
        adminPayload.data.admins.map(
          (row: {
            id: string;
            username: string;
            name: string;
            email: string;
            role: string;
            roleIds: string[];
            status: string;
            lastActive: string;
          }) => ({
            id: row.id,
            username: row.username,
            name: row.name,
            email: row.email,
            role: row.role === 'Super Admin' ? ('Super Admin' as const) : ('Admin' as const),
            roleIds: row.roleIds,
            status: row.status === 'ACTIVE' ? ('Aktif' as const) : ('Nonaktif' as const),
            lastActive: row.lastActive,
          })
        )
      );
      setRoles(
        rolePayload.data.roles.map((role: RoleOption) => ({ id: role.id, name: role.name, protected: role.protected }))
      );
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal memuat akun admin.');
    }
  }, [query, statusFilter]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  const filteredAdmins = useMemo(
    () => admins.filter((admin) => roleFilter === 'Semua Role' || admin.role === roleFilter),
    [admins, roleFilter]
  );
  const openCreate = () => {
    setForm({ ...emptyForm, roleIds: roles[0] ? [roles[0].id] : [] });
    setFormMode('create');
  };
  const openEdit = (admin: AdminAccountView) => {
    setForm({
      name: admin.name,
      username: admin.username,
      email: admin.email,
      roleIds: [...admin.roleIds],
      status: admin.status,
    });
    setFormMode('edit');
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('Perubahan akun admin belum tersedia sebelum provisioning kredensial dikonfigurasi.');
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setError('Penghapusan akun admin belum tersedia sebelum provisioning kredensial dikonfigurasi.');
  };
  const viewAdmin = async (admin: AdminAccountView) => {
    try {
      const response = await apiFetch(`/api/admin/admin-users/v1/detail/${admin.id}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? 'Gagal memuat detail admin.');
      const detail = payload.data.admin;
      setViewTarget({ ...admin, username: detail.username, roleIds: detail.roleIds });
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal memuat detail admin.');
    }
  };
  return (
    <AdminManagementTemplate
      admins={admins}
      filteredAdmins={filteredAdmins}
      roles={roles}
      error={error}
      query={query}
      onQueryChange={setQuery}
      roleFilter={roleFilter}
      onRoleFilterChange={setRoleFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      activeCount={admins.filter((admin) => admin.status === 'Aktif').length}
      superAdminCount={admins.filter((admin) => admin.role === 'Super Admin' && admin.status === 'Aktif').length}
      formMode={formMode}
      form={form}
      onFormChange={setForm}
      onCreate={openCreate}
      onEdit={openEdit}
      onSave={handleSave}
      onCloseForm={() => setFormMode(null)}
      deleteTarget={deleteTarget}
      onDeleteSelect={setDeleteTarget}
      onDeleteConfirm={confirmDelete}
      viewTarget={viewTarget}
      onView={setViewTarget}
      onViewDetail={viewAdmin}
    />
  );
};
