'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { apiRequest } from '@services/apiFetch.service';
import { withCurrentBrandName } from '@utils/display-brand';
import type { AdminPageForm, AdminPageStatusFilter, AdminPageView } from '../interfaces/admin-page.interface';
import { AdminPagesTemplate } from '../templates/AdminPages.template';

const emptyForm: AdminPageForm = { title: '', slug: '', summary: '', content: '', status: 'Draft' };
const makeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-');

export const AdminPagesPage = () => {
  const [pages, setPages] = useState<AdminPageView[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdminPageStatusFilter>('Semua Status');
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminPageForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<AdminPageView | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ pages: AdminPageView[] }>('/api/admin/pages/v1/list', { cache: 'no-store' });
      setPages(
        (data.pages ?? []).map((page) => ({
          ...page,
          title: withCurrentBrandName(page.title ?? ''),
          slug: page.slug ?? '',
          summary: withCurrentBrandName(page.summary ?? ''),
          content: withCurrentBrandName(page.content ?? ''),
          status: page.status ?? 'Draft',
        }))
      );
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Halaman gagal dimuat.');
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const filteredPages = useMemo(
    () =>
      pages.filter((page) => {
        const matchesQuery = `${page.title} ${page.slug} ${page.summary}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (statusFilter === 'Semua Status' || page.status === statusFilter);
      }),
    [pages, query, statusFilter]
  );
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormMode('create');
  };
  const openEdit = (page: AdminPageView) => {
    setEditingId(page.id);
    setForm({
      title: withCurrentBrandName(page.title ?? ''),
      slug: page.slug ?? '',
      summary: withCurrentBrandName(page.summary ?? ''),
      content: withCurrentBrandName(page.content ?? ''),
      status: page.status ?? 'Draft',
    });
    setFormMode('edit');
  };
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...form,
      title: form.title.trim(),
      slug: makeSlug(form.slug || form.title),
      summary: form.summary.trim(),
      content: form.content.trim(),
    };
    try {
      await apiRequest<unknown>(
        formMode === 'edit' && editingId
          ? `/api/admin/pages/v1/update/${encodeURIComponent(editingId)}`
          : '/api/admin/pages/v1/create',
        {
          method: formMode === 'edit' ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      setFormMode(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Halaman gagal disimpan.');
    }
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest<unknown>(`/api/admin/pages/v1/delete/${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
      });
      setDeleteTarget(null);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Halaman gagal dihapus.');
    }
  };

  return (
    <>
      {error && <p role="alert">{error}</p>}
      <AdminPagesTemplate
        pages={pages}
        filteredPages={filteredPages}
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        publishedCount={pages.filter((page) => page.status === 'Published').length}
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
