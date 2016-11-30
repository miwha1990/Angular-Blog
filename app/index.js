import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';
import homeComponent from './home';
import statsComponent from './stats';
import navbarComponent from './common/navbar';
import headerComponent from './common/header';
import loginComponent from './login';
import registerComponent from './register';
import Auth from './auth.service';
import User from './user.service';
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.js";
import './index.styl'

const NAME = 'app';

angular
    .module(NAME, [
        uiRouter,
        homeComponent,
        statsComponent,
        navbarComponent,
        loginComponent,
        headerComponent,
        ngCookies,
        registerComponent
      ])
    .component(NAME, {
        template: '<header></header><navbar></navbar><div ui-view></div>'
     })
    .service('Auth', Auth)
    .service('User', User)
    .factory('sessionInjector',  function($cookies) {
         var sessionInjector = {
            request: function(config) {
                let auth_token = $cookies.get('token');

                config.headers['Access-Control-Allow-Origin'] = "*";
                config.headers['Authorization'] = `JWT ${auth_token}`;
                config.headers['Access-Control-Allow-Methods'] ="POST, PUT, GET, OPTIONS, DELETE";
                return config;
            }
        };
        return sessionInjector;
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('sessionInjector');
    }])
    .run((Auth) => {
        Auth.authenticate();
    })
;

export default NAME;