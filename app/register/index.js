import angular from 'angular';
import Template from './register.template.html';
import loginComponent from '../login';
import menuComponent from '../common/menu';
import ngCookies from 'angular-cookies';
const NAME = 'registerform';

class RegisterController {

    constructor(Auth, $scope, $state) {
        this.Auth = Auth;
        this.$scope = $scope;
        this.$state = $state;
    }

    register() {
        this.Auth.register(this.user.name, this.user.password).then(
            (user) => {
                this.$state.go(loginComponent)
            },
            (x) => {
                this.$scope.errorMsg = x;
            }
        );
    }
}

angular
    .module(NAME, [
        ngCookies,
        menuComponent
    ])
    .component(NAME, {
        template: Template,
        controller: 'RegisterController as vm'
    })
    .config(($stateProvider, MenuProvider) => {
        $stateProvider
           .state(
                NAME,
                {
                    url: '/' + NAME,
                    template: `<${NAME}></${NAME}>`
                }
            );
        MenuProvider
            .registerMenu(
                NAME,
                {
                    label: 'Sing up',
                    sref: NAME
                }
            );
    })
    .controller('RegisterController', RegisterController)
    .run(($rootScope, Menu) => {

        $rootScope.$on('Auth:login', () => {
            Menu.hideItem(NAME)
        });
 /*       $rootScope.$on('Auth:authenticate', () => {
            Menu.hideItem(NAME)
        });*/
        $rootScope.$on('Auth:logout', () => {
            Menu.showItem(NAME)
        });
        
    })
;

export default NAME;