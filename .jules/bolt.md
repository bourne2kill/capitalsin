## 2025-05-14 - [String Concatenation vs Array.join()]
**Learning:** In modern V8 engines (Node.js 22), iterative string concatenation (+=) is highly optimized and can sometimes outperform Array.join() for medium-sized strings. However, Array.join() remains more predictable for large datasets and avoids potential quadratic overhead in non-optimized engines.
**Action:** Always benchmark both patterns with realistic data sizes before committing to a 'performance' refactor.
