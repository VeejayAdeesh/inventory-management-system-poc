export enum PrismaErrorCode {
	RecordNotFound = "P2025",
	UniqueContraintFailed = "P2002",
	RelationViolationCode = "P2014",
}

export enum NetworkStatusCode {
	Created = 201,
	Ok = 200,
	BadRequest = 400,
	Unauthorized = 401,
	NotFound = 404,
	Conflit = 409,
	InternalServerError = 500,
	UnprocessableEntiry = 422,
}
