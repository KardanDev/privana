export interface CatalogueAsset {
  body: Uint8Array;
  type: string;
}

export type CatalogueAssets = ReadonlyMap<string, CatalogueAsset>;
export const catalogueOrigin = "http://127.0.0.1:53471";
