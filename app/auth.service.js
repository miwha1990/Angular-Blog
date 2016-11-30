class Auth {
    constructor($http, $cookies, $location, $q, $rootScope, $timeout, User) {
        this.$cookies = $cookies;
        this.$http = $http;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.User = User;
    }

    login(name, password) {
        var defer = this.$q.defer();

        this.$http({
            method: 'POST',
            url: 'http://localhost:8081/auth/login',
            data: {name, password}
        }).then(
                (res) => {
                    this.$cookies.put('token', res.data.data);
                    this.$rootScope.$broadcast('Auth:login', res.data.data);
                    console.log('success');
                    defer.resolve(res.data.data);
                 },
                (x) => {
                    defer.resolve(x);
                }
            );
        return defer.promise;
    };

    logout() {
        var defer = this.$q.defer();
        this.$cookies.remove('token');
        this.$timeout(() => {
            this.$rootScope.$broadcast('Auth:logout', true);
            return defer.resolve()
        });
        return defer.promise;
    }

    register(name, password) {
        var defer = this.$q.defer();

        this.$http({
            method: 'POST',
            url: 'http://localhost:8081/users',
            data: {name, password}
        }).then(
                (res) => {
                    this.$rootScope.$broadcast('Auth:register', res.data.data);
                    defer.resolve(res.data.data);
                },
                (x) => {
                    defer.reject(x);
                }
            );
        return defer.promise;
    };

    authenticate() {
        var defer = this.$q.defer();

        if (!this.$cookies.get('token')) {
            defer.reject();
            this.$rootScope.$broadcast('Auth:authenticate', false);
        } else {
            this.User.me().then((user) => {
                this.$rootScope.$broadcast('Auth:authenticate', user);
                defer.resolve(user);
            })
        }

        return defer.promise;
    }
}

export default Auth