8-Bit Compiler
===

This is a project to write a compiler for Ben Eater's 8-bit computer.

The computer used in this compiler has a few modifications to Eaters.

- It has a jump equal to zero and jump less than zero instruction
- It has 8 bit instruction data
- It has an 8 bit memory address register

Machine - Assembly compiler
---

This is the Machine code generator. It will take an assembly file that you give
it and will convert it to code that the computer can run.

The first thing you will need to do to run the compiler is to install [NodeJs](https://nodejs.org/en/download/package-manager/).

After you have node js installed you can install the dependencies by running:

```
$ cd Machine
$ npm install
```

To run the compiler use the following command:
```
$ node index.js <input file> <output file>
```

The compiler can optionally upload to the programmer Arduino by specifying a port
to use.

```
$ node index.js <input file> <output file> /dev/<device name>
```

Programmer
---

The programmer is a sketch that is run on an Arduino Mega to upload the code
to the 8-bit computer. By default the sketch is set up to use the pins 22, 24, 26, 28, 30, 32, 34, and 36 as the address pins and pins 23, 25, 27, 29, 31, 33, 35, and 37 for the data. Pin 21 is used for the write functionality and pin 20 is used to specify if the data should go into instruction or data space.

It is important to note that the switches on the 8-bit computer should all be turned off to prevent a short and that the Arduino needs to be connected to the power of the computer.

Simulator
---

A live version of the simulator can be found at [LINK](LINK). The simulator uses the compiler found in this project and provides a visual way to look at the registers as well as the contents of memory. The simulator also features a debugger which can be used to find bugs in your code. The same code can then be saved and uploaded to the computer using the programmer portion of this project.

If you want to build it yourself make sure you install the required libraries using:

```
$ npm install
```

After that you can compile the source by running:

```
$ npm run make
```

Alternatively you can have rollup watch the files for you using:

```
$ npm run watch
```

Attribution
---

This project makes hevy use of Code Mirror whose license can be found [here](https://codemirror.net/LICENSE).
