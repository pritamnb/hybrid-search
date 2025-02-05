import { faker } from "@faker-js/faker";

export const generateFakeMagazines = (count: number) => {

    const categories = [
        "Technology", "Health", "Science", "Finance", "Business",
        "Marketing", "Environment", "Education", "Architecture", "Art"
    ];

    return Array.from({ length: count }, () => ({
        title: faker.lorem.words(4),
        author: faker.person.fullName(),
        content: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(categories),
    }));
};