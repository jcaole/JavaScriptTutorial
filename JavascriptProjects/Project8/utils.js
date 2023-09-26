/*
* File name: player.js
* Author: Jeremy Caole
* Description: Display status text
*/

export function DrawStatusText(context, input) {
    context.font = '30px Helvetica';
    context.fillText('Last input: ' + input.lastKey, 20, 50);
}