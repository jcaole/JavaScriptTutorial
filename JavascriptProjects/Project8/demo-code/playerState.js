// spaghetti code
if (input === 'ArrowUp' && player.isStanding) {
    // jump
} else if (input === 'ArrowDown' && (player.isStanding || player.isRunning)) {
    //sit
} else if (input === 'ArrowDown' && player.isJumpting) {
    //dive
}

// Finite state machine

/* project 8:
 * how to implement STATE DESIGN PATTERN in a side-scroller game
 * how to use native JAVASCRIPT MODULES to split our code into multiple parts
 * 
 */

/* 4 principles of OOP
 * Encapsulation
 * Inheritance
 * Polymorphism
 * Abstraction
 */

/* Types of exports:
 * Named exports - can have multiple
 * Default exports - can only have 1
 * 
*/

/* Default: import Player from "./player.js";
 * Named: import {Player} from "./player.js";
 */