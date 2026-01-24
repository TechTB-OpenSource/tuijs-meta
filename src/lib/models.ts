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
    map?: Map;
}

export interface Map {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}
