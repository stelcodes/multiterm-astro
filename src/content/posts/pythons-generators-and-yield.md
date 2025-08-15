---
title: "Python's Generators and Yield"
published: 2025-07-11
draft: false
description: 'Learn how to use generators and the yield keyword in Python for efficient iteration.'
series: 'Python Basics'
tags: ['python']
---

Generators in Python are a way to create iterators using the `yield` keyword. Here's an example:

```python
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

for number in count_up_to(5):
    print(number)
```

Generators are memory-efficient and allow you to work with large datasets without loading them entirely into memory.

```shell title="Running Python Generators"
python -c "def count_up_to(n):\n    count = 1\n    while count <= n:\n        yield count\n        count += 1\nfor number in count_up_to(5):\n    print(number)"
```
