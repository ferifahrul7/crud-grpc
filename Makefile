book:
	protoc ./book.proto --js_out=import_style=commonjs,binary:../grpc-client/src/generated/ --grpc-web_out=import_style=commonjs,mode=grpcwebtext:../grpc-client/src/generated/ --go-grpc_out=../grpc-server/service/generated/ --go_out=../grpc-server/service/generated/