import angular from 'angular';
import ngCookies from 'angular-cookies';
import Template from './login.template.html';
import homeComponent from '../home';
import menuComponent from '../common/menu';

const NAME = 'login';


class LoginController {

    constructor(Auth, $scope, $state, $cookies, Menu) {
        this.Auth = Auth;
        this.$scope = $scope;
        this.$state = $state;
        this.$cookies = $cookies;
    }

    login() {
        this.Auth.login(this.user.name, this.user.password).then(
            (user) => {
                this.$state.go(homeComponent)
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
        controller: 'LoginController as vm'
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
                    label: 'Login',
                    sref: NAME
                }
            );
    })
    .controller('LoginController', LoginController)
    .run(($rootScope, Menu) => {
        
        $rootScope.$on('Auth:login', () => {
            Menu.hideItem(NAME)
        });

/*        $rootScope.$on('Auth:authenticate', () => {
            Menu.hideItem(NAME)
        });*/

        $rootScope.$on('Auth:logout', () => {
            Menu.showItem(NAME)
        });
    })

;

export default NAME;