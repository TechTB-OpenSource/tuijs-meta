export type MetaTypeKey = 'name' | 'property' | 'itemprop';
export interface MetaTag {
    typeKey: MetaTypeKey;
    typeValue: string;
    content: string;
}
export interface MetaRoute {
    route: string;
    title?: string;
    meta?: Array<MetaTag>;
}
//# sourceMappingURL=models.d.ts.map