// package: model
// file: model/book.proto

var model_book_pb = require("../model/book_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var BookService = (function () {
  function BookService() {}
  BookService.serviceName = "model.BookService";
  return BookService;
}());

BookService.GetBook = {
  methodName: "GetBook",
  service: BookService,
  requestStream: false,
  responseStream: false,
  requestType: model_book_pb.GetBookRequest,
  responseType: model_book_pb.Book
};

BookService.QueryBooks = {
  methodName: "QueryBooks",
  service: BookService,
  requestStream: false,
  responseStream: true,
  requestType: model_book_pb.QueryBooksRequest,
  responseType: model_book_pb.Book
};

exports.BookService = BookService;

function BookServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BookServiceClient.prototype.getBook = function getBook(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(BookService.GetBook, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BookServiceClient.prototype.queryBooks = function queryBooks(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(BookService.QueryBooks, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.BookServiceClient = BookServiceClient;

