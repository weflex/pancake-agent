exports.createPromiseCallback = createPromiseCallback;

function createPromiseCallback() {
  var cb;
  var promise = new global.Promise(function(resolve, reject) {
    cb = function(err, data) {
      if (err) return reject(err);
      return resolve(data);
    };
  });
  cb.promise = promise;
  return cb;
}
