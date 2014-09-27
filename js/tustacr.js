function TUSTACR(endpoint) {
    this.ref = new Firebase(endpoint);

    this.ref.limit(1).on('value', function(record) {
        if (record.val()) {
            this.key = parseInt(Object.keys(record.val())[0]);
        }
        else {
            this.key = 0;
        }
    }.bind(this));
}

TUSTACR.prototype.getURLFromKey = function(key, callback) {
    this.ref.child(key).once('value', function(record) {
        callback(record.val());
    });
};

TUSTACR.prototype.addNewURL = function(url, successCallback, errorCallback) {
    var transaction = function(record) {
        if (!record) {
            return url;
        }
    };

    var complete = function(error, completed, result) {
        if (error) {
            errorCallback('Whoops! Something went very wrong.');
            return;
        }
        this.key++;
        if (completed) {
            successCallback(this.urlKey, result.val());
        }
        else {
            this.addNewURL(url, successCallback, errorCallback);
        }
    };

    this.urlKey = this.key;
    this.ref.child(this.key).transaction(transaction.bind(this), complete.bind(this));
};

TUSTACR.prototype.getKeyFromURL = function(url, successCallback, errorCallback) {
    this.addNewURL(url, successCallback, errorCallback);
};
