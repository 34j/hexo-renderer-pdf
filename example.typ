// Title should be set (Modified here)
#set document(title: "Fibonacci sequence (title)", author: ("Author1", "Author2"), date: datetime.today(), keywords: ("Fibonacci", "Math"))
// Math font must be set (Modified here)
#show math.equation: set text(font: "Cambria Math")

#set page(width: 10cm, height: auto)
#set heading(numbering: "1.")

= Fibonacci sequence
The Fibonacci sequence is defined through the
recurrence relation $F_n = F_(n-1) + F_(n-2)$.
It can also be expressed in _closed form:_

$ F_n = round(1 / sqrt(5) phi.alt^n), quad
phi.alt = (1 + sqrt(5)) / 2 $

#let count = 8
#let nums = range(1, count + 1)
#let fib(n) = (
if n <= 2 { 1 }
else { fib(n - 1) + fib(n - 2) }
)

The first #count numbers of the sequence are:

#align(center, table(
columns: count,
..nums.map(n => $F_#n$),
..nums.map(n => str(fib(n))),
))

#emoji.face.grin
