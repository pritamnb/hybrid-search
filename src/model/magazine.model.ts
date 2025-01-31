export interface Magazine {
    id: number;
    title: string;
    author: string;
    publication_date: Date;
    category: string;
}

export interface MagazineContent {
    id: number;
    magazine_id: number;
    content: string;
    vector_representation: number[];
}
