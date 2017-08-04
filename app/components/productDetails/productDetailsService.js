/**
 * Created by nitzan on 03/08/17.
 */


app.factory('productDetailsService', ['$http', function($http) {
    let service = {};

    service.setProduct = function (product ){
        service.product = product ;

    }
    service.getProduct = function(){
        return service.product ;
    }


    return service ;
}]);