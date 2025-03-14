 
export function returnResponse<T>(statusCode: number, success: boolean, message : string, data?: T): string {
    return JSON.stringify({
        success,
        message,
        statusCode,
        data
  });
}