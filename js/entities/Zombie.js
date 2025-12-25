// Zombie Coding Challenges - Large pool of unique problems
// Each zombie gets a unique challenge from this pool
let usedChallengeIds = new Set();

const ZOMBIE_CHALLENGES = [
    // EASY CHALLENGES (20 problems)
    {
        id: 'add-two', title: 'Add Two Numbers', difficulty: 'Easy',
        description: 'Return the sum of a and b',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return a + b\n  \n}', python: 'def solve(a, b):\n    # Return a + b\n    pass' },
        tests: [{ input: [2, 3], expected: 5 }, { input: [10, 5], expected: 15 }, { input: [-1, 1], expected: 0 }]
    },
    {
        id: 'subtract', title: 'Subtract Numbers', difficulty: 'Easy',
        description: 'Return a minus b',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return a - b\n  \n}', python: 'def solve(a, b):\n    # Return a - b\n    pass' },
        tests: [{ input: [10, 3], expected: 7 }, { input: [5, 5], expected: 0 }, { input: [0, 5], expected: -5 }]
    },
    {
        id: 'multiply', title: 'Multiply Numbers', difficulty: 'Easy',
        description: 'Return a multiplied by b',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return a * b\n  \n}', python: 'def solve(a, b):\n    # Return a * b\n    pass' },
        tests: [{ input: [3, 4], expected: 12 }, { input: [5, 0], expected: 0 }, { input: [7, 1], expected: 7 }]
    },
    {
        id: 'double-number', title: 'Double It', difficulty: 'Easy',
        description: 'Return the number multiplied by 2',
        starterCode: { javascript: 'function solve(n) {\n  // Return n * 2\n  \n}', python: 'def solve(n):\n    # Return n * 2\n    pass' },
        tests: [{ input: [5], expected: 10 }, { input: [0], expected: 0 }, { input: [7], expected: 14 }]
    },
    {
        id: 'triple-number', title: 'Triple It', difficulty: 'Easy',
        description: 'Return the number multiplied by 3',
        starterCode: { javascript: 'function solve(n) {\n  // Return n * 3\n  \n}', python: 'def solve(n):\n    # Return n * 3\n    pass' },
        tests: [{ input: [5], expected: 15 }, { input: [0], expected: 0 }, { input: [4], expected: 12 }]
    },
    {
        id: 'square', title: 'Square Number', difficulty: 'Easy',
        description: 'Return n squared (n * n)',
        starterCode: { javascript: 'function solve(n) {\n  // Return n * n\n  \n}', python: 'def solve(n):\n    # Return n * n\n    pass' },
        tests: [{ input: [3], expected: 9 }, { input: [5], expected: 25 }, { input: [0], expected: 0 }]
    },
    {
        id: 'is-even', title: 'Is It Even?', difficulty: 'Easy',
        description: 'Return true if n is even, false otherwise',
        starterCode: { javascript: 'function solve(n) {\n  // Return true if even\n  \n}', python: 'def solve(n):\n    # Return True if even\n    pass' },
        tests: [{ input: [4], expected: true }, { input: [7], expected: false }, { input: [0], expected: true }]
    },
    {
        id: 'is-odd', title: 'Is It Odd?', difficulty: 'Easy',
        description: 'Return true if n is odd, false otherwise',
        starterCode: { javascript: 'function solve(n) {\n  // Return true if odd\n  \n}', python: 'def solve(n):\n    # Return True if odd\n    pass' },
        tests: [{ input: [3], expected: true }, { input: [8], expected: false }, { input: [1], expected: true }]
    },
    {
        id: 'is-positive', title: 'Is Positive?', difficulty: 'Easy',
        description: 'Return true if n is positive (greater than 0)',
        starterCode: { javascript: 'function solve(n) {\n  // Return true if n > 0\n  \n}', python: 'def solve(n):\n    # Return True if n > 0\n    pass' },
        tests: [{ input: [5], expected: true }, { input: [-3], expected: false }, { input: [0], expected: false }]
    },
    {
        id: 'is-negative', title: 'Is Negative?', difficulty: 'Easy',
        description: 'Return true if n is negative (less than 0)',
        starterCode: { javascript: 'function solve(n) {\n  // Return true if n < 0\n  \n}', python: 'def solve(n):\n    # Return True if n < 0\n    pass' },
        tests: [{ input: [-5], expected: true }, { input: [3], expected: false }, { input: [0], expected: false }]
    },
    {
        id: 'absolute', title: 'Absolute Value', difficulty: 'Easy',
        description: 'Return the absolute value of n',
        starterCode: { javascript: 'function solve(n) {\n  // Return absolute value\n  \n}', python: 'def solve(n):\n    # Return absolute value\n    pass' },
        tests: [{ input: [-5], expected: 5 }, { input: [3], expected: 3 }, { input: [0], expected: 0 }]
    },
    {
        id: 'max-two', title: 'Maximum of Two', difficulty: 'Easy',
        description: 'Return the larger of two numbers',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return the larger\n  \n}', python: 'def solve(a, b):\n    # Return the larger\n    pass' },
        tests: [{ input: [5, 3], expected: 5 }, { input: [2, 8], expected: 8 }, { input: [4, 4], expected: 4 }]
    },
    {
        id: 'min-two', title: 'Minimum of Two', difficulty: 'Easy',
        description: 'Return the smaller of two numbers',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return the smaller\n  \n}', python: 'def solve(a, b):\n    # Return the smaller\n    pass' },
        tests: [{ input: [5, 3], expected: 3 }, { input: [2, 8], expected: 2 }, { input: [4, 4], expected: 4 }]
    },
    {
        id: 'string-length', title: 'String Length', difficulty: 'Easy',
        description: 'Return the length of the string',
        starterCode: { javascript: 'function solve(str) {\n  // Return length\n  \n}', python: 'def solve(s):\n    # Return length\n    pass' },
        tests: [{ input: ['hello'], expected: 5 }, { input: [''], expected: 0 }, { input: ['zombie'], expected: 6 }]
    },
    {
        id: 'first-char', title: 'First Character', difficulty: 'Easy',
        description: 'Return the first character of the string',
        starterCode: { javascript: 'function solve(str) {\n  // Return first char\n  \n}', python: 'def solve(s):\n    # Return first char\n    pass' },
        tests: [{ input: ['hello'], expected: 'h' }, { input: ['world'], expected: 'w' }, { input: ['a'], expected: 'a' }]
    },
    {
        id: 'last-char', title: 'Last Character', difficulty: 'Easy',
        description: 'Return the last character of the string',
        starterCode: { javascript: 'function solve(str) {\n  // Return last char\n  \n}', python: 'def solve(s):\n    # Return last char\n    pass' },
        tests: [{ input: ['hello'], expected: 'o' }, { input: ['world'], expected: 'd' }, { input: ['a'], expected: 'a' }]
    },
    {
        id: 'to-upper', title: 'Uppercase', difficulty: 'Easy',
        description: 'Return the string in uppercase',
        starterCode: { javascript: 'function solve(str) {\n  // Return uppercase\n  \n}', python: 'def solve(s):\n    # Return uppercase\n    pass' },
        tests: [{ input: ['hello'], expected: 'HELLO' }, { input: ['World'], expected: 'WORLD' }]
    },
    {
        id: 'to-lower', title: 'Lowercase', difficulty: 'Easy',
        description: 'Return the string in lowercase',
        starterCode: { javascript: 'function solve(str) {\n  // Return lowercase\n  \n}', python: 'def solve(s):\n    # Return lowercase\n    pass' },
        tests: [{ input: ['HELLO'], expected: 'hello' }, { input: ['World'], expected: 'world' }]
    },
    {
        id: 'array-length', title: 'Array Length', difficulty: 'Easy',
        description: 'Return the length of the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return length\n  \n}', python: 'def solve(arr):\n    # Return length\n    pass' },
        tests: [{ input: [[1,2,3]], expected: 3 }, { input: [[]], expected: 0 }, { input: [[1]], expected: 1 }]
    },
    {
        id: 'first-element', title: 'First Element', difficulty: 'Easy',
        description: 'Return the first element of the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return first element\n  \n}', python: 'def solve(arr):\n    # Return first element\n    pass' },
        tests: [{ input: [[1,2,3]], expected: 1 }, { input: [[5,4,3]], expected: 5 }, { input: [[9]], expected: 9 }]
    },
    
    // MEDIUM CHALLENGES (15 problems)
    {
        id: 'sum-array', title: 'Sum Array', difficulty: 'Medium',
        description: 'Return the sum of all numbers in the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return sum\n  \n}', python: 'def solve(arr):\n    # Return sum\n    pass' },
        tests: [{ input: [[1,2,3]], expected: 6 }, { input: [[10,20]], expected: 30 }, { input: [[5]], expected: 5 }]
    },
    {
        id: 'array-product', title: 'Array Product', difficulty: 'Medium',
        description: 'Return the product of all numbers in the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return product\n  \n}', python: 'def solve(arr):\n    # Return product\n    pass' },
        tests: [{ input: [[1,2,3]], expected: 6 }, { input: [[2,5]], expected: 10 }, { input: [[4]], expected: 4 }]
    },
    {
        id: 'reverse-string', title: 'Reverse String', difficulty: 'Medium',
        description: 'Return the string reversed',
        starterCode: { javascript: 'function solve(str) {\n  // Return reversed\n  \n}', python: 'def solve(s):\n    # Return reversed\n    pass' },
        tests: [{ input: ['hello'], expected: 'olleh' }, { input: ['abc'], expected: 'cba' }, { input: ['a'], expected: 'a' }]
    },
    {
        id: 'count-vowels', title: 'Count Vowels', difficulty: 'Medium',
        description: 'Count vowels (a,e,i,o,u) in the string',
        starterCode: { javascript: 'function solve(str) {\n  // Count vowels\n  \n}', python: 'def solve(s):\n    # Count vowels\n    pass' },
        tests: [{ input: ['hello'], expected: 2 }, { input: ['aeiou'], expected: 5 }, { input: ['xyz'], expected: 0 }]
    },
    {
        id: 'max-array', title: 'Array Maximum', difficulty: 'Medium',
        description: 'Return the maximum value in the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return max\n  \n}', python: 'def solve(arr):\n    # Return max\n    pass' },
        tests: [{ input: [[1,5,3]], expected: 5 }, { input: [[9,2,7]], expected: 9 }, { input: [[4]], expected: 4 }]
    },
    {
        id: 'min-array', title: 'Array Minimum', difficulty: 'Medium',
        description: 'Return the minimum value in the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Return min\n  \n}', python: 'def solve(arr):\n    # Return min\n    pass' },
        tests: [{ input: [[1,5,3]], expected: 1 }, { input: [[9,2,7]], expected: 2 }, { input: [[4]], expected: 4 }]
    },
    {
        id: 'count-char', title: 'Count Character', difficulty: 'Medium',
        description: 'Count how many times char c appears in string s',
        starterCode: { javascript: 'function solve(s, c) {\n  // Count occurrences\n  \n}', python: 'def solve(s, c):\n    # Count occurrences\n    pass' },
        tests: [{ input: ['hello', 'l'], expected: 2 }, { input: ['aaa', 'a'], expected: 3 }, { input: ['abc', 'z'], expected: 0 }]
    },
    {
        id: 'is-palindrome', title: 'Is Palindrome?', difficulty: 'Medium',
        description: 'Return true if string reads same forwards and backwards',
        starterCode: { javascript: 'function solve(str) {\n  // Check palindrome\n  \n}', python: 'def solve(s):\n    # Check palindrome\n    pass' },
        tests: [{ input: ['racecar'], expected: true }, { input: ['hello'], expected: false }, { input: ['a'], expected: true }]
    },
    {
        id: 'reverse-array', title: 'Reverse Array', difficulty: 'Medium',
        description: 'Return the array reversed',
        starterCode: { javascript: 'function solve(arr) {\n  // Return reversed array\n  \n}', python: 'def solve(arr):\n    # Return reversed\n    pass' },
        tests: [{ input: [[1,2,3]], expected: [3,2,1] }, { input: [[5,4]], expected: [4,5] }, { input: [[1]], expected: [1] }]
    },
    {
        id: 'filter-even', title: 'Filter Even Numbers', difficulty: 'Medium',
        description: 'Return only even numbers from the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Filter evens\n  \n}', python: 'def solve(arr):\n    # Filter evens\n    pass' },
        tests: [{ input: [[1,2,3,4,5,6]], expected: [2,4,6] }, { input: [[1,3,5]], expected: [] }, { input: [[2,4]], expected: [2,4] }]
    },
    {
        id: 'filter-odd', title: 'Filter Odd Numbers', difficulty: 'Medium',
        description: 'Return only odd numbers from the array',
        starterCode: { javascript: 'function solve(arr) {\n  // Filter odds\n  \n}', python: 'def solve(arr):\n    # Filter odds\n    pass' },
        tests: [{ input: [[1,2,3,4,5]], expected: [1,3,5] }, { input: [[2,4,6]], expected: [] }, { input: [[1,3]], expected: [1,3] }]
    },
    {
        id: 'double-array', title: 'Double Array Values', difficulty: 'Medium',
        description: 'Return array with all values doubled',
        starterCode: { javascript: 'function solve(arr) {\n  // Double each value\n  \n}', python: 'def solve(arr):\n    # Double each value\n    pass' },
        tests: [{ input: [[1,2,3]], expected: [2,4,6] }, { input: [[5]], expected: [10] }, { input: [[0,1]], expected: [0,2] }]
    },
    {
        id: 'average', title: 'Array Average', difficulty: 'Medium',
        description: 'Return the average of all numbers',
        starterCode: { javascript: 'function solve(arr) {\n  // Return average\n  \n}', python: 'def solve(arr):\n    # Return average\n    pass' },
        tests: [{ input: [[2,4,6]], expected: 4 }, { input: [[10,20]], expected: 15 }, { input: [[5]], expected: 5 }]
    },
    {
        id: 'contains', title: 'Array Contains', difficulty: 'Medium',
        description: 'Return true if array contains the value',
        starterCode: { javascript: 'function solve(arr, val) {\n  // Check if contains\n  \n}', python: 'def solve(arr, val):\n    # Check if contains\n    pass' },
        tests: [{ input: [[1,2,3], 2], expected: true }, { input: [[1,2,3], 5], expected: false }, { input: [[], 1], expected: false }]
    },
    {
        id: 'index-of', title: 'Find Index', difficulty: 'Medium',
        description: 'Return index of value in array (-1 if not found)',
        starterCode: { javascript: 'function solve(arr, val) {\n  // Find index\n  \n}', python: 'def solve(arr, val):\n    # Find index\n    pass' },
        tests: [{ input: [[1,2,3], 2], expected: 1 }, { input: [[5,4,3], 3], expected: 2 }, { input: [[1,2], 5], expected: -1 }]
    },
    
    // HARD CHALLENGES (15 problems)
    {
        id: 'factorial', title: 'Factorial', difficulty: 'Hard',
        description: 'Return n! (n factorial)',
        starterCode: { javascript: 'function solve(n) {\n  // Return n!\n  \n}', python: 'def solve(n):\n    # Return n!\n    pass' },
        tests: [{ input: [5], expected: 120 }, { input: [3], expected: 6 }, { input: [0], expected: 1 }]
    },
    {
        id: 'fibonacci', title: 'Fibonacci', difficulty: 'Hard',
        description: 'Return the nth Fibonacci number (0,1,1,2,3,5,8...)',
        starterCode: { javascript: 'function solve(n) {\n  // Return nth fibonacci\n  \n}', python: 'def solve(n):\n    # Return nth fibonacci\n    pass' },
        tests: [{ input: [0], expected: 0 }, { input: [1], expected: 1 }, { input: [6], expected: 8 }]
    },
    {
        id: 'fizzbuzz', title: 'FizzBuzz Single', difficulty: 'Hard',
        description: 'Return "Fizz" if divisible by 3, "Buzz" if by 5, "FizzBuzz" if both, else n as string',
        starterCode: { javascript: 'function solve(n) {\n  // FizzBuzz logic\n  \n}', python: 'def solve(n):\n    # FizzBuzz logic\n    pass' },
        tests: [{ input: [3], expected: 'Fizz' }, { input: [5], expected: 'Buzz' }, { input: [15], expected: 'FizzBuzz' }, { input: [7], expected: '7' }]
    },
    {
        id: 'is-prime', title: 'Is Prime?', difficulty: 'Hard',
        description: 'Return true if n is a prime number',
        starterCode: { javascript: 'function solve(n) {\n  // Check if prime\n  \n}', python: 'def solve(n):\n    # Check if prime\n    pass' },
        tests: [{ input: [7], expected: true }, { input: [4], expected: false }, { input: [2], expected: true }, { input: [1], expected: false }]
    },
    {
        id: 'gcd', title: 'Greatest Common Divisor', difficulty: 'Hard',
        description: 'Return the GCD of two numbers',
        starterCode: { javascript: 'function solve(a, b) {\n  // Return GCD\n  \n}', python: 'def solve(a, b):\n    # Return GCD\n    pass' },
        tests: [{ input: [12, 8], expected: 4 }, { input: [15, 5], expected: 5 }, { input: [7, 3], expected: 1 }]
    },
    {
        id: 'power', title: 'Power Function', difficulty: 'Hard',
        description: 'Return base raised to exponent (base^exp)',
        starterCode: { javascript: 'function solve(base, exp) {\n  // Return base^exp\n  \n}', python: 'def solve(base, exp):\n    # Return base^exp\n    pass' },
        tests: [{ input: [2, 3], expected: 8 }, { input: [5, 2], expected: 25 }, { input: [3, 0], expected: 1 }]
    },
    {
        id: 'count-words', title: 'Count Words', difficulty: 'Hard',
        description: 'Count words in a sentence (split by spaces)',
        starterCode: { javascript: 'function solve(str) {\n  // Count words\n  \n}', python: 'def solve(s):\n    # Count words\n    pass' },
        tests: [{ input: ['hello world'], expected: 2 }, { input: ['one two three'], expected: 3 }, { input: ['single'], expected: 1 }]
    },
    {
        id: 'remove-duplicates', title: 'Remove Duplicates', difficulty: 'Hard',
        description: 'Return array with duplicates removed',
        starterCode: { javascript: 'function solve(arr) {\n  // Remove duplicates\n  \n}', python: 'def solve(arr):\n    # Remove duplicates\n    pass' },
        tests: [{ input: [[1,2,2,3,3,3]], expected: [1,2,3] }, { input: [[1,1,1]], expected: [1] }, { input: [[1,2,3]], expected: [1,2,3] }]
    },
    {
        id: 'sort-array', title: 'Sort Array', difficulty: 'Hard',
        description: 'Return the array sorted in ascending order',
        starterCode: { javascript: 'function solve(arr) {\n  // Sort ascending\n  \n}', python: 'def solve(arr):\n    # Sort ascending\n    pass' },
        tests: [{ input: [[3,1,2]], expected: [1,2,3] }, { input: [[5,4,3,2,1]], expected: [1,2,3,4,5] }, { input: [[1]], expected: [1] }]
    },
    {
        id: 'flatten', title: 'Sum Nested Array', difficulty: 'Hard',
        description: 'Return sum of all numbers in nested arrays',
        starterCode: { javascript: 'function solve(arr) {\n  // Sum all nested\n  \n}', python: 'def solve(arr):\n    # Sum all nested\n    pass' },
        tests: [{ input: [[[1,2],[3,4]]], expected: 10 }, { input: [[[1],[2],[3]]], expected: 6 }]
    },
    {
        id: 'title-case', title: 'Title Case', difficulty: 'Hard',
        description: 'Capitalize first letter of each word',
        starterCode: { javascript: 'function solve(str) {\n  // Title case\n  \n}', python: 'def solve(s):\n    # Title case\n    pass' },
        tests: [{ input: ['hello world'], expected: 'Hello World' }, { input: ['foo bar'], expected: 'Foo Bar' }]
    },
    {
        id: 'binary-search', title: 'Binary Search', difficulty: 'Hard',
        description: 'Find index of target in sorted array (-1 if not found)',
        starterCode: { javascript: 'function solve(arr, target) {\n  // Binary search\n  \n}', python: 'def solve(arr, target):\n    # Binary search\n    pass' },
        tests: [{ input: [[1,2,3,4,5], 3], expected: 2 }, { input: [[1,2,3], 4], expected: -1 }]
    },
    {
        id: 'two-sum', title: 'Two Sum', difficulty: 'Hard',
        description: 'Return indices of two numbers that add up to target',
        starterCode: { javascript: 'function solve(arr, target) {\n  // Find two indices\n  \n}', python: 'def solve(arr, target):\n    # Find two indices\n    pass' },
        tests: [{ input: [[2,7,11,15], 9], expected: [0,1] }, { input: [[3,2,4], 6], expected: [1,2] }]
    },
    {
        id: 'merge-sorted', title: 'Merge Sorted Arrays', difficulty: 'Hard',
        description: 'Merge two sorted arrays into one sorted array',
        starterCode: { javascript: 'function solve(a, b) {\n  // Merge sorted\n  \n}', python: 'def solve(a, b):\n    # Merge sorted\n    pass' },
        tests: [{ input: [[1,3,5], [2,4,6]], expected: [1,2,3,4,5,6] }, { input: [[1,2], [3,4]], expected: [1,2,3,4] }]
    },
    {
        id: 'anagram', title: 'Check Anagram', difficulty: 'Hard',
        description: 'Return true if two strings are anagrams',
        starterCode: { javascript: 'function solve(a, b) {\n  // Check anagram\n  \n}', python: 'def solve(a, b):\n    # Check anagram\n    pass' },
        tests: [{ input: ['listen', 'silent'], expected: true }, { input: ['hello', 'world'], expected: false }]
    }
];

