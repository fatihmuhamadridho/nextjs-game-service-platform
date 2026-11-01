'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { apiRequest } from '@services/apiFetch.service';
import type { AdminBannerForm, AdminBannerStatusFilter, AdminBannerView } from '../interfaces/admin-banner.interface';
import { AdminBannersTemplate } from '../templates/AdminBanners.template';

const emptyForm: AdminBannerForm = {
  title: '',
  description: '',
  imageUrl: '',
  imageName: '',
  targetUrl: '',
  placement: 'Homepage',
  active: true,
  priority: 1,
};

export const AdminBannersPage = () => {
  const [query, setQuery] = useState('');
  const [banners, setBanners] = useState<AdminBannerView[]>([]);
  const [statusFilter, setStatusFilter] = useState<AdminBannerStatusFilter>('Semua');
  const [placementFilter, setPlacementFilter] = useState('Semua Posisi');
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminBannerForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<AdminBannerView | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ banners: AdminBannerView[] }>('/api/admin/banners/v1/list', { cache: 'no-store' });
      setBanners(
        (data.banners ?? []).map((banner) => ({
          ...banner,
          title: banner.title ?? '',
          description: banner.description ?? '',
          imageUrl: banner.imageUrl ?? '',
          imageName: banner.imageName ?? '',
          targetUrl: banner.targetUrl ?? '',
          placement: banner.placement ?? 'Homepage',
        }))
      );
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Banner gagal dimuat.');
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filteredBanners = useMemo(
    () =>
      banners
        .filter((banner) => {
          const matchesQuery = `${banner.title} ${banner.description} ${banner.placement}`
            .toLowerCase()
            .includes(query.toLowerCase());
          const matchesStatus = statusFilter === 'Semua' || (statusFilter === 'Aktif' ? banner.active : !banner.active);
          const matchesPlacement = placementFilter === 'Semua Posisi' || banner.placement === placementFilter;
          return matchesQuery && matchesStatus && matchesPlacement;
        })
        .sort((a, b) => a.priority - b.priority),
    [banners, query, statusFilter, placementFilter]
  );
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, priority: banners.length + 1 });
    setFormMode('create');
  };
  const openEdit = (banner: AdminBannerView) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title ?? '',
      description: banner.description ?? '',
      imageUrl: banner.imageUrl ?? '',
      imageName: banner.imageName ?? '',
      targetUrl: banner.targetUrl ?? '',
      placement: banner.placement ?? 'Homepage',
      active: banner.active,
      priority: banner.priority,
    });
    setFormMode('edit');
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextBanner = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      targetUrl: form.targetUrl.trim(),
      imageUrl: form.imageUrl.trim(),
    };
    try {
      await apiRequest<unknown>(
        formMode === 'edit' && editingId
          ? `/api/admin/banners/v1/update/${encodeURIComponent(editingId)}`
          : '/api/admin/banners/v1/create',
        {
          method: formMode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextBanner),
        }
      );
      setFormMode(null);
      setForm({ ...emptyForm });
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Banner gagal disimpan.');
    }
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest<unknown>(`/api/admin/banners/v1/delete/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      setDeleteTarget(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Banner gagal dihapus.');
    }
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <AdminBannersTemplate
        banners={banners}
        filteredBanners={filteredBanners}
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        placementFilter={placementFilter}
        onPlacementFilterChange={setPlacementFilter}
        activeCount={banners.filter((banner) => banner.active).length}
        formMode={formMode}
        form={form}
        onFormChange={setForm}
        onCreate={openCreate}
        onEdit={openEdit}
        onSave={handleSave}
        onCloseForm={() => setFormMode(null)}
        deleteTarget={deleteTarget}
        onDeleteSelect={setDeleteTarget}
        onDeleteConfirm={() => void confirmDelete()}
      />
    </>
  );
};
