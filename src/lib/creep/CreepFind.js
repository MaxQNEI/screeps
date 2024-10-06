import "../../../lib/Array.prototype.flat.js";
import { asc, desc } from "../../../lib/sort";
import distance from "../distance";
import CreepMessage from "./CreepMessage";

export default class CreepFind extends CreepMessage {
  static FIND_CONSTRUCTION_SITES_BY_DISTANCE = "FIND_CONSTRUCTION_SITES_BY_DISTANCE";
  static FIND_NEAR_DROPPED_RESOURCES = "FIND_NEAR_DROPPED_RESOURCES";
  static FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY = "FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY";
  static FIND_ROOM_CONTROLLER = "FIND_ROOM_CONTROLLER";
  static FIND_SOURCES_BY_DISTANCE = "FIND_SOURCES_BY_DISTANCE";
  static FIND_SPAWN_TO_SPAWN_CREEP_BY_COST = "FIND_SPAWN_TO_SPAWN_CREEP_BY_COST";
  static FIND_SPAWN_WITH_FREE_CAPACITY = "FIND_SPAWN_WITH_FREE_CAPACITY";
  static FIND_SPAWNS_ORDER_BY_ENERGY = "FIND_SPAWNS_ORDER_BY_ENERGY";
  static FIND_TOWER_WITH_FREE_CAPACITY = "FIND_TOWER_WITH_FREE_CAPACITY";

  static COUNTER = 0;

  find(findType = CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY, parameters = { cost: 0, desc: false, type: null }) {
    const _room = this.creep?.room ?? this.parameters.room;
    const _sort = parameters.desc ? desc : asc;

    if (findType === CreepFind.FIND_CONSTRUCTION_SITES_BY_DISTANCE) {
      // const constructionSites = _room
      //   .find(FIND_MY_CONSTRUCTION_SITES)
      //   .map((constructionSite) => ({
      //     origin: constructionSite,
      //     distance: distance(this.creep.pos, constructionSite.pos),
      //     progressTotal: constructionSite.progressTotal,
      //   }))
      //   .sort(({ distance: a }, { distance: b }) => _sort(a, b))
      //   .map(({ origin }) => origin);

      let constructionSites = _room
        .find(FIND_MY_CONSTRUCTION_SITES)
        .map((constructionSite) => ({
          origin: constructionSite,
          distance: distance(this.creep.pos, constructionSite.pos),
          progressTotal: constructionSite.progressTotal,
        }))
        .sort(({ distance: a }, { distance: b }) => _sort(a, b));

      let counstructionSitesByStructureType = {};
      for (const constructionSite of constructionSites) {
        counstructionSitesByStructureType[constructionSite.origin.structureType] =
          counstructionSitesByStructureType[constructionSite.origin.structureType] ?? [];
        counstructionSitesByStructureType[constructionSite.origin.structureType].push(constructionSite);
      }

      for (const structureType in counstructionSitesByStructureType) {
        counstructionSitesByStructureType[structureType] = counstructionSitesByStructureType[structureType].sort(
          ({ progressTotal: a }, { progressTotal: b }) => asc(a, b),
        );
      }

      const sortedByProgressTotal = Object.values(counstructionSitesByStructureType).flat(Infinity);

      return sortedByProgressTotal.map(({ origin }) => origin);
    }

    if (findType === CreepFind.FIND_NEAR_DROPPED_RESOURCES) {
      const sources = _room
        .find(FIND_DROPPED_RESOURCES)
        .map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => asc(a, b))
        .map(({ origin }) => origin);

      return sources;
    }

    if (findType === CreepFind.FIND_NEAR_EXTENSION_WITH_FREE_CAPACITY) {
      const extensions = _room
        .find(FIND_MY_STRUCTURES)
        .filter(
          ({ structureType, store }) =>
            structureType === STRUCTURE_EXTENSION && store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        )
        .map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => asc(a, b))
        .map(({ origin }) => origin);

      return extensions;
    }

    if (findType === CreepFind.FIND_ROOM_CONTROLLER) {
      return _room.controller;
    }

    if (findType === CreepFind.FIND_SOURCES_BY_DISTANCE) {
      const sources = _room
        .find(FIND_SOURCES)
        .map((source) => ({
          origin: source,
          distance: distance(this.creep.pos, source.pos),
        }))
        .sort(({ distance: a }, { distance: b }) => asc(a, b))
        .map(({ origin }) => origin);

      return sources;
    }

    if (findType === CreepFind.FIND_SPAWN_TO_SPAWN_CREEP_BY_COST) {
      for (const nameSpawn in Game.spawns) {
        const spawn = Game.spawns[nameSpawn];

        if (spawn.room === _room && spawn.store[RESOURCE_ENERGY] >= parameters.cost) {
          return spawn;
        }
      }

      return false;
    }

    if (findType === CreepFind.FIND_SPAWN_WITH_FREE_CAPACITY) {
      const spawns = _room
        .find(FIND_MY_SPAWNS)
        .map((spawn) => ({
          origin: spawn,
          free: spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          distance: distance(this.creep.pos, spawn.pos),
        }))
        .filter(({ free }) => free > 0)
        .sort(({ free: a }, { free: b }) => _sort(a, b))
        .map(({ origin }) => origin);

      return spawns;
    }

    if (findType === CreepFind.FIND_SPAWNS_ORDER_BY_ENERGY) {
      const spawns = [];

      for (const nameSpawn in Game.spawns) {
        const spawn = Game.spawns[nameSpawn];

        if (spawn.room === _room) {
          spawns.push({
            origin: spawn,
            energy: spawn.store.energy,
          });
        }
      }

      return spawns //
        .sort(({ energy: a }, { energy: b }) => _sort(a, b))
        .map(({ origin }) => origin);
    }

    if (findType === CreepFind.FIND_TOWER_WITH_FREE_CAPACITY) {
      const towers = _room
        .find(FIND_MY_STRUCTURES)
        .filter(
          ({ structureType, store }) => structureType === STRUCTURE_TOWER && store.getFreeCapacity(RESOURCE_ENERGY) > 0,
        )
        .map((tower) => ({
          origin: tower,
          free: tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
          distance: distance(this.creep.pos, tower.pos),
        }))
        .filter(({ free }) => free > 0)
        .sort(({ free: a }, { free: b }) => _sort(a, b))
        .map(({ origin }) => origin);

      return towers;
    }
  }
}
