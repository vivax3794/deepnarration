# Deepnarration node editor

This node editor ties together a lot of different apis, you can you the setup by just cloning the repo (with the right branch)
And then running the dev server.

```
npm install
npm run dev
```

## Limited Nodes
You might notice some nodes are not available, this is because they need some sort of auth or just their healthcheck failed.
Hover over the nodes should show why they are not available.

## Does it run server or client side?
Yes!

The node graph all runs in the browser, most api calls happen from the browser.
Auth calls that require oauth use the backend server as basically a proxy.
This means it *should* be safe to expose your instance publicly, but I wouldnt recommend it as stuff people use it for will happen in your name.

