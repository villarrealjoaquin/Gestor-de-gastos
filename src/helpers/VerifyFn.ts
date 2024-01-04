export const verifyCategories = (categoriesToVerify: string[], category: string) => {
  return categoriesToVerify.some(
    existingCategory => existingCategory.toLowerCase().includes(category.toLowerCase())
  );
};