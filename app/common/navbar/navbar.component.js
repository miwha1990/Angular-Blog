import tpl from './navbar.template.html';

class NavbarCtrl {
    constructor(Auth, $scope, $cookies, Menu, User, $rootScope) {

        this.links = Menu.all();
        this.$cookies = $cookies;
        this.User = User;
        this.$scope = $scope;
        this.Auth = Auth;
        this.$rootScope = $rootScope;


        $scope.$on('Auth:login', this.fetchMe.bind(this));
       
        $scope.$on('Auth:logout', (event, user) => {
             this.user = false;
        });
        
        this.fetchMe();
    }
   
    fetchMe() {
        this.User.me().then((user) => {
            this.user = user;
        });
    }

   logOut() {
        this.Auth.logout()
    }
}


angular
    .module('navbar')
    .controller('NavbarCtrl', NavbarCtrl)
    .component('navbar', {
        template: tpl,
        controller: 'NavbarCtrl as vm'
    })
;
