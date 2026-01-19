# Dead Code Analysis Report

Generated: 2026-01-19

## Summary

| Category | Count |
|----------|-------|
| Unused Files | 2 |
| Unused Exports | 15 |
| Unused Dependencies | 1 |
| Unused Dev Dependencies | 4 |
| Unused Types | 5 |

---

## SAFE - Can Be Safely Removed

### 1. Unused Files

| File | Reason | Risk |
|------|--------|------|
| `src/lib/index.ts` | Empty placeholder file (only contains comment) | SAFE |
| `src/lib/constants/tokens.ts` | Design tokens never imported anywhere | SAFE |

### 2. Unused Exports

#### `src/lib/types/bingo.ts`
| Export | Status | Risk |
|--------|--------|------|
| `CELL_POSITIONS` | Only used in definition file | SAFE |
| `BINGO_LINES` | Only used in definition file | SAFE |
| `LegacyCellPosition` (type) | Never used anywhere | SAFE |
| `getCellByPosition` | Only used in `+page.svelte` - keep it | CAUTION |

#### `src/lib/validation/schemas.ts`
| Export | Status | Risk |
|--------|--------|------|
| `BOARD_NAME_MIN_LENGTH` | Only used in definition file | SAFE |
| `VALID_BOARD_SIZES` | Only used in definition file | SAFE |
| `cellSchema` | Only used in definition file | SAFE |
| `updateBoardInputSchema` | Only used in definition file | SAFE |
| `GoalInput` (type) | Never used | SAFE |
| `BoardNameInput` (type) | Never used | SAFE |
| `BoardSizeInput` (type) | Never used | SAFE |
| `CellInput` (type) | Never used | SAFE |
| `UpdateBoardInput` (type) | Never used | SAFE |

#### `src/lib/themes/index.ts`
| Export | Status | Risk |
|--------|--------|------|
| `getTheme` | Never called | SAFE |
| `ThemeMeta` (type) | Never used outside types.ts | SAFE |
| `ThemeColors` (type) | Never used outside types.ts | SAFE |
| `ThemeFonts` (type) | Never used outside types.ts | SAFE |
| `ThemeIcon` (type) | Never used outside types.ts | SAFE |

#### `src/lib/stores/themeStore.ts`
| Export | Status | Risk |
|--------|--------|------|
| `currentThemeId` | Never used | SAFE |
| `setTheme` | Function wrapper - store.setTheme is used directly | SAFE |

#### `src/lib/stores/boardStore.ts`
| Export | Status | Risk |
|--------|--------|------|
| `setIsSaving` | Never called externally | SAFE |

#### `src/lib/stores/localeStore.ts`
| Export | Status | Risk |
|--------|--------|------|
| `setLocale` | Function wrapper - store.setLocale used directly | SAFE |

#### `src/lib/utils/localStorageAdapter.ts`
| Export | Status | Risk |
|--------|--------|------|
| `STORAGE_KEY` | Used internally, no need to export | SAFE |

#### `src/lib/i18n/translations.ts`
| Export | Status | Risk |
|--------|--------|------|
| `default` | Default export never used (named export `t` is used) | SAFE |

### 3. Unused Dependencies

| Package | Status | Risk |
|---------|--------|------|
| `uuid` | Never imported (crypto.randomUUID used instead) | SAFE |

### 4. Unused Dev Dependencies

| Package | Status | Risk |
|---------|--------|------|
| `@types/uuid` | Not needed if uuid is removed | SAFE |
| `autoprefixer` | Not configured in PostCSS | SAFE |
| `postcss` | Tailwind v4 uses native CSS | SAFE |
| `@testing-library/dom` | Transitively used by @testing-library/svelte | CAUTION |

---

## CAUTION - Review Before Removing

### Test Mock Files

| File | Status | Risk |
|------|--------|------|
| `src/test-mocks/app-environment.ts` | Exports `building`, `version` unused but may be needed for future tests | CAUTION |

---

## DANGER - Do Not Remove Without Careful Review

None identified.

---

## Recommended Actions

### Phase 1: Safe Deletions (No Test Required)

1. Delete `src/lib/index.ts` (empty file)
2. Delete `src/lib/constants/tokens.ts` (unused design tokens)
3. Remove `uuid` and `@types/uuid` from package.json

### Phase 2: Code Cleanup (Test Required)

1. Remove unused exports from `src/lib/types/bingo.ts`:
   - `CELL_POSITIONS`
   - `BINGO_LINES`
   - `LegacyCellPosition`

2. Remove unused exports from `src/lib/validation/schemas.ts`:
   - `BOARD_NAME_MIN_LENGTH`
   - `VALID_BOARD_SIZES`
   - `cellSchema`
   - `updateBoardInputSchema`
   - `GoalInput`, `BoardNameInput`, `BoardSizeInput`, `CellInput`, `UpdateBoardInput` types

3. Remove unused exports from `src/lib/themes/index.ts`:
   - `getTheme`
   - Re-exported types (`ThemeMeta`, `ThemeColors`, `ThemeFonts`, `ThemeIcon`)

4. Remove unused exports from stores:
   - `currentThemeId` from themeStore.ts
   - `setTheme` wrapper function from themeStore.ts
   - `setIsSaving` from boardStore.ts
   - `setLocale` wrapper function from localeStore.ts

5. Remove unused export from `src/lib/utils/localStorageAdapter.ts`:
   - Make `STORAGE_KEY` private (remove export)

6. Remove default export from `src/lib/i18n/translations.ts`

### Phase 3: Dependency Cleanup

1. Remove from package.json dependencies:
   - `uuid`

2. Remove from package.json devDependencies:
   - `@types/uuid`
   - `autoprefixer` (confirm not needed)
   - `postcss` (confirm Tailwind v4 doesn't need it)
