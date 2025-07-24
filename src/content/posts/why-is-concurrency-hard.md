---
title: "Why Is Concurrency Hard?"
published: 2024-02-06
draft: false
description: "Why Is Concurrency Hard?"
coverImage:
    src: "../images/concurrency.png"
    alt: "gopher"
tags: ["Go"]
---

Concurrency can be extrememly difficult to get right. Bugs can occur even after many iterations. Bugs can also occur after some change in timing from heavier disk utilization or more users logging in.

Running into concurrency issues is so common that we are now able to label common pitfalls. Below I have listed the most common issues of working with concurrency:

## Race Conditions
A race condition occurs when two or more processes must execute in a specific order, but the program allows for the operations to occur in any order, or an order that causes an error.
A classic example is one concurrent operation trying to read from a variable while (potentially) at the same time another concurrent operation is trying to write to it.
```go showLineNumbers
package main

import "fmt"

func main() {
	var data int
	go func() {
		data++
	}()
	if data == 0 {
		fmt.Println(data)
	}
}
```
one of 3 outcomes will occur:\
1. The go func at line 7 executes before the if statement at line 10 and 11 so nothing will be printed. This is what we would expect if the code was synchronous.
2. The if statement at line 10 and 11 executes before the go function at line 7 so 0 will be printed.
3. Perhaps the most unexpected case is that 1 will be printed. I would like for you to think how that would be possible.


<Accordion client:load title="Click here to see the reasoning for the 3rd outcome">
The output could be 1 because line 10 could run before line 8, and line 8 could run before line 11. In other words, the data variable increment executes after the check in the if statement but before the printing of the data variable.
</Accordion>

As you can see even a small snippet of code can lead to many outcomes. This is why every outcome must be thought of in order to not have a race conditions.

Thinking about a large passage of time between nondeterministic operations may help when reasoning about the different outcomes. For example, what would happen if an hour passed before the goroutine at line 7 could start? What would would happen if an hour passed after the check for the data variable at line 10?

Having a data race is quite hard to spot if you do not have all the outcomes noted down like above. This can be quite challenging in moderate to large size codebase. Another technique that may help for debugging would be to add sleep statements at different areas of the program. For example, a sleep statement could be added after line 7 before the data increment. This will most likely give enough time for the if statement to run before the data is incremented. But please remember:

<Notice type="warning">
Adding sleep statements is not a solution to the race condition!
</Notice>

We have simply made it increasingly unlikely for our program to product the "incorrect" output. All 3 scenarios could still potentially occur. The longer we sleep, the closer the program gets to logical correctness, but it will never be fully logically correct with the sleep statement. Adding sleep statements in your program will obviously decrease the performance as well.

Another technique that might help in detecting race conditions is testing your program in different environments. Data races normally tend to occur when there is a change in an environment that was not thought of like a variation in memory or CPU.

## Atomicity

If series of executions can in it's entirity without interruption in the defined context, then they are considered to be atomic.\
Atomic comes from the greek word Atom. Which means indivisible. Obviously, in modern physics we know this is not true. But it does bring the point across of a process or an execution being indivisible and uninterruptable.

It is important to think about the context of the running execution when we want to solve the problem of Atomicity. A process might be atomic in the context of the program but not in the context of the operating system. A process might be atomic in the context of the operating system but not in the context of the machine.

A very basic example would be incrememnting a variable:
```go showLineNumbers=false
i++
```

This operation may seem atomic but it abstracts a lot of the details for our convenience (and maybe our detriment). Here are all the operations that take place:

1. Read `i`
2. Increment `i`
3. Store `i`

Multiple steps are completed from a simple statement.Each step within the process is atomic but the process as a whole is not.

Most statements are not atomic. Thus proving another reason why concurrency can be very challenging.

## Memory Access Synchronization

There is a difference between a **data race** and a **race condition**. A race condition occurs when the order of executions are nondeterministic. A data race occurs when many sections of the program are trying to access the same data. A need arises to synchroinze memory when there is a data race.

<Notice type="note">
If a section in a program is accessing a shared piece of memory, then it is known as a critical section
</Notice>

Let's define all the critical sections in the following program:

```go
 var data int
 go func() {
 	data++
 }()
 if data == 0 {
 	fmt.Println("the value is 0")
 } else {
 	fmt.Printf("the value is %v", data)
 }
```
The shared resource is the data variable on line 1
- Line 3: The goroutine increments the data variable
- Line 5: The if statement checks for the value of the data variable
- Line 8: Printing of the data variable

Let's try to synchronize the data with `sync.Mutex`:

```go
var memoryAccess sync.Mutex
	var data int
	go func() {
		memoryAccess.Lock()
		data++
		memoryAccess.Unlock()
	}()
	memoryAccess.Lock()
	if data == 0 {
		fmt.Println("the value is 0")
	} else {
		fmt.Printf("the value is %v", data)
	}
	memoryAccess.Unlock()
```

I lock the access before and after the critical section. We now have fully synchronized the data access. Although we have solved the data race through synchronization, we still have a race condition. We have also introduced other problems:

