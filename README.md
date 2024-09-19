# Scripts for the game [Screeps.com](https://screeps.com/)

---

# Help

## Room.lookAt examples:

```JavaScript
// Source (+Wall)
[
    {
        "type": "source",
        "source": {
            "room": {
                "name": "W41N48",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": { "roomName": "W41N48" }
            },
            "pos": { "x": 12, "y": 21, "roomName": "W41N48" },
            "id": "5bbcaac09099fc012e632228",
            "energy": 2950,
            "energyCapacity": 3000,
            "ticksToRegeneration": 33
        }
    },
    { "type": "terrain", "terrain": "wall" }
]

// Swapm + Creep
[
    {
        "type": "creep",
        "creep": {
            "room": {
                "name": "W41N48",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": { "roomName": "W41N48" }
            },
            "pos": { "x": 4, "y": 42, "roomName": "W41N48" },
            "id": "66ec58c021d37ef404bfa442",
            "name": "Harvester1",
            "body": [
                { "type": "work", "hits": 100 },
                { "type": "carry", "hits": 100 },
                { "type": "move", "hits": 100 }
            ],
            "my": true,
            "owner": { "username": "MaxQNEI" },
            "spawning": false,
            "ticksToLive": 743,
            "carryCapacity": 50,
            "carry": { "energy": 50 },
            "store": { "energy": 50 },
            "fatigue": 0,
            "hits": 300,
            "hitsMax": 300
        }
    },
    { "type": "terrain", "terrain": "plain" }
]


// Plain
[{ "type": "terrain", "terrain": "plain" }]

// Wall
[{ "type": "terrain", "terrain": "wall" }]

// Swamp
[{ "type": "terrain", "terrain": "swamp" }]
```