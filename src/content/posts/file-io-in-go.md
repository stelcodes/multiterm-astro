---
title: "File i/o in Go"
published: 2024-02-06
draft: false
description: "Learn about File i/o in Go"
coverImage:
    src: "../images/go2.png"
    alt: "gopher"
tags: ["Go"]
---

## Printing in Golang

Go has many ways to print. All printing functions stem from the `fmt` package.

There are 3 families of printing functions:

First family

- `fmt.Println` prints to os.Stdout by default
- `fmt.Printf` allows you to format the string. For example `%d` is the format code for integers.

Second family

- `fmt.Fprintln` can define an output identifier. For example os.Stdout 
- `fmt.Fprintf` can define an output identifier. And also format the string.

Third family

- `fmt.Sprintln` outputs a string to a variable instead of an output identifier
- `fmt.Sprintf ` outputs to a string but also format the string.


## File I/O Packages
1. Os package: has functions to open and create files, list directories etc... and has the `File` type
2. Io package: has utilities to read and write
3. Bufio pakcage: provides buffered i/o scanners etc...
4. Io/ioutil package: has extra utilities such as reading and an entire file to memory, or writing it all out at once
5. Strconv package: has utilities to convert to/from string representations

## Misc commands for files:
- Opening a file: `os.Open(fname)`
- Copying from a file to standard output: `io.Copy(os.Stdout, file)`
- Reading all the data from a file (without buffering): `ioutil.ReadAll(file)`
- Using bufio to scan a file:
```go
scan := bufio.NewScanner(file)
for scan.Scan() {
//this will by default iterate over every line in the file
}
```
