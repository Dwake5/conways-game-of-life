## Game of Life

John Conway was a mathematician who died of Coronavirus, he was arguably best known for his simulation game The Game of Life (Life), this tied with my long standing interest in the simulation I decided to program it. I have added a few features that I havent seen elsewhere, namely the ability to change The Rules of Life.


## What is it?

The goal of Life was to show how a large amount of complexity and chaos can result from very simple rules. Cells represent little communities. To start some cells are placed on the grid and then after each iteration or generation that passes dead cells can come alive or alive cells can die. The rules were designed to not allow for rapid or expansive growth. 
If a cell has too few neigbours it dies as if by loneliness, with too many it dies of overcrowding. A dead cell can repopulate with the correct amount of neighbours as though seizing a niche habitation. 


## The Rules (condensed)

All rules cover the 8 directions, adjacents and diagonals. 

If an alive cell has two or three alive neighbours, it continues to live on. 
If a dead cell has exactly three alive neighbours, it becomes alive.


## Features added

Play the game of life.
A grid which start off as 20px squares, but can be reduced to 10px.
Iteration speed, starting at 500ms, but adjustable from 100 to 1000ms.
A list of presets showing some of the more interesting configurations. 
The users ability to change the rules of life, min to max alive and min to max repopulation conditions. 
Drag and hold to activate many squares.


## Technical Challenges

This was a fun little project with many problems to solve like all projects. Most of the challenge comes from having a prototype built, which wasnt too cumbersome. 
I was able to resuse a lot of code from my last project.

One problem was 