// BOSS ZOMBIE CHALLENGES - Extremely Difficult
const BOSS_CHALLENGES = [
    {
        id: 'boss-fibonacci-sum', title: '🔥 Fibonacci Sum', difficulty: 'Boss',
        description: 'Return the sum of first n Fibonacci numbers (1,1,2,3,5,8...)',
        starterCode: { 
            javascript: 'function solve(n) {\n  // Sum of first n Fibonacci numbers\n  // F(1)=1, F(2)=1, F(3)=2...\n  \n}', 
            python: 'def solve(n):\n    # Sum of first n Fibonacci numbers\n    # F(1)=1, F(2)=1, F(3)=2...\n    pass' 
        },
        tests: [
            { input: [5], expected: 12 },   // 1+1+2+3+5=12
            { input: [7], expected: 33 },   // 1+1+2+3+5+8+13=33
            { input: [10], expected: 143 }
        ]
    },
    {
        id: 'boss-prime-count', title: '🔥 Count Primes', difficulty: 'Boss',
        description: 'Return count of prime numbers less than n',
        starterCode: { 
            javascript: 'function solve(n) {\n  // Count primes less than n\n  \n}', 
            python: 'def solve(n):\n    # Count primes less than n\n    pass' 
        },
        tests: [
            { input: [10], expected: 4 },   // 2,3,5,7
            { input: [20], expected: 8 },   // 2,3,5,7,11,13,17,19
            { input: [100], expected: 25 }
        ]
    },
    {
        id: 'boss-longest-substring', title: '🔥 Longest Unique Substring', difficulty: 'Boss',
        description: 'Find length of longest substring without repeating characters',
        starterCode: { 
            javascript: 'function solve(s) {\n  // Longest substring without repeating chars\n  \n}', 
            python: 'def solve(s):\n    # Longest substring without repeating chars\n    pass' 
        },
        tests: [
            { input: ['abcabcbb'], expected: 3 },   // "abc"
            { input: ['bbbbb'], expected: 1 },      // "b"
            { input: ['pwwkew'], expected: 3 }      // "wke"
        ]
    },
    {
        id: 'boss-max-subarray', title: '🔥 Maximum Subarray Sum', difficulty: 'Boss',
        description: 'Find the contiguous subarray with largest sum',
        starterCode: { 
            javascript: 'function solve(arr) {\n  // Find max subarray sum (Kadane\'s algorithm)\n  \n}', 
            python: 'def solve(arr):\n    # Find max subarray sum (Kadane\'s algorithm)\n    pass' 
        },
        tests: [
            { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },  // [4,-1,2,1]
            { input: [[1]], expected: 1 },
            { input: [[5,4,-1,7,8]], expected: 23 }
        ]
    },
    {
        id: 'boss-valid-parentheses', title: '🔥 Valid Parentheses', difficulty: 'Boss',
        description: 'Check if string has valid balanced parentheses ()[]{}',
        starterCode: { 
            javascript: 'function solve(s) {\n  // Check valid parentheses\n  \n}', 
            python: 'def solve(s):\n    # Check valid parentheses\n    pass' 
        },
        tests: [
            { input: ['()[]{}'], expected: true },
            { input: ['([)]'], expected: false },
            { input: ['{[]}'], expected: true }
        ]
    },
    {
        id: 'boss-matrix-spiral', title: '🔥 Spiral Matrix', difficulty: 'Boss',
        description: 'Return elements of matrix in spiral order',
        starterCode: { 
            javascript: 'function solve(matrix) {\n  // Return spiral order array\n  \n}', 
            python: 'def solve(matrix):\n    # Return spiral order array\n    pass' 
        },
        tests: [
            { input: [[[1,2,3],[4,5,6],[7,8,9]]], expected: [1,2,3,6,9,8,7,4,5] },
            { input: [[[1,2],[3,4]]], expected: [1,2,4,3] }
        ]
    }
];

