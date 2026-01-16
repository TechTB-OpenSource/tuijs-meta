export type MetaTypeKey = 'name' | 'property' | 'itemprop';

export type MetaTag = {
    [K in MetaTypeKey]?: string;
} & {
    content: string;
};

export interface MetaRoute {
    route: string;
    title?: string;
    meta?: Array<MetaTag>;
}