1. Using the `sync.Mutex` to lock data and unlock data is a **convention**. It's difficult for developers to follow convetions especially when there are time sensitive tasks that need to be done, on a moderate to large size code-base. Unfortunately, if you go ahead with using this approach then you need to make sure it is followed 100% of the time to not come across any data race problems.
2. As mentioned before even though we have solved the data race problem, we have not solved the race condition. We have only narrowed the scope of non-determinism, but overall the order of operations is still non-deterministic. We don't know if the goroutine is going to run before or after the if statement.
3. Ther are some performance rammifications that happen when you synchronize data. The program pauses for a short period of time on every call to Lock.

Knowing what data needs to be synchronized and how frequently you need to lock data, and what size your ciritical sections should be is very difficult to judge.

---

If all problems of the previous section are addressed then you will never get a wrong output. The following problems are for your program to always be doing work. In other words, the program has something useful to do at all times:

## Deadlock

A deadlock happens when all goroutines are blocked. This can happen when all goroutines are waiting for eachother. In this case, your program will not work without manual intervention. Here is an example of a deadlock:

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

type value struct {
	mu    sync.Mutex
	value int
}

func main() {
	var wg sync.WaitGroup
	printSum := func(v1, v2 *value) {
		defer wg.Done()
		v1.mu.Lock()
		defer v1.mu.Unlock()

		time.Sleep(2 * time.Second)
		v2.mu.Lock()
		fmt.Printf("sum=%v\n", v1.value+v2.value)
	}
	var a, b value
	wg.Add(2)
	go printSum(&a, &b)
	go printSum(&b, &a)
	wg.Wait()
}
```
The first function call to `PrintSum` locks `a` and attempts to lock `b`. The second call to `PrintSum` locks `b` and attempts to lock `a`. Both go routines are now waiting on eachother.

Deadlocks can be hard to spot. A technique that can help us identify them are the Coffman Conditions. The Coffman Conditions were invented in 1971 in order to help us identify deadlocks. They state the following:

- **Mutual Exclusion**: A concurrent process holds exclusive rights to a resource at any one time.
- **Wait For Condition**: A concurrent process must simultaneously hold a resource and be waiting for an additional resource.
- **No Preemption**: A resource held by a concurrent process can only be released by that process, so it fulfills this condition.
- **Circular Wait**: A concurrent process (P1) must be waiting on a chain of other concurrent pro‐ cesses (P2), which are in turn waiting on it (P1), so it fulfills this final condition too.

The program above fulfills all of the conditions. Hence the reason for having a deadlock.

## Livelock

A very famous example of a livelock would be the following:
Imagine you were in a tight corridor. There is just enough space for two people to walk. You come face to face with another person. You move left, the other person moves left as well in an attempt to walk by. You move right, the other person moves right as well. Both people become stuck in this state of hallway shuffle moving left and right continuously!

This occurs when two goroutines or concurrent processes are trying to prevent deadlock but without any communication. Livelocks are especially difficult to spot because your program can seem like it is doing work but in actuality it is just burning rubber.

Livelock is a subset of a larger problem called starvation.

## Starvation

A greedy goroutine means when one goroutine gets in the way of other goroutines. When you have a greedy goroutine, other concurrent processes can't find resources to perform their work. This is an example of starvation. A goroutine can also suffer finding resources from outside the Go program as well. Lack of CPU power, database connection, lack of memory etc.. can all lead to starvation. Starvation is relatively easy to spot when external factors are in play but can be quite difficult to spot when goroutines are competing against eachother.

Here is an example of a greedy goroutine and a polite goroutine:

```go
	var wg sync.WaitGroup
	var sharedLock sync.Mutex
	const runtime = 1 * time.Second

	greedyWorker := func() {
		defer wg.Done()
		var count int
		for begin := time.Now(); time.Since(begin) <= runtime; {
			sharedLock.Lock()
			time.Sleep(3 * time.Nanosecond)
			sharedLock.Unlock()
			count++
		}
		fmt.Printf("Greedy worker was able to execut %v work in loops\n", count)
	}

	politeWorker := func() {
		defer wg.Done()
		var count int
		for begin := time.Now(); time.Since(begin) <= runtime; {
			sharedLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			sharedLock.Unlock()

			sharedLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			sharedLock.Unlock()

			sharedLock.Lock()
			time.Sleep(1 * time.Nanosecond)
			sharedLock.Unlock()

			count++
		}
		fmt.Printf("Polite worker was able to execut %v work in loops\n", count)
	}
	wg.Add(2)
	go greedyWorker()
	go politeWorker()
	wg.Wait()
```

Result:
```
Greedy worker was able to execute 1563591 work in loops
Polite worker was able to execute 763330 work in loops
```

As we can see the greedy goroutine did much more work than the polite goroutine. This is because the greedy goroutine holds on to the shared lock much longer than is needed. The polite goroutine locks the memory only for when it needs to for it's critical sections.

In this case it was quite easy to spot the starvation because we have a metric! This is why it's so important to have metrics in your program.
