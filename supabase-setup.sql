-- ============================================================
-- Code of Meridaeia - Fresh Leaderboard Setup
-- ============================================================
-- Run this ONCE in your NEW Supabase project:
--   Dashboard -> SQL Editor -> New query -> paste all of this -> Run
--
-- Design: the game has no login, so each browser generates a random
-- player id (UUID) and keeps it in localStorage. That id is the row
-- key - you can only meaningfully update the row whose id you hold.
-- A guard trigger keeps scores sane (never decrease, hard caps), so
-- casual tampering can't zero out or absurdly inflate entries.
-- ============================================================

create table public.leaderboard (
    player_id uuid primary key,
    username text not null check (char_length(username) between 1 and 24),
    total_xp bigint not null default 0 check (total_xp between 0 and 10000000),
    total_gold bigint not null default 0 check (total_gold between 0 and 10000000),
    total_monsters_defeated integer not null default 0
        check (total_monsters_defeated between 0 and 1000000),
    level integer not null default 1 check (level between 1 and 1000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Sort indexes for the three tabs
create index leaderboard_xp_idx on public.leaderboard (total_xp desc);
create index leaderboard_gold_idx on public.leaderboard (total_gold desc);
create index leaderboard_monsters_idx on public.leaderboard (total_monsters_defeated desc);

-- ---------- Row Level Security ----------
alter table public.leaderboard enable row level security;

-- Anyone may read the board
create policy "public read"
    on public.leaderboard for select
    using (true);

-- Anyone may create their own entry
create policy "anon insert"
    on public.leaderboard for insert
    with check (true);

-- Updates allowed; the guard trigger below enforces sanity
create policy "anon update"
    on public.leaderboard for update
    using (true)
    with check (true);

-- No deletes from the client
-- (no delete policy = deletes denied under RLS)

-- ---------- Guard trigger: scores only ever go up ----------
create or replace function public.leaderboard_guard()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Scores are cumulative: never allow a decrease (stops griefers
    -- who somehow learn another player's id from zeroing them out).
    if new.total_xp < old.total_xp
        or new.total_gold < old.total_gold
        or new.total_monsters_defeated < old.total_monsters_defeated
        or new.level < old.level then
        raise exception 'scores cannot decrease';
    end if;

    -- Per-update delta cap: one update can't jump absurdly
    if new.total_xp - old.total_xp > 50000 then
        raise exception 'xp delta too large';
    end if;

    new.created_at := old.created_at;  -- immutable
    new.updated_at := now();
    return new;
end;
$$;

create trigger leaderboard_guard_trg
    before update on public.leaderboard
    for each row execute function public.leaderboard_guard();

-- ============================================================
-- Done! Now copy your project's URL and anon public key from
-- Dashboard -> Settings -> API and paste them into the
-- LEADERBOARD_CONFIG block at the top of leaderboard.js.
-- ============================================================
