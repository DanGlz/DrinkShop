/**
 * Created by Dan gleyzer on 03-Aug-17.
 */
/**
 * Created by nitzan on 26/06/17.
 */
angular.module("myApp").factory('homePageProductsService', [function() {

    let service = {};
    service.newestProducts= [];
    service.topFiveProducts=[];
    return service;
}]);