// Get a unique challenge for each zombie
function getUniqueChallengeForZombie(zombieType) {
    let pool;
    if (zombieType === 'boss') {
        // Boss gets extremely difficult challenges
        pool = BOSS_CHALLENGES;
    } else if (zombieType === 'normal') {
        pool = ZOMBIE_CHALLENGES.filter(c => c.difficulty === 'Easy');
    } else if (zombieType === 'conehead') {
        pool = ZOMBIE_CHALLENGES.filter(c => c.difficulty === 'Easy' || c.difficulty === 'Medium');
    } else {
        pool = ZOMBIE_CHALLENGES;
    }
    
    // Find unused challenges
    const available = pool.filter(c => !usedChallengeIds.has(c.id));
    
    // If all used, reset and use any from pool
    if (available.length === 0) {
        usedChallengeIds.clear();
        const challenge = pool[Math.floor(Math.random() * pool.length)];
        usedChallengeIds.add(challenge.id);
        return challenge;
    }
    
    const challenge = available[Math.floor(Math.random() * available.length)];
    usedChallengeIds.add(challenge.id);
    return challenge;
}

// Reset challenge pool (call when starting new level)
function resetChallengePool() {
    usedChallengeIds.clear();
}

// Zombie Base Class
class Zombie {
    constructor(type, row, x = 850) {
        this.type = type;
        this.row = row;
        this.position = { x, y: CONFIG.LANES[row] };
        this.health = CONFIG.ZOMBIE_STATS[type].health;
        this.maxHealth = CONFIG.ZOMBIE_STATS[type].health;
        this.speed = CONFIG.ZOMBIE_STATS[type].speed;
        this.damage = CONFIG.ZOMBIE_STATS[type].damage;
        this.element = null;
        this.isAlive = true;
        this.isEating = false;
        this.target = null;
        this.lastAttackTime = 0;
        this.attackInterval = 1000; // Attack every second
        
        // Zombie Timer System
        this.timer = 30000; // 30 seconds default timer
        this.timerPaused = false;
        this.timerPauseDuration = 0;
        this.baseSpeed = this.speed;
        
        // Coding Challenge System
        this.challenge = this.assignChallenge();
        this.challengeSolved = false;
    }
    
