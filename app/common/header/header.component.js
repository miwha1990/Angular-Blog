import tpl from './header.template.html';
import pic from './Nature.jpg';
angular
    .module('header')
    .component('header', {
        template: tpl,
        controllerAs: 'vm',
        controller: function GreetUserController() {
            this.pic = pic;
        }
    });
