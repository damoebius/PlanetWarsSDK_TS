var getOrders = function (context) {
    var result = [];
    var myPlanets = GameUtil.getPlayerPlanets(id.toString(), context);
    var otherPlanets = GameUtil.getEnnemyPlanets(id.toString(), context);
    if(otherPlanets != null && otherPlanets.length > 0) {
        for(var i in myPlanets) {
            var myPlanet = myPlanets[i];
            var target = getNearestEnnemyPlanet(myPlanet, otherPlanets);
            if(myPlanet.population >= 50) {
                result.push(new Order(myPlanet.id, target.id, 40));
            }
        }
    }
    return result;
};
var getNearestEnnemyPlanet = function (source, candidats) {
    var result = candidats[0];
    var currentDist = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(result.x, result.y));
    for(var i in candidats) {
        var element = candidats[i];
        if(currentDist > GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(element.x, element.y))) {
            currentDist = GameUtil.getDistanceBetween(new Point(source.x, source.y), new Point(element.x, element.y));
            result = element;
        }
    }
    return result;
};
