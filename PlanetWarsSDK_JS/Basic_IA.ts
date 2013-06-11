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


///<reference path="SDK.ts"/>

/**
 * Invoquée tous les tours pour recuperer la liste des ordres à exécuter.
 * C'est la methode à modifier pour cabler son IA.
 * @param context:Galaxy
 * @return result:Array<Order>
*/
var getOrders = function (context: Galaxy): Order[] {
    var result: Order[] = [];
    var myPlanets: Planet[] = GameUtil.getPlayerPlanets(id.toString(), context);
    var otherPlanets: Planet[] = GameUtil.getEnnemyPlanets(id.toString(), context);
    if (otherPlanets != null && otherPlanets.length > 0) {
        for (var i in myPlanets)
        {
            var myPlanet: Planet = myPlanets[i];
            var target: Planet = getNearestEnnemyPlanet(myPlanet, otherPlanets);
            if (myPlanet.population >= 50) {
                result.push(new Order(myPlanet.id, target.id, 40));
            }
        }
    }
    return result;
};

var getNearestEnnemyPlanet = function (source: Planet, candidats: Planet[]): Planet
{
    var result: Planet = candidats[0];
    var currentDist: number = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(result.x, result.y));
    for (var i in candidats) {
        var element: Planet = candidats[i];
        if (currentDist > GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(element.x, element.y))) {
            currentDist = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(element.x, element.y));
            result = element;
        }

    }
    return result;
};