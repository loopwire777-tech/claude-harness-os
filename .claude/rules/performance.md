# Performance

- Avoid N+1 queries; fetch related data in a single query.
- Never fetch more data than the view needs.
- Avoid unnecessary re-renders; don't create new object/array literals inline in render paths without reason.
- Don't add caching, memoization, or indexes speculatively — only when a measured cost justifies it.
- Keep bundle size in mind; don't add a dependency for something trivial to implement.