    assignChallenge() {
        // Use the unique challenge assignment function
        return getUniqueChallengeForZombie(this.type);
    }
    
    create() {
        const zombieDiv = createElement('div', {
            class: 'zombie',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        // Use animated GIF images
        const imgSrc = this.type === 'normal' ? 'normalzombie.gif' : 
                       this.type === 'conehead' ? 'coneheadzombie.gif' : 'bucketheadzombie.gif';
        
        const img = createElement('img', {
            src: `assets/images/${imgSrc}`,
            alt: this.type
        });
        
        // Challenge indicator
        const challengeIcon = createElement('div', {
            class: 'zombie-challenge-icon',
            title: `Click to solve: ${this.challenge.title}`
        });
        challengeIcon.innerHTML = '💻';
        const zombieInstance = this; // Capture reference for closure
        challengeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('=== ZOMBIE ICON CLICKED ===');
            console.log('gameEngine exists:', !!window.gameEngine);
            console.log('codingMode exists:', !!window.gameEngine?.codingMode);
            
            if (window.gameEngine && window.gameEngine.codingMode) {
                console.log('Calling openZombieChallenge...');
                window.gameEngine.codingMode.openZombieChallenge(zombieInstance);
            } else {
                console.error('CodingMode not available!');
                // Try to show the panel directly as fallback
                const panel = document.getElementById('zombie-challenge-panel');
                if (panel) {
                    panel.classList.remove('hidden');
                    panel.classList.add('active');
                    panel.style.display = 'block';
                    console.log('Panel shown directly');
                }
            }
        });
        
        // Health bar
        const healthBar = createElement('div', { class: 'zombie-health-bar' });
        const healthFill = createElement('div', { class: 'zombie-health-fill' });
        healthFill.style.width = '100%';
        healthBar.appendChild(healthFill);
        
        zombieDiv.appendChild(img);
        zombieDiv.appendChild(challengeIcon);
        zombieDiv.appendChild(healthBar);
        this.element = zombieDiv;
        
        return zombieDiv;
    }
    
