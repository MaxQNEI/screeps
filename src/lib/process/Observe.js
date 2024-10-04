export default function Observe() {
  Memory.NotiStack = Memory.NotiStack ?? {};

  const Notifications = {};

  // Collect
  for (const name in Game.rooms) {
    const room = Game.rooms[name];

    if (!Memory.NotiStack[name]) {
      const rcp = getRoomControllerProgress(room);

      const data = (Memory.NotiStack[name] = {
        level: room.controller.level,
        progress: rcp.p_10,
      });

      (Notifications.ObservationStart = Notifications.ObservationStart ?? []).push(
        [
          `Room[${room.name}] controller level observation started, current: ${data.level}`,
          `Room[${room.name}] controller progress observation started, current: ${rcp.current} of ${rcp.total} (${rcp.percent}%)`,
        ].join("\n"),
      );
    }

    const MNS = Memory.NotiStack[name];

    // Room controller level
    if (MNS.level !== room.controller.level) {
      MNS.level = room.controller.level;

      const notification = {
        type: "room-controller-level",
        level: room.controller.level,
        text: `Room[${room.name}].Controller level is changed to ${room.controller.level} (${room.controller.level - MNS.level})`,
      };

      (Notifications.RoomControllerLevel = Notifications.RoomControllerLevel ?? []).push(notification.text);
    }

    // Room controller progress
    const rcp = getRoomControllerProgress(room);
    if (MNS.progress !== rcp.p_10) {
      MNS.progress = rcp.p_10;

      const notification = {
        type: "room-controller-progress",
        progress: room.controller.progress,
        text: `Room[${room.name}].Controller progress is changed to ${rcp.current} of ${rcp.total} (${rcp.percent}%)`,
      };

      (Notifications.RoomControllerProgress = Notifications.RoomControllerProgress ?? []).push(notification.text);
    }
  }

  // Out
  for (const key in Notifications) {
    Game.notify(Notifications[key].join("\n\n"));
  }
}

function getRoomControllerProgress(room) {
  const controller = room.controller;

  const current = controller.progress;
  const total = controller.progressTotal;
  const percent = parseInt((current / total) * 100);
  const p_10 = Math.floor(percent / 10);

  return { current, total, percent, p_10 };
}
