export function mergeCategorySettings(
  checkedCategories: string[],
  colors: Record<string, string>,
  transparencies: Record<string, number>
): Record<string, { color?: string; transparency?: number }> {
  const result: Record<string, { color?: string; transparency?: number }> = {};

  for (const category of checkedCategories) {
    result[category] = {
      color: colors[category],
      transparency: transparencies[category],
    };
  }

  return result;
}