    updateHealthBar() {
        if (this.element) {
            const healthFill = this.element.querySelector('.zombie-health-fill');
            if (healthFill) {
                const percentage = (this.health / this.maxHealth) * 100;
                healthFill.style.width = `${Math.max(0, percentage)}%`;
            }
        }
    }
    
    update(deltaTime, currentTime) {
        if (!this.isAlive) return;
        
        // Update zombie timer
        this.updateTimer(deltaTime);
        
        // Check for plant collision
        this.checkPlantCollision(currentTime);
        
        // Check if reached the house
        if (this.position.x <= -50) {
            if (window.gameEngine) {
                window.gameEngine.events.emit('zombieReachedHouse', this);
            }
            this.isAlive = false;
            return;
        }
        
        // Move if not eating
        if (!this.isEating) {
            this.move(deltaTime);
        }
    }
    
    updateTimer(deltaTime) {
        if (this.timerPaused) {
            this.timerPauseDuration -= deltaTime * 1000;
            if (this.timerPauseDuration <= 0) {
                this.timerPaused = false;
                this.timerPauseDuration = 0;
            }
            return;
        }
        
        this.timer -= deltaTime * 1000;
        
        // Timer effects when it expires
        if (this.timer <= 0) {
            this.timer = 0;
            this.onTimerExpire();
        }
        
        // Speed boost when timer is low
        if (this.timer < 10000 && this.timer > 0) {
            this.speed = this.baseSpeed * 1.5; // 50% speed boost
        }
    }
    
    onTimerExpire() {
        // Default behavior: speed boost
        this.speed = this.baseSpeed * 2;
    }
    
    pauseTimer(ms) {
        this.timerPaused = true;
        this.timerPauseDuration = Math.max(this.timerPauseDuration, ms);
    }
    
