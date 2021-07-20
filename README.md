<p align="center">
  <a href="https://liveblocks.io">
    <img src="https://liveblocks.io/icon-192x192.png" height="96">
    <h3 align="center">Liveblocks</h3>
  </a>
</p>

# Presence Block demo with an existing REST API

This repository contains a tiny demo to show how the Liveblocks Presence Block can be used on an existing "canvas" application.

Because it does not use the Liveblocks Storage, the conflict resolution is suboptimal but it's a low cost solution to add collaborative features on top on an existing app that uses REST calls.

https://user-images.githubusercontent.com/7273466/126260124-56ce0245-ad5f-46d9-901b-06a22f58fef3.mov


## How it's working

This demo uses the following packages:

- [@liveblocks/client](https://github.com/liveblocks/liveblocks) to broadcast messages to other users in the room
- [@liveblocks/node](https://github.com/liveblocks/liveblocks) to implement the liveblocks authentication endpoint.
- [Express](https://expressjs.com/) for the server
- [Esbuild](https://esbuild.github.io/) to generate the front-end bundle


![diagram](https://user-images.githubusercontent.com/7273466/126260307-0728a7fd-5e93-4305-82c1-bb58983fcade.png)
