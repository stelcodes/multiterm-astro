---
title: "Python's List Comprehensions"
published: 2025-07-07
draft: false
description: 'Learn how to use list comprehensions in Python for concise and readable code.'
series: 'Python Basics'
tags: ['python']
---

List comprehensions provide a concise way to create lists in Python. Here's an example:

```python
# Create a list of squares
squares = [x**2 for x in range(10)]
print(squares)

# Filter even numbers
evens = [x for x in range(10) if x % 2 == 0]
print(evens)

# Nested comprehensions
matrix = [[i * j for j in range(5)] for i in range(5)]
print(matrix)
```

List comprehensions are a powerful feature for creating and transforming lists in Python.

```shell title="Running Python List Comprehensions"
python -c "print([x**2 for x in range(10)])"
```
