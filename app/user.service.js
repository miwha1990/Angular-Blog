/**
 * Created by dev6 on 04.07.16.
 */
class User {
    constructor($cookies, $q, $http, $rootScope) {
        this.$cookies = $cookies;
        this.$q = $q;
        this.$http = $http;
        this.$rootScope = $rootScope;
    }

    me() {
        var defer = this.$q.defer();
        if(this.$cookies.get('token')) {
            this.$http({
                method: 'GET',
                url: 'http://localhost:8081/me'
            }).then(
                (res) => {
                    this.$rootScope.$broadcast('User:me', res.data.data);
                    defer.resolve(res.data.data);
                },
                (x) => {
                    defer.reject(x);
                }
            );
        }
        return defer.promise;
    }
    
}
export default User;