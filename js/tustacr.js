function TUSTACR(endpoint) {
    this.ref = new Firebase(endpoint);

    this.ref.child('keyToUrl').limit(1).on('value', function(record) {
        if (record.val()) {
            this.key = parseInt(Object.keys(record.val())[0]) + 1;
        }
        else {
            this.key = 0;
        }
    }.bind(this));
}

TUSTACR.prototype.getURLFromKey = function(key, callback) {
    this.ref.child('keyToUrl').child(key).once('value', function(record) {
        callback(record.val());
    });
};

TUSTACR.prototype.makeKey = function(url) {
    return url.replace(/[.$[\]\/\x00-\x1F\x7F]/g, '');
};

TUSTACR.prototype.addURLToKey = function(url, key) {
    var o = {};
    o[this.makeKey(url)] = key;
    this.ref.child('urlToKey').update(o);
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
        if (completed) {
            this.addURLToKey(result.val(), this.urlKey);
            successCallback(this.urlKey);
        }
        else {
            this.addNewURL(url, successCallback, errorCallback);
        }
    };

    this.urlKey = this.key;
    this.ref.child('keyToUrl').child(this.urlKey).transaction(transaction.bind(this), complete.bind(this));
};

TUSTACR.prototype.getKeyFromURL = function(url, successCallback, errorCallback) {
    this.ref.child('urlToKey/'+this.makeKey(url)).once('value', function(record) {
        if (record.val() != null) {
            successCallback(record.val());
        }
        else {
            this.addNewURL(url, successCallback, errorCallback);
        }
    }.bind(this));
};
