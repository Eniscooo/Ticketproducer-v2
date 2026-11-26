/**
 * shadcn-style `cn`, so components pasted from shadcn registries import cleanly.
 * It is the project's dependency-free class joiner: it does not merge
 * conflicting Tailwind classes the way tailwind-merge would, so put overrides
 * in a single class rather than relying on "last one wins".
 */
export { clsx as cn } from "./clsx";
