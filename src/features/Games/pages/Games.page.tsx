'use client';

import { apiFetch } from '@services/apiFetch.service';

import { useEffect, useState } from 'react';
import type { GameCardView } from '../interfaces/game.interface';
import { GamesTemplate } from '../templates/Games.template';

export const GamesPage = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [activeCategorySlug, setActiveCategorySlug] = useState('');
  const [serviceCategories, setServiceCategories] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Paling Populer');
  const [page, setPage] = useState(1);
  const [games, setGames] = useState<GameCardView[]>([]);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let alive = true;
    void apiFetch('/api/service-categories/v1/list', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.data) throw new Error(result.message ?? 'Kategori gagal dimuat.');
        const categoryList = Array.isArray(result.data) ? result.data : (result.data.categories ?? []);
        if (alive)
          setServiceCategories(
            categoryList.map((category: { name: string; slug: string; count?: number; gameCount?: number }) => ({
              name: category.name,
              slug: category.slug,
              count: category.gameCount ?? category.count ?? 0,
            }))
          );
      })
      .catch(() => alive && setServiceCategories([]));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const query = new URLSearchParams({ search, limit: '100', page: '1', sort: sort === 'Nama A–Z' ? 'NAME_ASC' : 'POPULAR' });

    if (activeCategorySlug) query.set('category', activeCategorySlug);

    apiFetch(`/api/games/v1/list?${query}`)
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok || !result.data) throw new Error(result.message ?? 'Katalog game gagal dimuat.');
        if (!alive) return;

        const firstPageGames = Array.isArray(result.data) ? result.data : result.data.games;
        const pagination = result.pagination ?? result.data.pagination;
        const totalItems: number = pagination?.total ?? firstPageGames.length;
        const allGames = [...firstPageGames];
        const totalPages: number = pagination?.totalPages ?? 1;

        for (let nextPageNumber = 2; nextPageNumber <= totalPages; nextPageNumber += 1) {
          const nextQuery = new URLSearchParams(query);
          nextQuery.set('page', String(nextPageNumber));
          const nextResponse = await apiFetch(`/api/games/v1/list?${nextQuery}`);
          const nextResult = await nextResponse.json();
          if (!nextResponse.ok || !nextResult.data) {
            throw new Error(nextResult.message ?? 'Katalog game gagal dimuat.');
          }
          const nextGames = Array.isArray(nextResult.data) ? nextResult.data : nextResult.data.games;
          if (!nextGames.length) break;
          allGames.push(...nextGames);
        }

        if (!alive) return;

        setTotal(totalItems);
        setGames(
          allGames.map(
            (game: {
              id: string;
              slug: string;
              name: string;
              artworkKey?: string | null;
              imageUrl?: string | null;
              serviceCount: number;
              categories?: Array<{ name: string }>;
              description?: string | null;
            }) => ({
              id: game.id,
              slug: game.slug,
              name: game.name,
              art: game.artworkKey ?? game.imageUrl ?? game.slug,
              tags: game.categories?.map((category) => category.name) ?? [],
              count: game.serviceCount,
              rating: '',
              reviews: 0,
            })
          )
        );
        setLoadError('');
      })
      .catch(
        (error: unknown) => alive && setLoadError(error instanceof Error ? error.message : 'Katalog game gagal dimuat.')
      );
    return () => {
      alive = false;
    };
  }, [search, sort, activeCategorySlug]);

  const filters = ['Semua', ...serviceCategories.map((category) => category.name)];

  const categoryCounts: Record<string, number> = {
    Semua: total,
    ...Object.fromEntries(serviceCategories.map((category) => [category.name, category.count])),
  };

  const chooseFilter = (filter: string) => {
    setActiveFilter(filter);
    setActiveCategorySlug(serviceCategories.find((category) => category.name === filter)?.slug ?? '');
    setPage(1);
  };

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <GamesTemplate
      loadError={loadError}
      games={games}
      filters={filters}
      counts={{ ...categoryCounts, Semua: total }}
      activeFilter={activeFilter}
      search={search}
      sort={sort}
      page={page}
      onSearch={updateSearch}
      onFilter={chooseFilter}
      onSort={setSort}
      onPage={setPage}
    />
  );
};
