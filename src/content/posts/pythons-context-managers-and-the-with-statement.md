---
title: "Python's Context Managers and the with Statement"
published: 2025-07-15
draft: false
description: 'Learn how to use context managers and the with statement in Python for resource management.'
series: 'Python Basics'
tags: ['python']
---

Context managers in Python are used to manage resources efficiently. Here's an example:

```python
with open('example.txt', 'w') as file:
    file.write('Hello, world!')
```

You can also create custom context managers using classes or the `contextlib` module:

```python
from contextlib import contextmanager

@contextmanager
def custom_context():
    print('Entering context')
    yield
    print('Exiting context')

with custom_context():
    print('Inside context')
```

Context managers ensure that resources are properly cleaned up, making your code more reliable and maintainable.

```shell title="Using Python Context Managers"
python -c "with open('example.txt', 'w') as file: file.write('Hello, world!')"
```
