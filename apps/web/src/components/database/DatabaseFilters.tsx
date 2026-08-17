"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { DirectoryFilters, DirectoryTag } from "@/lib/directory-query";
import { directoryHref } from "@/lib/directory-query";

type DatabaseFiltersProps = {
  filters: DirectoryFilters;
  tags: DirectoryTag[];
  cities: string[];
  countries: string[];
  regions: string[];
  resultCount: number;
  total: number;
};

export function DatabaseFilters({
  filters,
  tags,
  cities,
  countries,
  regions,
  resultCount,
  total,
}: DatabaseFiltersProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go = (next: DirectoryFilters) => {
    startTransition(() => {
      router.replace(directoryHref(next), { scroll: false });
    });
  };

  return (
    <div className={`sife-filters ${pending ? "opacity-70" : ""}`}>
      <form
        className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))]"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          go({
            ...filters,
            q: String(data.get("q") || "").trim(),
            city: String(data.get("city") || ""),
            country: String(data.get("country") || ""),
            region: String(data.get("region") || ""),
          });
        }}
      >
        <label className="sife-field">
          <span>Search</span>
          <input name="q" type="search" defaultValue={filters.q} placeholder="Name, city, tag" />
        </label>
        <label className="sife-field">
          <span>City</span>
          <select
            name="city"
            defaultValue={filters.city}
            key={`city-${filters.city}`}
            onChange={(event) => go({ ...filters, city: event.target.value })}
          >
            <option value="">All</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
        <label className="sife-field">
          <span>Country</span>
          <select
            name="country"
            defaultValue={filters.country}
            key={`country-${filters.country}`}
            onChange={(event) => go({ ...filters, country: event.target.value })}
          >
            <option value="">All</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <label className="sife-field">
          <span>Region</span>
          <select
            name="region"
            defaultValue={filters.region}
            key={`region-${filters.region}`}
            onChange={(event) => go({ ...filters, region: event.target.value })}
          >
            <option value="">All</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
        <div className="md:col-span-4">
          <button type="submit" className="btn-coral">
            Filter
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const on = filters.tags.includes(tag.slug);
          const nextTags = on ? filters.tags.filter((item) => item !== tag.slug) : [...filters.tags, tag.slug];

          return (
            <button
              key={tag.slug}
              type="button"
              className={`sife-chip ${on ? "is-on" : ""}`}
              aria-pressed={on}
              onClick={() => go({ ...filters, tags: nextTags })}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm uppercase tracking-[0.14em] text-sife-ink/60">
        <p>
          {resultCount} of {total} projects
        </p>
        {hasFilters(filters) ? (
          <button type="button" className="sife-hover-underline text-sife-navy" onClick={() => go(emptyFilters())}>
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

function hasFilters(filters: DirectoryFilters): boolean {
  return Boolean(filters.q || filters.city || filters.country || filters.region || filters.tags.length);
}

function emptyFilters(): DirectoryFilters {
  return { q: "", tags: [], city: "", country: "", region: "" };
}
