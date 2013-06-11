/*!
 * PlanetWars TypeScript SDK v0.1
 * http://www.tamina-online.com/expantionreloded/
 *
 *
 * Copyright 2013 Tamina
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * author : david mouton
 */
declare function postMessage(message: any): void;

/**
* nom de l'IA
*/
var name: string = "noname";

/**
 * couleur d'affichage
*/
var color: number = 0;

/** message de debugage
 *  utilisé par le systeme et affiché dans la trace à chaque tour du combat
*/
var debugMessage: string = "";

/* Id de l'IA */
var id: number = 0;

/**
 * @internal method
*/
onmessage = function (event) {
    if (event.data != null) {
        var turnMessage = event.data;
        id = turnMessage.playerId;
        postMessage(new TurnResult(getOrders(turnMessage.galaxy), debugMessage));      
    }
    else postMessage("data null");
};

/**
 * @internal method
*/
class TurnMessage {

    playerId: string;
    galaxy: Galaxy;

    constructor(playerId: string, galaxy: Galaxy) {
        this.playerId = playerId;
        this.galaxy = galaxy;
    }

}

/**
 * @internal method
*/
class TurnResult {

    orders: Order[];
    consoleMessage: string;
    error: string;

    constructor (orders: Order[], message?: string="")
        {
            this.orders = orders;
            this.consoleMessage = message;
            this.error = "";
        }

}

/**
 * @model Galaxy
 * @param width:Number largeur de la galaxy
 * @param height:Number hauteur de la galaxy
*/
class Galaxy {
    width: number;
    height: number;
    content: Planet[];
    firstPlayerHome: Planet;
    secondPlayerHome: Planet;
    fleet: Ship[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.content = [];
        this.fleet = [];
    }

    contains(planetId: string): bool {
        var result: bool = false;
        for (var i in this.content) {
            if (this.content[i].id == planetId) {
                result = true;
                break;
            }
        }
        return result;
    }
}

/**
 * @model Ship
 * @param crew:Number equipage
 * @param source:Planet origine
 * @param target:Planet cible
 * @param creationTurn:Number numero du tour de creation du vaisseau
*/
class Ship {

    creationTurn: number;
    crew: number;
    owner: IPlayer;
    source: Planet;
    target: Planet;
    travelDuration: number;

    constructor(crew: number, source: Planet, target: Planet, creationTurn: number) {
        this.crew = crew;
        this.source = source;
        this.target = target;
        this.owner = source.owner;
        this.creationTurn = creationTurn;
        this.travelDuration = Math.ceil(GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(target.x, target.y)) / Game.SHIP_SPEED);
    }
}

/**
 * Constantes
*/
class Game {
    static DEFAULT_PLAYER_POPULATION: number = 100;

    static PLANET_GROWTH: number = 5;
    static SHIP_SPEED: number = 60;
    static MAX_TURN_DURATION: number = 1000;

    static GAME_SPEED: number = 500;
    static GAME_DURATION: number = 240;
    static GAME_MAX_NUM_TURN: number = 500;


}

/**
 * Classe utilitaire
*/
class GameUtil {

    /**
     * @param p1:Point
     * @param p2:Point
     * @return result:Number la distance entre deux points
    */
    static getDistanceBetween(p1: Point, p2: Point): number {
        return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
    }

    /**
     * @param planetOwnerId:Number
     * @param context:Galaxy
     * @return result:Array<Planet> la liste des planetes appartenants à un joueur en particulier
    */
    static getPlayerPlanets(planetOwnerId: string, context: Galaxy): Planet[] {
        var result: Planet[] = [];
        for (var i in context.content) {
            var p: Planet = context.content[i];
            if (p.owner.id == planetOwnerId) {
                result.push(p);
            }

        }
        return result;
    }

    static getEnnemyPlanets(planetOwnerId: string, context: Galaxy): Planet[] {
        var result: Planet[] = [];
        for (var i in context.content) {
            var p: Planet = context.content[i];
            if (p.owner.id != planetOwnerId) {
                result.push(p);
            }

        }
        return result;
    }


}

/**
 * @model Point
 * @param x:Number
 * @param y:Number
*/
class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

}

/**
 * @model Planet
 * @param x:Number position en x
 * @param y:Number position en y
 * @param size:Number taille
 * @param owner:Player proprietaire
*/
class Planet {
    id: string;
    owner: IPlayer;
    population: number;
    size: number;
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0, size: number = 2, owner?: IPlayer = null) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.owner = owner;
        this.population = PlanetPopulation.getDefaultPopulation(size);
        this.id = UID.get().toString();
    }


}

interface IPlayer {
    id: string;
    name: string;
    color: number;
    script: string;

    getOrders(context: Galaxy): Order[];
}

class Order {
    numUnits: number;
    sourceID: string;
    targetID: string;

    constructor(sourceID: string, targetID: string, numUnits: number) {
        this.sourceID = sourceID;
        this.targetID = targetID;
        this.numUnits = numUnits;
    }

}

/**
 * Classe utilitaire
 * @internal
*/
class UID {

    private static _lastUID: number;

    public static get (): number {
        if (_lastUID == null) {
            _lastUID = 0;
        }
        _lastUID++;
        return _lastUID;
    }

}

/**
 * Constantes
*/
class PlanetPopulation {

    static DEFAULT_SMALL: number = 20;
    static DEFAULT_NORMAL: number = 30;
    static DEFAULT_BIG: number = 40;
    static DEFAULT_HUGE: number = 50;

    static MAX_SMALL: number = 50;
    static MAX_NORMAL: number = 100;
    static MAX_BIG: number = 200;
    static MAX_HUGE: number = 300;

    /**
     * Retourne le maximum de population en fonction de la taille de la planete
    */
    static getMaxPopulation(planetSize: number): number {
        var result: number = 1;
        switch (planetSize) {
            case PlanetSize.SMALL:
                result = PlanetPopulation.MAX_SMALL;
            case PlanetSize.NORMAL:
                result = PlanetPopulation.MAX_NORMAL;
            case PlanetSize.BIG:
                result = PlanetPopulation.MAX_BIG;
            case PlanetSize.HUGE:
                result = PlanetPopulation.MAX_HUGE;
        }
        return result;
    }

    /**
     * Retoune la population par defaut 
    */
    static getDefaultPopulation(planetSize: number): number {
        var result: number = 1;
        switch (planetSize) {
            case PlanetSize.SMALL:
                result = PlanetPopulation.DEFAULT_SMALL;
            case PlanetSize.NORMAL:
                result = PlanetPopulation.DEFAULT_NORMAL;
            case PlanetSize.BIG:
                result = PlanetPopulation.DEFAULT_BIG;
            case PlanetSize.HUGE:
                result = PlanetPopulation.DEFAULT_HUGE;
        }
        return result;
    }

}

/**
 * Constantes
*/
class PlanetSize {

    static SMALL: number = 1;
    static NORMAL: number = 2;
    static BIG: number = 3;
    static HUGE: number = 4;

    static SMALL_WIDTH: number = 20;
    static NORMAL_WIDTH: number = 30;
    static BIG_WIDTH: number = 50;
    static HUGE_WIDTH: number = 70;

    static SMALL_EXTENSION: string = "_small";
    static NORMAL_EXTENSION: string = "_normal";
    static BIG_EXTENSION: string = "_big";
    static HUGE_EXTENSION: string = "_huge";



}