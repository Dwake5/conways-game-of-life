## Live version

https://dwake5.github.io/conways-game-of-life/

## Game of Life

John Conway was a mathematician who died of Coronavirus, he was arguably best known for his cellular automata The Game of Life (Life), this tied with my long standing interest in the simulation I decided to program it. I have added a few features that I havent seen elsewhere, namely the ability to change The Rules of Life.


## What is it?

The goal of Life was to show how a large amount of complexity and chaos can result from very simple rules. It is non deterministic in that you can't tell the starting sequence for a given arrangement, or where a starting arrangement will end up.

Cells represent little communities. To start some cells are placed on the grid and then after each iteration or generation that passes dead cells can come alive or alive cells can die. The rules were designed to not allow for rapid or expansive growth.
If a cell has too few neigbours it dies as if by loneliness, with too many it dies of overcrowding. A dead cell can be repopulated with the correct amount of neighbours. 


## The Rules (condensed)

All rules cover the 8 directions, adjacents and diagonals. 

If an alive cell has two or three alive neighbours, it continues to live on. 

If a dead cell has exactly three alive neighbours, it becomes alive.


## Features Added

Play the game of life.

A grid which start off as 20px squares, but can be reduced to 10px.

Iteration speed, starting at 500ms, but adjustable from 100 to 1000ms.

A list of presets showing some of the more interesting configurations. 

The users ability to change the rules of life, min to max alive and min to max repopulation conditions. 

Drag and hold to activate many squares.


## Technical Challenges

This was a fun little project with many problems to solve like all projects. Most of the challenge comes from having a prototype built, which wasnt too cumbersome. 
I was able to resuse a lot of code from my last project.

Counting the number of adjacent alive tiles deemed the first issue, its an easy task to count around it, but not if your on the edge, where there arent any tiles to evaulate. The work around for this was to set up && statements to check if the current tile was on the edge, by comparing it to > 0 or < tilesEdge essentially. This would then look in each direction for each square and increment the alive neighbours variable.

One problem was that I wanted the simulation to automatically use the new iteration speed without making a new set of cells. This didnt work with setInterval as that is declared once and never read again. SetTimeout was the next idea, but was hard to configure with a pause/run button. The way I solved this is saving the starting iterationSpeed on function run, and then using setInterval checked the paused bolean. If it wasnt paused it would then see if the global variable set by the iterationspeed slider had changed, if it had it would clear the interval and recall itself. 

Coding presets by hand would have taken an incredibly long time, as I would have had to find the tiles location and then write each one down. Hundred and hundreds of times, making no mistakes or it would mess up the intended effect or the preset. So what I did is add a new button to the page which called a function that would return a 2d array of all alive cells. Meaning I could draw a preset, hit a button and post the log into the presets object.


## Further information

It was first speculated that no patterns could grow indefinitely. This was disproven,10 years after its inception, in 1980 when 'guns' were discovered. Guns osicilate over a few periods whilst launching smaller objects in a certain direction. 

Four main meta patterns that emerge, with decreasing rarity, are-

Still lifes: A segment that will stay still.

Oscillators: They will oscilate between a few patterns.

Spaceships: They travel in one direction endlessly.

Guns: They will continue to osciallate whilst creating new spaceships.

However many patterns have been created some that expand in all directions endlessly and some that launch spaceships in all directions. 

Here is an epic video: https://www.youtube.com/watch?v=C2vgICfQawE
