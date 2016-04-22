var DashingReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
    var log = logger.create('reporter.dashing');
    var config = config.dashingReporter || {};

    baseReporterDecorator(this);

    this.adapters = [function(msg) {
        process.stdout.write.bind(process.stdout)(msg + '\r\n');
    }];

    this.onRunComplete = function(browsersCollection, results) {
        var self = this;
        var total = results.success + results.failed;

        var postData = {
            'auth_token': config.auth_token,
            'passed': results.success,
            'total': total
        };

        this.write('Posting to dashboard: ' + JSON.stringify(postData, null, 2));

        var request = require('request');

        request.post(
            config.url,
            { json: postData },
            function (error, response, body) {
                self.write('Posted to dashboard.  Response: ' + JSON.stringify(response, null, 2));
            }
        );
    };

};
DashingReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];
// PUBLISH DI MODULE
module.exports = {
    'reporter:dashing': ['type', DashingReporter]
};