import { Category } from './category';

export class Product { 
    id?: string;
    prod_name?: string;
    prod_description?: string;
    prod_richDescription?: string;
    prod_image?: string;
    prod_images?: string[];
    prod_brand?: string;
    prod_price?: number;
    prod_category?: Category;
    prod_stockCount?: number;
    prod_rating?: number;
    prod_reviewCount?: number;
    prod_featured?: boolean;
    prod_dateCreated?: string;
}