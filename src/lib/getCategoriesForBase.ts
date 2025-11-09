export async function fetchCategoriesForBase(base: 'retail' | 'client') {
  try {
    const endpoint = base === 'client' ? '/api/client/products' : '/api/retail/products';
    const res = await fetch(endpoint, { cache: 'no-store' });
    const data = await res.json();
    if (!data?.success) return { categories: [] as string[], categoryTree: {} as Record<string, string[]> };

    const listRaw: any[] = Array.isArray(data.products) ? data.products : [];
    const list = listRaw.filter((p) => {
      const b = (p?.base || 'retail') as 'retail' | 'client';
      return b === base;
    });

    const deriveTree = (products: any[]): Record<string, string[]> => {
      const tree: Record<string, string[]> = {};
      products.forEach((p) => {
        if (!p?.category) return;
        if (!tree[p.category]) tree[p.category] = [];
        if (p.subCategory && !tree[p.category].includes(p.subCategory)) {
          tree[p.category].push(p.subCategory);
        }
      });
      Object.keys(tree).forEach((key) => {
        tree[key] = tree[key].slice().sort((a, b) => a.localeCompare(b));
      });
      return tree;
    };

    const categories: string[] = Array.isArray(data.categories) && data.categories.length
      ? (data.categories as string[]).filter((cat) => list.some((p) => p?.category === cat)).sort((a, b) => a.localeCompare(b))
      : Array.from(new Set(list.map((p: any) => p?.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));

    const treeRaw: Record<string, string[]> = data.categoryTree && typeof data.categoryTree === 'object'
      ? Object.fromEntries(
          Object.entries(data.categoryTree)
            .filter(([key]) => list.some((p) => p?.category === key))
            .map(([key, value]) => [
              key,
              Array.isArray(value)
                ? (value as string[]).filter((sub) => list.some((p) => p?.category === key && p?.subCategory === sub)).sort((a, b) => a.localeCompare(b))
                : []
            ])
        )
      : deriveTree(list);

    const tree: Record<string, string[]> = { ...treeRaw };
    categories.forEach((cat) => {
      if (!tree[cat]) tree[cat] = [];
    });

    return { categories, categoryTree: tree };
  } catch (error) {
    console.error('fetchCategoriesForBase error:', error);
    return { categories: [] as string[], categoryTree: {} as Record<string, string[]> };
  }
}

export default fetchCategoriesForBase;
