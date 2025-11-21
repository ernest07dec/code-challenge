function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

function sum_to_n_b(n: number): number {
  let sum = 0;
  while (n > 0) {
    sum += n--;
  }
  return sum;
}

function sum_to_n_c(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
}

const DEMO_NUMBERS = [5, 15, 50, 100];

DEMO_NUMBERS.forEach((n) => {
  console.log(`Running Tests for ${n}`);
  console.log(`sum_to_n_a(${n}) >> `, sum_to_n_a(n));
  console.log(`sum_to_n_b(${n}) >> `, sum_to_n_b(n));
  console.log(`sum_to_n_c(${n}) >> `, sum_to_n_c(n));
});
