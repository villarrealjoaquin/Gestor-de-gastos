export const verifyCategories = (categoriesToVerify: string[], category: string) => {
  return categoriesToVerify.some(
    existingCategory => existingCategory.includes(category)
  );
};