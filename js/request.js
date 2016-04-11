/**
 * 请求数据服务
 * option为请求参数
 * 调用方式为request(args)
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
app.factory('request', function ($http, $q) {

    return function (option) {
        return $http(option).then(function (response) {
            var defer = $q.defer();
            if(angular.isUndefined(response.data.code)){
                defer.reject({
                    type: -1,
                    data: response
                });
            }
            else if (response.data.code !== 0) {
                defer.reject({
                    type: 1,
                    data: response
                });
            } else {
                defer.resolve(response.data);
            }
            return defer.promise;
        }, function (err) {
            throw {
                type: -1,
                data: err
            };
        });
    };
});

// app.run(function (service, request) {
//     service.expand('request', function () {
//         return request;
//     });
// });