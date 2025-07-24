---
title: "Functions in Go"
published: 2024-02-06
draft: false
description: "Learn about Functions in Go"
coverImage:
    src: "../images/go3.png"
    alt: "gopher"
tags: ["Go"]
---

## Some Terminology 
- The signature of a function is the order and type of its parameters and return values.
- The definition of structural typing is deriving the type of an object from it's structure. For example, the type of a function is it's signature.
- Formal parameters: the parameters that you define when creating a function. Also, formal parameters are seen as local variables to a function.
- Actual parameters: the parameters that you define when calling the function.
- Passing by value: copying the data and getting a new reference.
- Passing by reference: The function can modify the actual paramter such that the caller sees the change.

## Pass by reference/pass by value

By value parameters (underlying data structure is copied):
- number
- bool
- arrays
- structs
By reference parameters:
- things passed in by pointer (&x)
- strings (but they're immutable)
- slices
- maps
- channels

## Example of pass by reference with a map
```go
func do(m1 map[int]int) {  
    m1[3] = 0  
    m1 = make(map[int]int)  
    m1[4] = 4  
    fmt.Println("m1", m1)  
}  
func main() {  
    m := map[int]int{4: 1, 7: 2, 8: 3}  
    do(m)  
    fmt.Println("m", m)  
}
```

Output:
```
m1 map[4:4]
m map[3:0 4:1 7:2 8:3]
```
`m1` does not change m after it gets reassigned because it should be seen as a local variable.

## Example of pass by reference with a map pointer
```go
func do(m1 *map[int]int) {  
    (*m1)[3] = 0  
    (*m1) = make(map[int]int)  
    (*m1)[4] = 4  
    fmt.Println("m1", *m1)  
}  
  
func main() {  
    m := map[int]int{4: 1, 7: 2, 8: 3}  
  
    do(&m)  
    fmt.Println("m", m)  
}
```
output:
```
m1 map[4:4]
m map[4:4]
```
`m1` does change m now when it is reassigned. The map descriptor gets copied but `m1` has a reference to the original hash table. `m1` has the address of the original map descriptor. When `m1` gets reassigned, it changes both map descriptors in the `do` and the main function.


<Notice type="note">Every parameter is pass by value in go.</Notice>

All parameters are passed by copying something by value. The formal parameter is a local variable in the function and gets assigned/copies the value of the actual parameter. If that value is a descriptor then you are referring to something that is referred outside the function. So whatever you change in the function will change what is outside the function. Refer to the diagram image in the [Strings in Golang blog](/blog/1-golang-strings). With this you can think of t as the actual parameter, and the formal parameter copying the t descriptor. So if you change the t descriptor in the local variable, it will change the actual t parameter.

If the object copied is a pointer or a descriptor, then the shared backing store (array, hash table, etc..) can be changed through it. Thus we think of it as pass by reference.

For example, if you give a slice as a parameter, then the slice descriptor of the parameter passed in gets copied to the slice descriptor of the formal parameter. They both point to same table of data in memory. Thus, we think of slices as "by reference" even though the slice descriptor was copied to the formal parameter. Maps have the same concept, if you pass in a map as a parameter, you are copying the map descriptoer, making it "pass by reference"

Finally, If you pass in a pointer to the map descriptor, and change the formal parameter passed in. You would be changing the map descriptor in the local function and also the main function.

```go
b []int
fmt.Printf("b: %p\n", b)
```
This prints the pointer that the slice has within it (within it's descriptor). So it is pointing to the address of the first element. 

## Pointers

- Using & would output the address
- Using * would dereference the pointer and output the actual value

## Points to not for the Defer function
```go
defer a()
defer b()
```

defer b will be called then defer a would be called. They are stacked. First in last out (FILO)

```go
func main() {  
    f := os.Stdin  
  
    if len(os.Args) > 1 {  
       if f, err := os.Open(os.Args[1]); err == nil {  
          ...  
       }  
       defer f.Close()  
    }  
}
```
defer will run before the main function exits. It will not run when the if statement exists. Because defer is function scoped, not block scoped. Defer will ONLY run when the function exists.

 ```go
 a:= 10
 defer fmt.Println(a)
 a = 11
 fmt.Println(a)
```
output:
```
11, 10
```
This is because defer copies the value. 10 is the value that `a` had when the call was deferred.
This is why you put the defer function at the end.
