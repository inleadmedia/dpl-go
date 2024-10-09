import { sleep } from "sleep-ts";

export const allFilters = {
  animal: ["monkey", "squirrel"],
  food: ["banana", "acorn"]
};

export type TFilters = Partial<typeof allFilters>;
export type TFilterKey = keyof TFilters;

// This function is a mock API call that simulates a delay in fetching data.
// And it has fake data.
const getFilters = (currentFilters: TFilters): Promise<{ data: TFilters }> =>
  new Promise<{ data: TFilters }>(async (resolve) => {
    await sleep(1000);

    if (
      !currentFilters.animal ||
      currentFilters.animal.length > 2 ||
      !currentFilters.food ||
      currentFilters.food.length > 2
    ) {
      resolve({
        data: allFilters
      });
    }
    if (
      (currentFilters.animal &&
        currentFilters.animal.length === 1 &&
        currentFilters.animal[0] === "monkey") ||
      (currentFilters.food &&
        currentFilters.food.length === 1 &&
        currentFilters.food[0] === "banana")
    ) {
      resolve({
        data: {
          animal: ["monkey"],
          food: ["banana"]
        }
      });
    }
    if (
      (currentFilters.animal &&
        currentFilters.animal.length === 1 &&
        currentFilters.animal[0] === "squirrel") ||
      (currentFilters.food &&
        currentFilters.food.length === 1 &&
        currentFilters.food[0] === "acorn")
    ) {
      resolve({
        data: {
          animal: ["squirrel"],
          food: ["acorn"]
        }
      });
    }

    resolve({
      data: allFilters
    });
  });

export default getFilters;
