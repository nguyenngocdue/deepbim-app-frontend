export function mergeCategorySettings(
  defaultCategories: string[],
  checkedCategories: string[],
  colors: Record<string, string>,
  transparencies: Record<string, number>,
  // categoryVisibility: Record<string, boolean>,
): Record<string, { color?: string; transparency?: number, isShow? : boolean }> {
  const result: Record<string, { color?: string; transparency?: number, isShow? : boolean }> = {};

  for (const category of defaultCategories) {
    if(checkedCategories.includes(category)){
      result[category] = {
        color: colors[category],
        transparency: transparencies[category],
        isShow: true,
      };
    } else{
      result[category] = {
        color: colors[category],
        transparency: transparencies[category],
        isShow: false,
      };
    }
  }
  return result;
}