    getTimer() {
        return Math.max(0, this.timer);
    }
    
    move(deltaTime) {
        // Speed is in pixels per second, multiply by deltaTime for smooth movement
        // Base speed from config is ~0.3, scale up to make zombies move visibly (~30 pixels/sec)
        this.position.x -= this.speed * 100 * deltaTime;
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
        }
    }
    
    checkPlantCollision(currentTime) {
        if (!window.gameEngine) return;
        
        const plants = window.gameEngine.plants.filter(p => 
            p.row === this.row && 
            p.isAlive &&
            Math.abs(p.position.x - this.position.x) < 50
        );
        
        if (plants.length > 0) {
            this.isEating = true;
            this.target = plants[0];
            
            // Attack plant
            if (currentTime - this.lastAttackTime >= this.attackInterval) {
                this.attack();
                this.lastAttackTime = currentTime;
            }
        } else {
            this.isEating = false;
            this.target = null;
        }
    }
    
    attack() {
        if (this.target && this.target.isAlive) {
            this.target.takeDamage(this.damage);
            playSound('chomp');
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            if (window.gameEngine) {
                window.gameEngine.events.emit('zombieKilled', this);
            }
            playSound('zombiedeath');
        }
    }
    
    // Instantly kill zombie when challenge is solved
    instantKill() {
        this.challengeSolved = true;
        this.health = 0;
        this.isAlive = false;
        
        // Add death animation
        if (this.element) {
            this.element.classList.add('zombie-dissolved');
        }
        
        if (window.gameEngine) {
            window.gameEngine.events.emit('zombieKilled', this);
        }
        playSound('zombiedeath');
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Normal Zombie
class NormalZombie extends Zombie {
    constructor(row, x) {
        super('normal', row, x);
    }
}

// Conehead Zombie - more health
class ConeheadZombie extends Zombie {
    constructor(row, x) {
        super('conehead', row, x);
    }
}

// Buckethead Zombie - much more health
class BucketheadZombie extends Zombie {
    constructor(row, x) {
        super('buckethead', row, x);
    }
}

// BOSS ZOMBIE - The Ultimate Challenge
// Features: High HP, instant kill, roams lanes, difficult coding challenges
class BossZombie extends Zombie {
    constructor(row, x) {
        super('boss', row, x);
        
        // Override with boss stats
        this.health = CONFIG.ZOMBIE_STATS.boss.health;
        this.maxHealth = CONFIG.ZOMBIE_STATS.boss.health;
        this.speed = CONFIG.ZOMBIE_STATS.boss.speed;
        this.damage = CONFIG.ZOMBIE_STATS.boss.damage; // Damage per attack
        
        // Boss unique behaviors
        this.laneChangeInterval = CONFIG.ZOMBIE_STATS.boss.laneChangeInterval;
        this.roamInterval = CONFIG.ZOMBIE_STATS.boss.roamInterval;
        this.lastLaneChange = 0;
        this.lastRoam = 0;
        this.targetCol = 8; // Start from right, will walk into grid
        this.currentCol = 8;
        this.isRoaming = true;
        this.minX = CONFIG.GRID_LEFT_OFFSET; // Don't cross lawnmower line
        this.hasKilledAllPlants = false;
        this.hasEnteredGrid = false; // Track if boss has entered the grid
        
        // Lane change idle - boss stands still for 5 seconds after changing lanes
        this.isLaneChangeIdle = false;
        this.laneChangeIdleStart = 0;
        
        // Idle behavior - boss stands and thinks
        this.idleDuration = 3000; // Stand idle for 3 seconds
        this.idleStartTime = 0;
        this.isIdle = false;
        this.idleCooldown = 8000; // Wait 8 seconds between idle periods
        this.lastIdleEnd = 0;
        
        // Lawnmower hit tracking
        this.lawnmowerHitCount = 0;
        
        // Lane highlight element
        this.laneHighlight = null;
        
        // Boss width for calculations
        this.bossWidth = 180;
        
        // Don't clamp initial position - let boss walk in from right side like other zombies
        
        // Visual states
        this.visualState = 'walking'; // Start walking since coming from right
        
        // Override timer - boss has longer timer
        this.timer = 120000; // 2 minutes
    }
    
    create() {
        const zombieDiv = createElement('div', {
            class: 'zombie boss-zombie',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        // Boss uses special image
        const img = createElement('img', {
            src: 'assets/images/boss zombie thinking main.webp',
            alt: 'Boss Zombie',
            class: 'boss-img'
        });
        
        // Boss name label
        const nameLabel = createElement('div', {
            class: 'boss-name'
        });
        nameLabel.innerHTML = '💀 BOSS 💀';
        
        // Challenge indicator - larger for boss
        const challengeIcon = createElement('div', {
            class: 'zombie-challenge-icon boss-challenge-icon',
            title: `🔥 BOSS CHALLENGE: ${this.challenge.title}`
        });
        challengeIcon.innerHTML = '🔥💻🔥';
        const zombieInstance = this;
        challengeIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('=== BOSS ZOMBIE CHALLENGE CLICKED ===');
            if (window.gameEngine && window.gameEngine.codingMode) {
                window.gameEngine.codingMode.openZombieChallenge(zombieInstance);
            }
        });
        
        // Health bar - larger for boss
        const healthBar = createElement('div', { class: 'zombie-health-bar boss-health-bar' });
        const healthFill = createElement('div', { class: 'zombie-health-fill boss-health-fill' });
        healthFill.style.width = '100%';
        healthBar.appendChild(healthFill);
        
        // Lane indicator
        const laneIndicator = createElement('div', {
            class: 'boss-lane-indicator'
        });
        
        zombieDiv.appendChild(nameLabel);
        zombieDiv.appendChild(img);
        zombieDiv.appendChild(challengeIcon);
        zombieDiv.appendChild(healthBar);
        zombieDiv.appendChild(laneIndicator);
        this.element = zombieDiv;
        
        return zombieDiv;
    }
    
    update(deltaTime, currentTime) {
        if (!this.isAlive) return;
        
        // Update zombie timer
        this.updateTimer(deltaTime);
        
        // Update lane highlight
        this.updateLaneHighlight();
        
        // Boss unique behaviors
        this.updateLaneChange(deltaTime, currentTime);
        this.updateRoaming(deltaTime, currentTime);
        
        // Handle idle state
        this.updateIdleState(currentTime);
        
        // Check for plant collision
        this.checkPlantCollision(currentTime);
        
        // Check if can advance (only after all plants killed)
        this.checkCanAdvance();
        
        // Move if not eating, not idle, and not in lane change idle
        if (!this.isEating && !this.isIdle && !this.isLaneChangeIdle) {
            this.move(deltaTime);
        }
        
        // Update visual state
        this.updateVisualState();
    }
    
    updateIdleState(currentTime) {
        // Check if should start being idle
        if (!this.isIdle && !this.isEating && currentTime - this.lastIdleEnd >= this.idleCooldown) {
            // Random chance to become idle
            if (Math.random() < 0.02) { // 2% chance per frame
                this.isIdle = true;
                this.idleStartTime = currentTime;
                this.visualState = 'idle';
                console.log('Boss is thinking...');
            }
        }
        
        // Check if idle period is over
        if (this.isIdle && currentTime - this.idleStartTime >= this.idleDuration) {
            this.isIdle = false;
            this.lastIdleEnd = currentTime;
            console.log('Boss finished thinking!');
        }
    }
    
    updateLaneHighlight() {
        // Create or update lane highlight
        if (!this.laneHighlight) {
            this.laneHighlight = document.createElement('div');
            this.laneHighlight.className = 'boss-lane-highlight';
            const lawn = document.getElementById('lawn');
            if (lawn) {
                lawn.appendChild(this.laneHighlight);
            }
        }
        
        // Position the highlight on the row where boss's FEET are (actual damage row)
        // Boss image spans 3 rows, so the highlight should be on the bottom row (row + 2)
        // But we clamp to valid row range
        const feetRow = Math.min(this.row + 2, CONFIG.GRID_ROWS - 1);
        if (this.laneHighlight) {
            const rowY = CONFIG.LANES[feetRow];
            this.laneHighlight.style.top = `${rowY}px`;
            this.laneHighlight.style.left = `${CONFIG.GRID_LEFT_OFFSET}px`;
            this.laneHighlight.style.width = `${CONFIG.GRID_COLS * CONFIG.CELL_WIDTH}px`;
            this.laneHighlight.style.height = `${CONFIG.CELL_HEIGHT}px`;
        }
    }
    
    updateLaneChange(deltaTime, currentTime) {
        // Don't change lanes if currently in post-lane-change idle
        if (this.isLaneChangeIdle) {
            if (currentTime - this.laneChangeIdleStart >= 5000) { // 5 second idle after lane change
                this.isLaneChangeIdle = false;
                console.log('Boss finished thinking after lane change');
            }
            return;
        }
        
        // Boss randomly switches lanes (only after 15 seconds in current lane)
        if (currentTime - this.lastLaneChange >= this.laneChangeInterval) {
            this.lastLaneChange = currentTime;
            
            // Random lane change - ensure within valid rows (0 to GRID_ROWS-1)
            const newRow = Math.floor(Math.random() * CONFIG.GRID_ROWS);
            // Clamp to valid range
            const clampedRow = Math.max(0, Math.min(newRow, CONFIG.GRID_ROWS - 1));
            
            if (clampedRow !== this.row) {
                this.row = clampedRow;
                this.position.y = CONFIG.LANES[this.row];
                if (this.element) {
                    this.element.style.top = `${this.position.y}px`;
                    // Add lane switch animation
                    this.element.classList.add('boss-lane-switch');
                    setTimeout(() => {
                        if (this.element) this.element.classList.remove('boss-lane-switch');
                    }, 500);
                }
                console.log(`Boss switched to lane ${this.row}! Now standing idle for 5 seconds...`);
                
                // Start 5 second idle after lane change
                this.isLaneChangeIdle = true;
                this.laneChangeIdleStart = currentTime;
                this.visualState = 'idle';
            }
        }
    }
    
    updateRoaming(deltaTime, currentTime) {
        // Boss roams back and forth across the grid
        if (currentTime - this.lastRoam >= this.roamInterval && this.isRoaming) {
            this.lastRoam = currentTime;
            
            // Check if any plants exist
            const plantsExist = window.gameEngine && window.gameEngine.plants.some(p => p.isAlive);
            
            if (plantsExist) {
                // Roam towards plants
                const nearestPlant = this.findNearestPlant();
                if (nearestPlant) {
                    // Move towards that column
                    this.targetCol = nearestPlant.col;
                }
            }
        }
    }
    
    findNearestPlant() {
        if (!window.gameEngine) return null;
        const alivePlants = window.gameEngine.plants.filter(p => p.isAlive);
        if (alivePlants.length === 0) return null;
        
        // Find plant in same row first, then any plant
        const sameRowPlants = alivePlants.filter(p => p.row === this.row);
        if (sameRowPlants.length > 0) {
            return sameRowPlants.reduce((closest, p) => 
                Math.abs(p.position.x - this.position.x) < Math.abs(closest.position.x - this.position.x) ? p : closest
            );
        }
        
        return alivePlants[Math.floor(Math.random() * alivePlants.length)];
    }
    
    checkCanAdvance() {
        // Boss only advances past lawnmower line after killing all plants
        if (!window.gameEngine) return;
        
        const plantsExist = window.gameEngine.plants.some(p => p.isAlive);
        
        if (!plantsExist) {
            this.hasKilledAllPlants = true;
            this.minX = -100; // Can now reach the house
            console.log('Boss has killed all plants! Advancing to house!');
        }
    }
    
    move(deltaTime) {
        // Get the boss zombie width from the element or use default
        const bossWidth = this.element ? this.element.offsetWidth : this.bossWidth;
        
        // Define lawn boundaries - boss must stay within the grid
        const minGridX = CONFIG.GRID_LEFT_OFFSET;
        const maxGridX = CONFIG.GRID_LEFT_OFFSET + (CONFIG.GRID_COLS * CONFIG.CELL_WIDTH) - bossWidth;
        
        // Check if boss has entered the grid
        if (!this.hasEnteredGrid && this.position.x <= maxGridX) {
            this.hasEnteredGrid = true;
            console.log('Boss has entered the grid!');
        }
        
        // Track if boss is moving
        let isMoving = false;
        
        // If boss hasn't entered grid yet, just walk left towards grid
        if (!this.hasEnteredGrid) {
            this.position.x -= this.speed * 100 * deltaTime;
            isMoving = true;
        } else {
            // Boss is in the grid - normal roaming behavior
            // Calculate target X based on targetCol
            const targetX = CONFIG.GRID_LEFT_OFFSET + (this.targetCol * CONFIG.CELL_WIDTH);
            
            // Clamp targetCol to valid range
            const maxCol = CONFIG.GRID_COLS - 3; // Leave room for boss width (about 2-3 cells)
            if (this.targetCol > maxCol) {
                this.targetCol = maxCol;
            }
            
            // Move towards target
            if (Math.abs(this.position.x - targetX) > 5) {
                const direction = targetX < this.position.x ? -1 : 1;
                this.position.x += direction * this.speed * 100 * deltaTime;
                isMoving = true;
            } else {
                // At target, move left towards plants/house
                if (this.position.x > this.minX) {
                    this.position.x -= this.speed * 80 * deltaTime;
                    isMoving = true;
                }
            }
            
            // Clamp to stay within grid area (don't go off right side)
            if (this.position.x > maxGridX) {
                this.position.x = maxGridX;
            }
            
            // Clamp to minX (don't cross lawnmower line)
            if (this.position.x < this.minX && !this.hasKilledAllPlants) {
                this.position.x = this.minX;
            }
        }
        
        // Update visual state based on movement
        if (!this.isEating) {
            this.visualState = isMoving ? 'walking' : 'idle';
        }
        
        // Check if reached house
        if (this.position.x <= -50 && this.hasKilledAllPlants) {
            if (window.gameEngine) {
                window.gameEngine.events.emit('zombieReachedHouse', this);
            }
            this.isAlive = false;
        }
        
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
        }
    }
    
    checkPlantCollision(currentTime) {
        if (!window.gameEngine) return;
        
        // Boss checks all rows near its position for plants (since it roams)
        const plants = window.gameEngine.plants.filter(p => 
            p.row === this.row && 
            p.isAlive &&
            Math.abs(p.position.x - this.position.x) < 60
        );
        
        if (plants.length > 0) {
            this.isEating = true;
            this.target = plants[0];
            this.visualState = 'attacking';
            
            // Attack plant - INSTANT KILL
            if (currentTime - this.lastAttackTime >= 500) { // Faster attack
                this.attack();
                this.lastAttackTime = currentTime;
            }
        } else {
            this.isEating = false;
            this.target = null;
            // Walking when moving, idle when stationary
            this.visualState = 'walking';
        }
    }
    
    attack() {
        if (this.target && this.target.isAlive) {
            // Boss attacks plants multiple times
            // Normal plants: ~300 HP, 3 attacks x 150 damage = 450 (kills in 3 hits)
            // Wallnut: ~500 HP, 5 attacks x 150 damage = 750 (kills in ~4-5 hits)
            const damage = this.damage;
            this.target.health -= damage;
            
            playSound('chomp');
            console.log(`Boss attacked plant! Plant health: ${this.target.health}`);
            
            // Boss attack visual feedback
            if (this.element) {
                this.element.classList.add('boss-attack-flash');
                setTimeout(() => {
                    if (this.element) this.element.classList.remove('boss-attack-flash');
                }, 300);
            }
            
            // Check if plant is dead
            if (this.target.health <= 0) {
                this.target.health = 0;
                this.target.isAlive = false;
                this.target.destroy();
                
                // Remove from game engine
                if (window.gameEngine) {
                    const idx = window.gameEngine.plants.indexOf(this.target);
                    if (idx > -1) {
                        window.gameEngine.plants.splice(idx, 1);
                    }
                    // Update grid
                    window.gameEngine.grid[this.target.row][this.target.col] = null;
                }
                
                console.log('Boss killed a plant!');
                this.target = null;
            }
        }
    }
    
    updateVisualState() {
        if (!this.element) return;
        const img = this.element.querySelector('.boss-img');
        if (!img) return;
        
        // Determine correct visual state based on current behavior
        let newSrc = 'assets/images/boss zombie thinking main.webp'; // idle/thinking
        
        // If in lane change idle, force idle state
        if (this.isLaneChangeIdle || this.isIdle) {
            newSrc = 'assets/images/boss zombie thinking main.webp';
        } else if (this.visualState === 'walking') {
            newSrc = 'assets/images/boss zombie running.webp';
        } else if (this.visualState === 'attacking') {
            newSrc = 'assets/images/boss zombie attack.webp';
        }
        
        // Decode URL to compare properly (spaces become %20)
        const currentSrc = decodeURIComponent(img.src);
        const newFilename = newSrc.split('/').pop();
        
        if (!currentSrc.endsWith(newFilename)) {
            img.src = newSrc;
            console.log(`Boss visual state changed to: ${this.visualState}, src: ${newSrc}`);
        }
    }
    
    // Boss takes damage from plants
    takeDamage(damage) {
        // Boss takes full damage from plants (no reduction)
        this.health -= damage;
        this.updateHealthBar();
        
        console.log(`Boss took ${damage} damage! Health: ${this.health}/${this.maxHealth}`);
        
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            if (window.gameEngine) {
                window.gameEngine.events.emit('zombieKilled', this);
                window.gameEngine.events.emit('bossKilled', this);
            }
            playSound('zombiedeath');
            console.log('Boss zombie defeated by plant damage!');
            
            // Remove lane highlight
            if (this.laneHighlight) {
                this.laneHighlight.remove();
                this.laneHighlight = null;
            }
        }
    }
    
    // Instant kill when challenge solved - the REAL way to beat the boss
    instantKill() {
        this.challengeSolved = true;
        this.health = 0;
        this.isAlive = false;
        
        // Remove lane highlight
        if (this.laneHighlight) {
            this.laneHighlight.remove();
            this.laneHighlight = null;
        }
        
        // Epic death animation for boss
        if (this.element) {
            this.element.classList.add('boss-dissolved');
        }
        
        if (window.gameEngine) {
            window.gameEngine.events.emit('zombieKilled', this);
            window.gameEngine.events.emit('bossKilled', this);
        }
        
        playSound('zombiedeath');
        console.log('BOSS DEFEATED BY CODING CHALLENGE!');
    }
}

// Zombie Factory
function createZombie(type, row, x = 850) {
    switch(type) {
        case 'normal':
        case 0:
            return new NormalZombie(row, x);
        case 'conehead':
        case 1:
            return new ConeheadZombie(row, x);
        case 'buckethead':
        case 2:
            return new BucketheadZombie(row, x);
        case 'boss':
        case 3:
            return new BossZombie(row, x);
        default:
            return new NormalZombie(row, x);
    }
}
