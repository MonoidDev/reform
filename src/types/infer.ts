import { TAny } from "./BasicTypes"
import { Resolver } from "./Resolver"

export type AnyResolver = Resolver<any, any, any, string>;

export type ResolverMap = {
  [K in string]: AnyResolver;
}

export type InputOfResolverMap<RM extends ResolverMap> = {
  [K in keyof RM]: InputOf<RM[K]>;
}

export type OutputOfResolverMap<RM extends ResolverMap> = {
  [K in keyof RM]: OutputOf<RM[K]>;
}

export type InputOf<T extends AnyResolver> = T extends Resolver<infer I, any, any, any> ? I : never;

export type OutputOf<T extends AnyResolver> = T extends Resolver<any, infer O, any, any> ? O : never;
