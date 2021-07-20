import { createClient } from "@liveblocks/client";

const client = createClient({
  authEndpoint: "/auth",
});

const room = client.enter("canvas-presence-only");

const container = document.getElementById("container");

async function initCanvas() {
  let dragInfo = null;

  const res = await fetch("/items");
  const { items } = await res.json();

  const itemsMap = new Map();

  container.addEventListener("pointermove", (e) => {
    // If the user is dragging
    if (dragInfo) {
      const { id, startPosition } = dragInfo;

      // get the dragged item from the state
      const item = itemsMap.get(id);
      // and the svg element associated to it
      const rect = document.getElementById(id);

      // then update its position based on dragging offset
      const newPosition = {
        x: item.x + e.clientX - startPosition.x,
        y: item.y + e.clientY - startPosition.y,
      };

      rect.setAttribute(
        "transform",
        `translate(${newPosition.x},${newPosition.y})`
      );

      // It's also possible to send an event (or use user presence)
      // to move the rectangles on every pointer movement
      // for an even better result
      // See this example https://github.com/liveblocks/javascript-examples for more information
    }
  });

  container.addEventListener("pointerup", async (e) => {
    if (dragInfo) {
      const { id, startPosition } = dragInfo;
      const item = itemsMap.get(id);

      const newPosition = {
        x: item.x + e.clientX - startPosition.x,
        y: item.y + e.clientY - startPosition.y,
      };
      item.x = newPosition.x;
      item.y = newPosition.y;
      dragInfo = null;

      // Only save the item position on pointer up to avoid calling the API too often
      await fetch(`/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item.id,
          x: item.x,
          y: item.y,
        }),
      });

      // Notify everyone in the room that they need to refresh the item position
      room.broadcastEvent({ type: "REFRESH", itemId: item.id });
    }
  });

  room.subscribe("event", async ({ event }) => {
    if (event.type === "REFRESH") {
      const response = await fetch(`/items/${event.itemId}`);
      const item = await response.json();

      itemsMap.set(item.id, item);

      const rect = document.getElementById(event.itemId);
      rect.setAttribute("transform", `translate(${item.x},${item.y})`);
    }
  });

  for (const item of items) {
    itemsMap.set(item.id, item);

    // Create a rectangle and insert it to the dom
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", item.id);
    rect.setAttribute("transform", `translate(${item.x},${item.y})`);
    rect.setAttribute("height", "50");
    rect.setAttribute("width", "50");
    rect.setAttribute("fill", "#9a69f5");
    rect.style.transition = "all 0.5s cubic-bezier(.17,.93,.38,1)";

    rect.addEventListener("pointerdown", (e) => {
      // Start the drag operation on rectangle pointer down
      dragInfo = {
        id: item.id,
        startPosition: { x: e.clientX, y: e.clientY },
      };
    });
    container.appendChild(rect);
  }
}

initCanvas();
