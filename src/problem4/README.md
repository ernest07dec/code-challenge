# Problem 4: Three ways to sum to n

## How to run:

```
ts-node src/problem4/index.ts
```

## Solutions:

1. For Loop

```
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
```

2. While Loop

```
function sum_to_n_b(n: number): number {
  let sum = 0;
  while (n > 0) {
    sum += n--;
  }
  return sum;
}
```

3. Creating Array and reduce

```
function sum_to_n_c(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
}
```
