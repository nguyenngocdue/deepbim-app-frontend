export function mergeCategorySettings(
  checkedCategories: string[],
  colors: Record<string, string>,
  transparencies: Record<string, number>,
  // categoryVisibility: Record<string, boolean>,
): Record<string, { color?: string; transparency?: number, isShow? : boolean }> {
  const result: Record<string, { color?: string; transparency?: number, isShow? : boolean }> = {};
  for (const category of checkedCategories) {
    result[category] = {
      color: colors[category],
      transparency: transparencies[category],
      isShow: true,
    };
  }

  return result;
}
