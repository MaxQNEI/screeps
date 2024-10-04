# Scripts for the game [Screeps.com](https://screeps.com/)

# Current Opportunities

1. Group jobs - Creep is created with grouped tasks - when completing a job in a group, the creep will attempt to perform another job from the same job group.

```JavaScript
[
    /* First group to work */
    [
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER_IF_NEEDED,
        CreepJob.TRANSFER_ENERGY_TO_SPAWN,
        CreepJob.TRANSFER_ENERGY_TO_EXTENSION,
        CreepJob.BUILD,
        CreepJob.TRANSFER_ENERGY_TO_CONTROLLER,
    ],
    /* Second group to work */
    [
        CreepJob.PICKUP_ENERGY,
        CreepJob.HARVEST_ENERGY,
    ],
    /* Other groups to work ... */
]
```

---

2. Spawning according to the limits specified in config.js
```JavaScript
Config.Room.Creeps.CountByRole....
```

```JavaScript
Memory.CreepsShow = false;
```

---

3. Respawning depending on the remaining ticks of a creep's life
```JavaScript
Config.Room.Creeps.AutoRespawnByTicksRemainingPercent = CREEP_LIFE_TIME / 0.1;
```

```JavaScript
Memory.CreepsShow = false;
```

---

4. Calculation of creep body by ratios

```JavaScript
new Creep().spawn({
    body: { [WORK]: 42, [CARRY]: 8, [MOVE]: 2 }
});

// similar (serious 😅)

new Creep().spawn({
    body: { [WORK]: .42, [CARRY]: .8, [MOVE]: .2 }
});
```

> **REQUIRES IMPROVEMENTS**

---

5. Randomly generated creep names by type “Firstname Lastname Role” (no filtering/censorship!)
```
Di Xybawo Bldr
Fawate-Wysi W. Hi Wrkr
Fi Mngr
Fic Tuusemaa Mngr
Fujeqeve Go-Wet Mngr
Gi-Byg Syxyyfe Wrkr
Gofol Bldr
Jevomi-Jemi Sa Wrkr
Jogaa Jisize Bldr
Juumu M. Kooxi Wrkr
Ki-Kul Fyjeguu Wrkr
Moogixe-Zur Wrkr
Nyy Di Wrkr
Riq J. Jimeki-Diz Bldr
Roomu Gevo Bldr
Sakyrigi Xe Mngr
Suri-Qivo Zuquciko Bldr
Waji-Fiti W. Bazo Mngr
We Keepa Wrkr
Zepo Bldr
```

---

6. Create roads depending on how often a creep passes through a tile
```JavaScript
Config.Room.Roads.RateToBuild = 100;
Config.Room.Roads.RateUpByCreep = 1;
Config.Room.Roads.RateDownByTick = 0.005;
```

```JavaScript
Memory.RoadsShow = false;
```

> **USES MEMORY**

---

7. “MemoryLog” - creeps logging, MemoryLog at the end of the loop'a outputs a table to the console.

![Screenshot of a comment on a GitHub issue showing an image, added in the Markdown, of an Octocat smiling and raising a tentacle.](/assets/MemoryLogOut.png)

```JavaScript
Memory.MemoryLogShow = true;
```

> **USES MEMORY**

---

8. Notifies about change of level or progress (0.1 from 100%) of Room Controller.  (Game.notify())

> **USES MEMORY**

---

9. Creeps say their status with emoji

> **USES MEMORY**

---

10.

---

## Not completed, to be continued.