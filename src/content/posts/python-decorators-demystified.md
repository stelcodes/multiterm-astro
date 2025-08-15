---
title: 'Python Decorators Demystified'
published: 2025-07-03
draft: false
description: 'An introduction to Python decorators and how to use them effectively.'
series: 'Python Basics'
tags: ['python']
---

Decorators in Python are a powerful way to modify the behavior of functions or methods. Here's a simple example:

```python
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):
        print(f"Wrapper executed before {original_function.__name__}")
        return original_function(*args, **kwargs)
    return wrapper_function

@decorator_function
def say_hello():
    print("Hello!")

say_hello()
```

Decorators can also be used with arguments:

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("Hi!")

greet()
```

Decorators are widely used in Python for logging, access control, and more.

```shell title="Running Python Decorators"
python -c "@decorator_function\ndef say_hello():\n    print(\"Hello!\")\nsay_hello()"
```
