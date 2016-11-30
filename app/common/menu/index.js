/**
 * Created by dev6 on 01.07.16.
 */
import angular from 'angular';
import MenuProvider from './menu.provider';

const NAME = 'menu';

angular
    .module(NAME, [])
    .provider('Menu', MenuProvider)
;

export default NAME;