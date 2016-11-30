import angular from 'angular';
import Template from './home.html';
import menuComponemt from '../common/menu';

const NAME = 'home';

class homeCtrl {
    constructor($cookies, $q, $http, $rootScope, $scope){
        this.$cookies = $cookies;
        this.$q = $q;
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.get_all_users();
        $scope.$on('Auth:logout', (event, user) => {
            this.users = false;
        });
    }
    get_all_users() {
        var defer = this.$q.defer();
        if(this.$cookies.get('token')) {
            this.$http({
                method: 'GET',
                url: 'http://localhost:8081/users'
            }).then(
                (res) => {
                    defer.resolve(res.data.data);
                },
                (x) => {
                    defer.reject(x);
                }
            );
        }
         defer.promise.then((value)=>{this.users = value;})
    }
}


angular
    .module(NAME, [
        menuComponemt
    ])
    .component(NAME, {
        template: Template,
        controller: 'homeCtrl as vm',
        bindToController: true
    })
    .controller('homeCtrl', homeCtrl)
    .config(($stateProvider, MenuProvider) => {
        $stateProvider
            .state(
                NAME,
                {
                    url: '',
                    template: `<${NAME}></${NAME}>`
                }
            );

        MenuProvider
            .registerMenu(NAME,
                {
                    label: 'Home',
                    sref: NAME
                }
            )
        ;
    }
)
;

export default NAME;