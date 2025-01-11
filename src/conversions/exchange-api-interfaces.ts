export interface ConversionRequestBody {
    sourceCurrency: string;
    targetCurrency: string;
    amount: number;
  }

export interface SuccessResponseConversionApi {
    result?: "success";
    documentation?: string;
    terms_of_use?: string;
    time_last_update_unix?: number;
    time_last_update_utc?: string;
    time_next_update_unix?: number;
    time_next_update_utc?: string;
    base_code?: string;
    target_code?: string;
    conversion_rate: number;
    conversion_result: number;
  }
  export interface ErrorResponseConversionApi {
    result: "error";
    "error-type": ErrorTypeConversionApi;
  }
  
  export type ErrorTypeConversionApi =
    | "unsupported-code"
    | "malformed-request"
    | "invalid-key"
    | "inactive-account"
    | "quota-reached";
  
    export type ApiResponseConversionApi = SuccessResponseConversionApi | ErrorResponseConversionApi;
