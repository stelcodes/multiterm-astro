---
title: "Strings in Go"
published: 2024-02-06
draft: false
description: "Strings in Go"
coverImage:
    src: "../images/go-blue.png"
    alt: "gopher"
tags: ["Go"]
---

Strings in Go are represented as Unicode. Unicode represents numbers that are bigger than what can fit into a byte. On the other hand, a Rune is the Go equivalent of what you think of as a character. A rune in Go can also be known as a wide character in other languages. A rune can fit any logical printable character, even Chinese characters!

In order to make programs more efficient, we don't want to refer to every character all the time with more bytes (Unicode), since many programs will primarily use English characters (ASCII characters). There is an efficient way of encoding Unicode called UTF-8, which is a compact way of representing Unicode in bytes.


<Notice type="note">Strings are physically the UTF-8 encoding of Unicode, also known as bytes in Go.</Notice>

A rune is a synonym for int32 (32-bit integer), also known as Unicode.
A byte is a synonym for uint8 (8-bit integer).

A string is physically a sequence of bytes and logically a sequence of Unicode (also known as runes). They are the UTF-8 encoding of Unicode characters. Also, ASCII characters fit into the range 0-127. So if you see numbers outside of this range, you know it's not ASCII.

```go
package main  
  
import "fmt"  
  
func main() {  
    s := "èlite"  
    b := []byte(s)  
    fmt.Printf(" %d", len(b))  
}
```
The output is 6.

Why? The length of the string in a program is the length of the byte string necessary to encode it in UTF-8. Visually it is 5 characters, but the length is 6. If you want the length of the string, you have to ask yourself, how many bytes does the string represent?

6 represents the length of the byte string necessary to encode the string in UTF-8. This string is still 6 bytes in UTF-8 encoding. The length of the string does not represent the number of Unicode characters.

To solidify this concept, here are 2 slices taken from a string:

```go
s := "hello, world"
hello := s[:5]
world := s[7:]
```
Here is the graphical view of the above code:

![image of go string](https://github.com/hamza-m-masood/multiterm-astro/blob/main/src/content/images/go-string.png?raw=true)

s is a string descriptor. A descriptor is not a pointer; it describes something and has a pointer within it. The descriptor also includes the length of the string. Also, note that the end of the string does not have a null byte like in other programming languages.

The main takeaway here is that s, hello, and world are all substrings and are reusing the same immutable memory.

For example, if you define t := s, then this means t has the same length and is pointing to the same bytes or area in memory, but it is a different descriptor because it is named t and not s.
