# Custom Hooks

Collection of reusable React hooks untuk e-Lapor Kab Kupang.

---

## `useViewMode`

Custom hook untuk mengelola view mode (table/grid) di ListGrid component.

### Import

```javascript
import { useViewMode } from '@/hooks/useViewMode';
```

### Basic Usage

```javascript
function UserList() {
  // Cara paling simple - default 'table', tanpa localStorage
  const [viewMode, setViewMode] = useViewMode();

  return (
    <ListGrid
      viewMode={viewMode}
      setViewMode={setViewMode}
      data={users}
      columns={columns}
    />
  );
}
```

### With Custom Default

```javascript
// Start dengan 'grid' mode
const [viewMode, setViewMode] = useViewMode('grid');
```

### With localStorage Persistence

```javascript
// ViewMode akan disimpan di localStorage dengan key 'user-list-view'
// Setiap kali user switch table/grid, preference tersimpan
const [viewMode, setViewMode] = useViewMode('table', 'user-list-view');
```

### API

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `defaultMode` | `'table' \| 'grid'` | `'table'` | Default view mode |
| `storageKey` | `string \| null` | `null` | localStorage key untuk persistence (optional) |

#### Returns

`[viewMode, setViewMode]` - Tuple seperti `useState`

- **viewMode**: Current view mode (`'table'` atau `'grid'`)
- **setViewMode**: Function untuk update view mode

### Examples

#### Example 1: Basic (No Persistence)

```javascript
import { useViewMode } from '@/hooks/useViewMode';
import ListGrid from '@/components/ui/datatable/ListGrid';

export default function AdminList() {
  const [viewMode, setViewMode] = useViewMode();

  return (
    <ListGrid
      viewMode={viewMode}
      setViewMode={setViewMode}
      data={admins}
      columns={columns}
    />
  );
}
```

#### Example 2: With localStorage Persistence

```javascript
import { useViewMode } from '@/hooks/useViewMode';
import ListGrid from '@/components/ui/datatable/ListGrid';

export default function AdminList() {
  // User preference tersimpan di localStorage
  // Ketika refresh page, view mode akan kembali ke pilihan terakhir
  const [viewMode, setViewMode] = useViewMode('table', 'admin-list-view');

  return (
    <ListGrid
      viewMode={viewMode}
      setViewMode={setViewMode}
      data={admins}
      columns={columns}
    />
  );
}
```

#### Example 3: Multiple Lists with Different Preferences

```javascript
export default function DashboardPage() {
  // Setiap list punya localStorage key sendiri
  const [userViewMode, setUserViewMode] = useViewMode('table', 'users-view');
  const [reportViewMode, setReportViewMode] = useViewMode('grid', 'reports-view');

  return (
    <>
      <ListGrid
        title="Users"
        viewMode={userViewMode}
        setViewMode={setUserViewMode}
        data={users}
        columns={userColumns}
      />

      <ListGrid
        title="Reports"
        viewMode={reportViewMode}
        setViewMode={setReportViewMode}
        data={reports}
        columns={reportColumns}
      />
    </>
  );
}
```

### Pro Tips

✅ **Pakai localStorage key yang unik** untuk setiap halaman list:
```javascript
// Good
const [viewMode, setViewMode] = useViewMode('table', 'admin-list-view');
const [viewMode, setViewMode] = useViewMode('table', 'user-list-view');
const [viewMode, setViewMode] = useViewMode('table', 'report-list-view');

// Bad (akan conflict)
const [viewMode, setViewMode] = useViewMode('table', 'list-view'); // Same key!
```

✅ **ListGrid sudah support internal state** - Hook ini OPTIONAL!
```javascript
// Tanpa hook - ListGrid handle otomatis
<ListGrid data={data} columns={columns} />

// Dengan hook - Kalau butuh kontrol manual
const [viewMode, setViewMode] = useViewMode();
<ListGrid viewMode={viewMode} setViewMode={setViewMode} data={data} columns={columns} />
```

---

## Need More Hooks?

Tambahkan custom hooks baru di folder ini sesuai kebutuhan project!
